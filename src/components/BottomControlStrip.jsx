import FocusNowTile from './FocusNowTile';

/* B1-B11 bottom control strip.
   Nav icons | left controls | B6 directive | right controls | util icons */

function CtrlTile({ item }) {
  const watchStates = ['yellow', 'red'];
  const cls = watchStates.includes(item.state) ? 'ctrl-tile ct-watch' : 'ctrl-tile';

  if (item.icon) {
    return (
      <button type="button" className={`${cls} ctrl-tile--icon`} aria-label={item.label} data-box-id={item.id}>
        <span className={`ctrl-icon ctrl-icon--${item.icon}`} aria-hidden="true" />
      </button>
    );
  }

  return (
    <div className={cls} data-box-id={item.id}>
      <span className="ctrl-tile__label">{item.label}</span>
      <span className="ctrl-tile__value">{item.value}</span>
    </div>
  );
}

function BottomControlStrip({ bottomStrip }) {
  return (
    <footer className="bottom-control-strip">
      <div className="bottom-group bottom-group--nav">
        {bottomStrip.nav.map((item) => <CtrlTile key={item.id} item={item} />)}
      </div>

      <div className="bottom-group bottom-group--left">
        {bottomStrip.left.map((item) => <CtrlTile key={item.id} item={item} />)}
      </div>

      <FocusNowTile item={bottomStrip.focus} />

      <div className="bottom-group bottom-group--right">
        {bottomStrip.right.map((item) => <CtrlTile key={item.id} item={item} />)}
      </div>

      <div className="bottom-group bottom-group--util">
        {bottomStrip.util.map((item) => <CtrlTile key={item.id} item={item} />)}
      </div>
    </footer>
  );
}

export default BottomControlStrip;
