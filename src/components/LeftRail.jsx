/* D1-D4 — Demand signal strip
   States: D1 green-stable, D2 green-stable, D3 pressure, D4 green-stable */

const stateMap = {
  green:  'rt-green  tile-stable tile-green',
  yellow: 'rt-pressure tile-pressure',
  red:    'rt-critical tile-critical',
  slate:  'rt-stable tile-stable',
};

function LeftRail({ metrics }) {
  return (
    <div className="column-rail">
      {metrics.map((item) => {
        const sc = stateMap[item.state] ?? 'rt-stable tile-stable';
        return (
          <div
            key={item.id}
            className={`rail-tile ${sc}`}
            data-box-id={item.id}
          >
            <span className="rail-tile__label">{item.label}</span>
            <span className="rail-tile__value">{item.value}</span>
            {item.status && (
              <span className="rail-tile__status">{item.status}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default LeftRail;
