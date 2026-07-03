import { useEffect, useRef, useState } from 'react';
import BottomControlStrip from './components/BottomControlStrip';
import CenterViewTabs from './components/CenterViewTabs';
import HeroMarginDial from './components/HeroMarginDial';
import LeftRail from './components/LeftRail';
import LeftStack from './components/LeftStack';
import RightRail from './components/RightRail';
import RightStack from './components/RightStack';
import TopStatusBar from './components/TopStatusBar';
import { lensTabs } from './data/dashboardData';
import {
  applyActiveTabSnapshot,
  applyScheduledTileUpdate,
  buildSimulatedDashboard,
  detectPriorityOverride,
  FLIP_DWELL_MS,
  FOCUS_NOW_ROTATE_MS,
  getAutoFlipInterval,
  getAutoFlipTargetId,
  getFreshnessMinutes,
  getFocusSequenceCount,
  getScenarioFrameCount,
  getVisualCadenceSlot,
  INITIAL_NOW,
  OVERRIDE_HOLD_MS,
  OVERRIDE_WINDOW_MS,
  SIMULATED_RECOMPUTE_MS,
  VISUAL_CADENCE_MS,
  hasTileChanged,
  isFlipEligible,
} from './live/dashboardLiveModel.js';

/**
 * App — the single stateful component that drives the whole dashboard.
 *
 * All the pure "what should the board look like" logic lives in ./live/dashboardLiveModel.js.
 * App's only job is orchestration: own the React state, run the timers, and translate the model's
 * decisions into state updates. There is no server — everything is a self-driving simulation meant
 * to run unattended on a wall display.
 *
 * State falls into a few groups:
 *   - Clock / freshness: clockNow, lastRefreshMs.
 *   - Cadence counters that timers advance: scenarioStep, focusStep, visualStep.
 *   - The two dashboards: displayDashboard is what's on screen; targetDashboard is where it's
 *     heading. Timers migrate one tile at a time from target into display (see the live model),
 *     which is what makes the board update region-by-region instead of all at once.
 *   - Presentation/fullscreen flags and transient flip/hover/live-signal state.
 *
 * Why the *Ref mirrors below: several timers are created once (empty deps) but need the latest
 * value of state they don't want to re-subscribe to. Each ref mirrors a piece of state via a tiny
 * effect so those long-lived timer callbacks can read current values without being torn down and
 * recreated on every change.
 */
function App() {
  const initialTimestamp = new Date(INITIAL_NOW).getTime();
  const [activeTab, setActiveTab] = useState('M1');
  const [clockNow, setClockNow] = useState(() => new Date(INITIAL_NOW));
  const [lastRefreshMs, setLastRefreshMs] = useState(initialTimestamp);
  const [scenarioStep, setScenarioStep] = useState(0);
  const [focusStep, setFocusStep] = useState(0);
  const [visualStep, setVisualStep] = useState(-1);
  const [presentationMode, setPresentationMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [displayDashboard, setDisplayDashboard] = useState(() => buildSimulatedDashboard(0, 0));
  const [targetDashboard, setTargetDashboard] = useState(() => buildSimulatedDashboard(0, 0));
  const [liveSignalId, setLiveSignalId] = useState(null);
  const [flipStates, setFlipStates] = useState({});
  const [hoveredTileId, setHoveredTileId] = useState(null);

  // Timing bookkeeping (not mirrors of state):
  const lastOverrideAtRef = useRef(Number.NEGATIVE_INFINITY); // when the last priority override fired
  const suppressUntilRef = useRef(Number.NEGATIVE_INFINITY);  // hold quiet after an override until this ms
  const tabCyclePauseUntilRef = useRef(0);                    // pause auto tab-cycling after manual interaction
  const flipTimersRef = useRef({});                           // tileId -> pending setTimeout for flip release
  const nextAutoFlipAtRef = useRef({});                       // tileId -> earliest ms it may auto-flip again
  const processedVisualStepRef = useRef(Number.NEGATIVE_INFINITY); // guard so each visualStep runs once

  // Live mirrors of state, kept in sync by the effects below, so once-created timers read fresh values.
  const displayDashboardRef = useRef(displayDashboard);
  const targetDashboardRef = useRef(targetDashboard);
  const activeTabRef = useRef(activeTab);
  const focusStepRef = useRef(focusStep);
  const presentationModeRef = useRef(presentationMode);
  const hoveredTileIdRef = useRef(hoveredTileId);

  const activeView = displayDashboard.centerViews[activeTab] ?? displayDashboard.centerViews.M1;
  const activeLens = lensTabs.find((tab) => tab.id === activeTab)?.label ?? activeView.lensLabel;
  const freshnessMinutes = getFreshnessMinutes(clockNow.getTime(), lastRefreshMs);

  useEffect(() => {
    displayDashboardRef.current = displayDashboard;
  }, [displayDashboard]);

  useEffect(() => {
    targetDashboardRef.current = targetDashboard;
  }, [targetDashboard]);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    focusStepRef.current = focusStep;
  }, [focusStep]);

  useEffect(() => {
    presentationModeRef.current = presentationMode;
  }, [presentationMode]);

  useEffect(() => {
    hoveredTileIdRef.current = hoveredTileId;
  }, [hoveredTileId]);

  useEffect(() => {
    /* Wall clock: tick every second so the header time and freshness counter stay current. */
    const minuteTimer = window.setInterval(() => {
      setClockNow(new Date());
    }, 1_000);

    return () => window.clearInterval(minuteTimer);
  }, []);

  useEffect(() => {
    /* Focus Now is allowed to rotate its text every 30 seconds without changing layout. */
    const focusTimer = window.setInterval(() => {
      setFocusStep((previous) => {
        const nextStep = (previous + 1) % getFocusSequenceCount();
        setTargetDashboard(buildSimulatedDashboard(scenarioStep, nextStep));
        return nextStep;
      });
    }, FOCUS_NOW_ROTATE_MS);

    return () => window.clearInterval(focusTimer);
  }, [scenarioStep]);

  useEffect(() => {
    /* Scenario engine: every SIMULATED_RECOMPUTE_MS advance to the next frame and set it as the
       new target. If the new frame makes a high-priority tile worse, apply that one tile to the
       display immediately (subject to the override spacing/hold windows) so bad news jumps the
       cadence queue; everything else drips in one tile at a time via the visual cadence effect. */
    const recomputeTimer = window.setInterval(() => {
      setScenarioStep((previous) => {
        const nextStep = (previous + 1) % getScenarioFrameCount();
        const nextTarget = buildSimulatedDashboard(nextStep, focusStepRef.current);
        const overrideTileId = detectPriorityOverride(displayDashboardRef.current, nextTarget);
        const nowMs = Date.now();

        if (
          overrideTileId
          && (nowMs - lastOverrideAtRef.current) >= OVERRIDE_WINDOW_MS
        ) {
          setDisplayDashboard((currentDisplay) => applyScheduledTileUpdate(currentDisplay, nextTarget, overrideTileId, activeTabRef.current));
          setLiveSignalId(overrideTileId);
          lastOverrideAtRef.current = nowMs;
          suppressUntilRef.current = nowMs + OVERRIDE_HOLD_MS;
        }

        setTargetDashboard(nextTarget);
        setLastRefreshMs((refreshMs) => refreshMs + SIMULATED_RECOMPUTE_MS);
        return nextStep;
      });
    }, SIMULATED_RECOMPUTE_MS);

    return () => window.clearInterval(recomputeTimer);
  }, []);

  useEffect(() => {
    /* The "live" highlight on a tile is a brief pulse: clear it ~900ms after it is set. */
    const signalTimer = window.setTimeout(() => {
      setLiveSignalId(null);
    }, 900);

    return () => window.clearTimeout(signalTimer);
  }, [liveSignalId]);

  useEffect(() => {
    /* Each eligible flip tile gets a quiet deterministic cadence between 20 and 45 seconds. */
    ['D1', 'D2', 'D4', 'R2', 'R3', 'R4', 'B7', 'B8', 'B9'].forEach((tileId) => {
      if (!nextAutoFlipAtRef.current[tileId]) {
        nextAutoFlipAtRef.current[tileId] = Date.now() + getAutoFlipInterval(tileId);
      }
    });
  }, []);

  useEffect(() => {
    /* Heartbeat for region-by-region motion: just increments visualStep every VISUAL_CADENCE_MS.
       The effect below reacts to each new step and decides what (if anything) to animate. */
    const cadenceTimer = window.setInterval(() => {
      setVisualStep((previous) => previous + 1);
    }, VISUAL_CADENCE_MS);

    return () => window.clearInterval(cadenceTimer);
  }, []);

  useEffect(() => {
    /* React to one visual-cadence tick: either flip a due tile in the current region, or migrate
       the next changed tile from target into display. Guarded to run once per step, skipped during
       the post-override quiet window, and never flips while an override just landed. */
    if (visualStep < 0) {
      return;
    }

    if (processedVisualStepRef.current === visualStep) {
      return;
    }

    const nowMs = Date.now();
    const slot = getVisualCadenceSlot(visualStep, activeTab);
    processedVisualStepRef.current = visualStep;

    if (nowMs < suppressUntilRef.current) {
      return;
    }

    const hasActiveFlip = Object.values(flipStates).some(Boolean);
    const autoFlipTileId = getAutoFlipTargetId(
      visualStep,
      activeTab,
      displayDashboard,
      targetDashboard,
      nowMs,
      nextAutoFlipAtRef.current,
      presentationMode,
      hasActiveFlip,
    );

    if (autoFlipTileId) {
      setFlipStates((current) => ({ ...current, [autoFlipTileId]: true }));
      setLiveSignalId(autoFlipTileId);

      const releaseFlip = () => {
        if (hoveredTileIdRef.current === autoFlipTileId || presentationModeRef.current) {
          flipTimersRef.current[autoFlipTileId] = window.setTimeout(releaseFlip, 500);
          return;
        }

        setFlipStates((current) => ({ ...current, [autoFlipTileId]: false }));
        nextAutoFlipAtRef.current[autoFlipTileId] = Date.now() + getAutoFlipInterval(autoFlipTileId);
      };

      window.clearTimeout(flipTimersRef.current[autoFlipTileId]);
      flipTimersRef.current[autoFlipTileId] = window.setTimeout(releaseFlip, FLIP_DWELL_MS);
      return;
    }

    if (hasTileChanged(displayDashboard, targetDashboard, slot.targetId, activeTab)) {
      setDisplayDashboard((currentDisplay) => applyScheduledTileUpdate(currentDisplay, targetDashboard, slot.targetId, activeTab));
      setLiveSignalId(slot.targetId);
    }
  }, [activeTab, displayDashboard, flipStates, presentationMode, targetDashboard, visualStep]);

  useEffect(() => {
    if (!presentationMode) {
      return undefined;
    }

    /* Presentation mode suppresses flip behavior and non-essential micro-motion. */
    Object.values(flipTimersRef.current).forEach((timerId) => window.clearTimeout(timerId));
    setFlipStates({});
    return undefined;
  }, [presentationMode]);

  function setNextAutoFlip(tileId, pauseMs = 0) {
    nextAutoFlipAtRef.current[tileId] = Date.now() + getAutoFlipInterval(tileId) + pauseMs;
  }

  function handleManualFlip(tileId) {
    if (!isFlipEligible(tileId) || presentationMode) {
      return;
    }

    window.clearTimeout(flipTimersRef.current[tileId]);

    setFlipStates((current) => {
      const nextFlipped = !current[tileId];
      return { ...current, [tileId]: nextFlipped };
    });

    setNextAutoFlip(tileId, 12_000);
    setLiveSignalId(tileId);

    flipTimersRef.current[tileId] = window.setTimeout(() => {
      if (hoveredTileIdRef.current === tileId) {
        flipTimersRef.current[tileId] = window.setTimeout(() => {
          if (hoveredTileIdRef.current !== tileId) {
            setFlipStates((current) => ({ ...current, [tileId]: false }));
            setNextAutoFlip(tileId);
          }
        }, 500);
        return;
      }

      setFlipStates((current) => ({ ...current, [tileId]: false }));
      setNextAutoFlip(tileId);
    }, FLIP_DWELL_MS);
  }

  function handleFlipHover(tileId, isHovered) {
    if (!isFlipEligible(tileId)) {
      return;
    }

    setHoveredTileId(isHovered ? tileId : null);
  }

  function handlePresentationToggle() {
    setPresentationMode((current) => !current);
  }

  function handleFullscreenToggle() {
    const root = document.documentElement;
    if (!document.fullscreenElement && root.requestFullscreen) {
      root.requestFullscreen().catch(() => {});
    } else if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    function updateScale() {
      /* Reserve a true per-side safety inset so edge controls never shave in iframe mode. */
      const safeInset = document.fullscreenElement ? 0 : 24;
      const scale = Math.min(
        (window.innerWidth - (safeInset * 2)) / 1920,
        (window.innerHeight - (safeInset * 2)) / 1080,
      );
      document.documentElement.style.setProperty('--dash-scale', String(scale));
    }
    updateScale();
    window.addEventListener('resize', updateScale);
    document.addEventListener('fullscreenchange', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
      document.removeEventListener('fullscreenchange', updateScale);
    };
  }, []);

  function handleTabChange(nextTab) {
    setActiveTab(nextTab);
    setDisplayDashboard((currentDisplay) => applyActiveTabSnapshot(currentDisplay, targetDashboard, nextTab));
  }

  function cycleTab() {
    const order = ['M1', 'M2', 'M3'];
    const currentIdx = order.indexOf(activeTabRef.current);
    const nextTab = order[(currentIdx + 1) % order.length];
    setActiveTab(nextTab);
    setDisplayDashboard((currentDisplay) => applyActiveTabSnapshot(currentDisplay, targetDashboardRef.current, nextTab));
  }

  function handleManualTabChange(nextTab) {
    tabCyclePauseUntilRef.current = Date.now() + 90_000;
    handleTabChange(nextTab);
  }

  useEffect(() => {
    /* Passive wall-mode discoverability: quietly cycle the center lens every 30s unless in presentation mode or paused by manual interaction. */
    const tabTimer = window.setInterval(() => {
      if (presentationModeRef.current) return;
      if (Date.now() < tabCyclePauseUntilRef.current) return;
      cycleTab();
    }, 30_000);

    return () => window.clearInterval(tabTimer);
  }, []);

  return (
    <div className={`app-shell ${presentationMode ? 'is-presentation-mode' : ''} ${isFullscreen ? 'is-fullscreen' : ''}`}>
      <div className="screen-frame" data-scenario-step={scenarioStep}>
        <TopStatusBar
          now={clockNow}
          freshnessMinutes={freshnessMinutes}
          activeLensLabel={activeLens}
          statusCards={displayDashboard.statusCards}
          liveSignalId={liveSignalId}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleFullscreenToggle}
        />

        <main className="main-grid">
          <LeftRail
            metrics={displayDashboard.leftRailMetrics}
            liveSignalId={liveSignalId}
            flipStates={flipStates}
            onManualFlip={handleManualFlip}
            onFlipHover={handleFlipHover}
            presentationMode={presentationMode}
          />
          <LeftStack metrics={displayDashboard.leftStackMetrics} liveSignalId={liveSignalId} />

          <section className="center-column">
            <CenterViewTabs tabs={lensTabs} activeTab={activeTab} setActiveTab={handleManualTabChange} />
            <HeroMarginDial
              hero={activeView.hero}
              controls={activeView.controls}
              heroSignalId={`${activeTab}-hero`}
              liveSignalId={liveSignalId}
              presentationMode={presentationMode}
            />
          </section>

          <RightStack metrics={displayDashboard.rightStackMetrics} liveSignalId={liveSignalId} />
          <RightRail
            metrics={displayDashboard.rightRailMetrics}
            liveSignalId={liveSignalId}
            flipStates={flipStates}
            onManualFlip={handleManualFlip}
            onFlipHover={handleFlipHover}
            presentationMode={presentationMode}
          />
        </main>

        <BottomControlStrip
          bottomStrip={displayDashboard.bottomStrip}
          liveSignalId={liveSignalId}
          flipStates={flipStates}
          onManualFlip={handleManualFlip}
          onFlipHover={handleFlipHover}
          presentationMode={presentationMode}
          onTogglePresentationMode={handlePresentationToggle}
        />
      </div>
    </div>
  );
}

export default App;
