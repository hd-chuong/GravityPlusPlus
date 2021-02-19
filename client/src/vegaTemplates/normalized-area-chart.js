export default function normalizedAreaSchema(tableName, x, y, category, value) {
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    data: {
      name: tableName,
      values: value,
    },
    width: "container",
    height: "container",
    mark: 'area',
    encoding: {
      x: {
        field: x,
        axis: { domain: false},
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
