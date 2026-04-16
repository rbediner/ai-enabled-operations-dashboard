function HeroMarginDial({ hero, controls, motionStep }) {
  const circumference = 2 * Math.PI * 130;
  const progress = Math.min(hero.value / hero.target, 1);
  const pulseOffset = (motionStep % 4) * 1.0;
  const dashOffset = circumference * (1 - progress) + pulseOffset;

  return (
    <div className="hero-zone">
      {/* H1 — Hero dial */}
      <div className="hero-dial" data-box-id={hero.id}>
        <svg viewBox="0 0 320 320" className="hero-dial__svg" aria-hidden="true">
          <defs>
            {/* Pressure-lean gradient — yellow to amber */}
            <linearGradient id="ringGradient" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%"   stopColor="#f2d24b" />
              <stop offset="55%"  stopColor="#e8a020" />
              <stop offset="100%" stopColor="#ff9520" />
            </linearGradient>
          </defs>
          <circle className="hero-dial__track"    cx="160" cy="160" r="130" />
          <circle
            className="hero-dial__progress"
            cx="160" cy="160" r="130"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>

        <div className="hero-dial__content">
          {/* Category tag */}
          <span className="hero-dial__label">{hero.label}</span>

          {/* Support line — keeps the center state tied to operating meaning */}
          <span className="hero-dial__support">{hero.support}</span>

          {/* Primary reading — where are we */}
          <strong className="hero-dial__value">{hero.valueDisplay}</strong>

          {/* Context block — the four answers */}
          <div className="hero-dial__context-block">
            <div className="hero-dial__context-row">
              <span className="hero-dial__ctx-label">Target</span>
              <span className="hero-dial__ctx-value">{hero.targetDisplay}</span>
            </div>
            <div className="hero-dial__context-row">
              <span className="hero-dial__ctx-label">Gap</span>
              <span className="hero-dial__ctx-value hero-dial__ctx-value--gap">{hero.gapDisplay}</span>
            </div>
            <div className="hero-dial__context-row">
              <span className="hero-dial__ctx-label">Trend</span>
              <span className="hero-dial__ctx-value hero-dial__ctx-value--trend">{hero.trendDisplay}</span>
            </div>
            <div className="hero-dial__context-row hero-dial__context-row--driver">
              <span className="hero-dial__ctx-label">{hero.driverLabel}</span>
              <span className="hero-dial__ctx-value hero-dial__ctx-value--driver">{hero.driverDisplay}</span>
            </div>
          </div>
        </div>
      </div>

      {/* H2 / H3 / H4 — Target controls */}
      <div className="hero-controls">
        <button
          type="button"
          className="hero-control hero-control--adj"
          aria-label={controls.minus.label}
          data-box-id={controls.minus.id}
        >
          −
        </button>

        <div className="hero-control hero-control--display" data-box-id={controls.display.id}>
          <span className="hero-control__label">{controls.display.label}</span>
          <strong>{controls.display.value}</strong>
        </div>

        <button
          type="button"
          className="hero-control hero-control--adj"
          aria-label={controls.plus.label}
          data-box-id={controls.plus.id}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default HeroMarginDial;
