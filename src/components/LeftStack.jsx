/* C1 Forecast — Watch (tension: below target)
   C2 Close Rate — Stable (healthy)
   C3 Avg Deal — Stable (healthy) */

const stackStateMap = {
  green:  'st-stable  tile tile-stable tile-green',
  yellow: 'st-watch   tile tile-watch',
  red:    'st-pressure tile tile-pressure',
  slate:  'st-stable  tile tile-stable',
};

function LeftStack({ metrics }) {
  return (
    <div className="column-stack">
      {metrics.map((item) => {
        const sc = stackStateMap[item.state] ?? 'st-stable tile tile-stable';
        /* C1 Forecast is strategically elevated above peer stack tiles */
        const forecastCls = item.id === 'C1' ? ' st-forecast' : '';
        return (
          <div
            key={item.id}
            className={`stack-tile ${sc}${forecastCls}`}
            data-box-id={item.id}
          >
            <span className="stack-tile__label">{item.label}</span>
            <span className="stack-tile__value">{item.value}</span>
            {item.context && (
              <span className="stack-tile__context">{item.context}</span>
            )}
            {item.status && (
              <span className="stack-tile__status">{item.status}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default LeftStack;
