export default function Scatterplot(tableName, x, y, color, shape, value) {
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    data: {
      name: tableName,
      values: value,
    },
    mark: 'point',
    encoding: {
      x: {
        field: x,
        type: 'quantitative',
        scale: { zero: false },
      },
      y: {
        field: y,
        type: 'quantitative',
        scale: { zero: false },
      },
      color: { field: color, type: 'nominal' },
      shape: { field: shape, type: 'nominal' },
    },
  };
}
