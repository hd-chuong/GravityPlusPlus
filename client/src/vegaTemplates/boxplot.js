export default function boxplotSchema(tableName, x, y, category, value) {
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    description: 'Vertical Box Plot',
    width: "container",
    height: "container",
    data: {
      name: tableName,
      values: value,
    },
    mark: {
      type: 'boxplot',
      extent: 'min-max',
    },
    encoding: {
      x: { field: x, type: 'nominal', axis: {labelAngle: 45, labelOverlap: false} },
      color: { field: category, type: 'nominal' },
      y: { field: y, type: 'quantitative', scale: { zero: false } },
    },
  };
}
