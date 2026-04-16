function FocusNowTile({ item }) {
  return (
    <div className="focus-now-tile" data-box-id={item.id}>
      <span className="focus-now-tile__label">{item.label}</span>
      <span className="focus-now-tile__value">{item.value}</span>
      <span className="focus-now-tile__sub">{item.subtext}</span>
    </div>
  );
}

export default FocusNowTile;
