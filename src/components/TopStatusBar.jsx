function TopStatusBar({ now, freshnessMinutes, modeLabel, statusCards }) {
  const day  = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const logoSrc = `${import.meta.env.BASE_URL}canopy-logo.svg`;

  /* V2.7: state → CSS class + badge accent mapping */
  const stateClass = { green: 's-green', yellow: 's-yellow', red: 's-red' };

  return (
    <header className="top-status-bar">
      {/* T1 — Logo / identity */}
      <div className="logo-panel" data-box-id="T1">
        <img src={logoSrc} alt="Canopy Management" className="logo-panel__logo" />
        <div className="logo-panel__copy">
          <span className="logo-panel__eyebrow">Operating</span>
          <span className="logo-panel__name">Canopy Management</span>
        </div>
      </div>

      {/* T2 — Live context strip: date / time / freshness / mode */}
      <div className="freshness-panel" data-box-id="T2">
        <div className="freshness-panel__primary">
          <span className="freshness-panel__day">{day}</span>
          <span className="freshness-panel__time">{time}</span>
        </div>
        <div className="freshness-panel__secondary">
          <span className="signal-tick" />
          <span>Live · {freshnessMinutes}m ago</span>
          <span className="freshness-panel__mode">{modeLabel}</span>
        </div>
      </div>

      {/* T3-T6 — Executive HUD: each answers a real operating question */}
      <div className="status-badge-grid">
        {statusCards.map((item) => (
          <div
            key={item.id}
            className={`status-badge ${stateClass[item.state] ?? ''}`}
            data-box-id={item.id}
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
