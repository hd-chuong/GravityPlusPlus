export default function lineChartSchema(tableName, x, y, category, value) {
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    description: 'Line Chart',
    width: "container",
    height: "container",
    data: {
      name: tableName,
      values: value,
    },
    mark: {
      type: 'line',
      point: {
        filled: true,
      },
    },
    encoding: {
      x: { field: x },
      y: { field: y, type: 'quantitative' },
      color: { field: category, type: 'nominal' },
    },
  };
}
