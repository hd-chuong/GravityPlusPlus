export default function normalizedAreaSchema(tableName, x, y, category, value) {
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    data: {
      name: tableName,
      values: value,
    },
    width: 300,
    height: 200,
    mark: 'area',
    encoding: {
      x: {
        timeUnit: 'yearmonth',
        field: x,
        axis: { domain: false, format: '%Y' },
      },
      y: {
        aggregate: 'sum',
        field: y,
        axis: null,
        stack: 'normalize',
      },
      color: { field: category, scale: { scheme: 'category20b' } },
    },
  };
}
