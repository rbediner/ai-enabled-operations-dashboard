import { useEffect, useState } from 'react';
import BottomControlStrip from './components/BottomControlStrip';
import CenterViewTabs from './components/CenterViewTabs';
import HeroMarginDial from './components/HeroMarginDial';
import LeftRail from './components/LeftRail';
import LeftStack from './components/LeftStack';
import RightRail from './components/RightRail';
import RightStack from './components/RightStack';
import TopStatusBar from './components/TopStatusBar';
import {
  bottomStrip,
  centerViews,
  leftRailMetrics,
  leftStackMetrics,
  lensTabs,
  rightRailMetrics,
  rightStackMetrics,
  statusCards,
} from './data/dashboardData';

const freshnessLoop = [7, 6, 7, 8, 7, 6];

function App() {
  const [now, setNow] = useState(new Date('2026-04-15T17:09:00'));
  const [activeTab, setActiveTab] = useState('M1');
  const [motionStep, setMotionStep] = useState(0);
  const activeView = centerViews[activeTab] ?? centerViews.M1;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow((d) => new Date(d.getTime() + 60_000));
      setMotionStep((s) => (s + 1) % 24);
    }, 4000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="app-shell">
      <div className="screen-frame">
        <TopStatusBar
          now={now}
          freshnessMinutes={freshnessLoop[motionStep % freshnessLoop.length]}
          modeLabel={activeView.modeLabel}
          statusCards={statusCards}
        />

        <main className="main-grid">
          <LeftRail  metrics={leftRailMetrics} />
          <LeftStack metrics={leftStackMetrics} />

          <section className="center-column">
            <CenterViewTabs tabs={lensTabs} activeTab={activeTab} setActiveTab={setActiveTab} />
            <HeroMarginDial hero={activeView.hero} controls={activeView.controls} motionStep={motionStep} />
          </section>

          <RightStack metrics={rightStackMetrics} />
          <RightRail  metrics={rightRailMetrics} />
        </main>

        <BottomControlStrip bottomStrip={bottomStrip} />
      </div>
    </div>
  );
}

export default App;
