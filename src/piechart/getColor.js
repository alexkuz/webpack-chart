export default function getColor(level, idx) {
  const colors = ['#43A19E', '#7B43A1', '#F2317A', '#FF9824', '#58CF6C'];
  return colors[(level + idx) % 5];
}
