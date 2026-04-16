/* R1-R4 — Risk signal strip
   States: R1 critical, R2 pressure, R3 green-stable, R4 pressure */

const stateMap = {
  green:  'rt-green  tile-stable tile-green',
  yellow: 'rt-pressure tile-pressure',
  red:    'rt-critical tile-critical',
  slate:  'rt-stable tile-stable',
};

function RightRail({ metrics }) {
  return (
    <div className="column-rail">
      {metrics.map((item) => {
        const sc = stateMap[item.state] ?? 'rt-stable tile-stable';
        return (
          <div
            key={item.id}
            className={`rail-tile ${sc}${item.id === 'R4' ? ' rail-tile--client-risk' : ''}`}
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

export default RightRail;
