export default function numberFormat() {
  return (value) => new Intl.NumberFormat().format(value);
}
