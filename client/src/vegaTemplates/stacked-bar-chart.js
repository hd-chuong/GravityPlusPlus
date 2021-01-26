export default function stackedBarChartSchema(
  tableName,
  x,
  y,
  category,
  value,
) {
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    width: "container",
    height: "container",
    data: {
      name: tableName,
      values: value,
    },
    mark: 'bar',
    encoding: {
      x: {
        field: x,
      },
      y: {
        aggregate: 'sum',
        field: y,
      },
      color: {
        field: category,
      },
    },
  };
}
