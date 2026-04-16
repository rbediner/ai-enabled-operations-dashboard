function TopStatusBar({ now, freshnessMinutes, activeLensLabel, statusCards, liveSignalId }) {
  const day = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const logoSrc = `${import.meta.env.BASE_URL}canopy-logo.svg`;

  const stateClass = { green: 's-green', yellow: 's-yellow', red: 's-red' };
  const freshnessClasses = liveSignalId === 'T2'
    ? 'freshness-panel live-region-active'
    : 'freshness-panel';

  return (
    <header className="top-status-bar">
      <div className="logo-panel" data-box-id="T1">
        <img src={logoSrc} alt="Canopy Management" className="logo-panel__logo" />
        <div className="logo-panel__copy">
          <span className="logo-panel__eyebrow">Operating</span>
          <span className="logo-panel__name">Canopy Management</span>
        </div>
      </div>

      <div className={freshnessClasses} data-box-id="T2" data-live-region={liveSignalId === 'T2' ? 'top' : 'idle'}>
        <div className="freshness-panel__primary">
          <span className="freshness-panel__day">{day}</span>
          <span className="freshness-panel__time">{time}</span>
        </div>

        <div className="freshness-panel__secondary freshness-panel__secondary--stacked">
          <span className="telemetry-token telemetry-token--mode">
            <span className="telemetry-key">Lens</span>
            <span className="telemetry-val freshness-panel__mode">{activeLensLabel}</span>
          </span>
          <span className="telemetry-token telemetry-token--live">
            <span className="signal-heartbeat" aria-hidden="true" />
            <span className="telemetry-key telemetry-key--live">LIVE</span>
            <span className="telemetry-val">{freshnessMinutes}m ago</span>
          </span>
        </div>
      </div>

      <div className="status-badge-grid">
        {statusCards.map((item) => (
          <div
            key={item.id}
            className={`status-badge ${stateClass[item.state] ?? ''}${item.id === liveSignalId ? ' live-region-active' : ''}`}
            data-box-id={item.id}
            data-live-region={item.id === liveSignalId ? 'top' : 'idle'}
          >
            <span className="status-badge__label">{item.label}</span>
            <span className="status-badge__value">{item.value}</span>
            <span className="status-badge__dot" />
          </div>
        ))}
      </div>
    </header>
  );
}

export default TopStatusBar;
