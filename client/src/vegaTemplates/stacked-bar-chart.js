export default function stackedBarChartSchema(
  tableName,
  x,
  y,
  category,
  value,
) {
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    autosize: {
      type: 'fit',
      contains: 'padding',
    },
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
