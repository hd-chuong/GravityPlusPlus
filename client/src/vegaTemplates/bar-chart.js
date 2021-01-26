export default function barChartSchema(name, x, y, value) {
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    description: 'Bar chart',
    width: "container",
    height: "container",
    data: {
      name: name,
      values: value,
    },

    mark: 'bar',
    encoding: {
      x: { field: x, axis: { labelAngle: 0 } },
      y: { field: y, type: 'quantitative' },
    },
  };
}
