export default function boxplotSchema(tableName, x, y, category, value) {
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    description: 'Vertical Box Plot',
    autosize: {
      type: 'fit',
      contains: 'padding',
    },
    data: {
      name: tableName,
      values: value,
    },
    mark: {
      type: 'boxplot',
      extent: 'min-max',
    },
    encoding: {
      x: { field: x, type: 'nominal' },
      color: { field: category, type: 'nominal' },
      y: { field: y, type: 'quantitative', scale: { zero: false } },
    },
  };
}
