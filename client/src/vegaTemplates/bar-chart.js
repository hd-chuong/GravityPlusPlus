export default function barChartSchema(name, x, y, value) {
  console.log("inside bar-chart.js")
  return {
    "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
    "description": "Bar chart",
    "height": 400,
    "width": 640, 
    "autosize": {
      "type": "fit",
      "contains": "padding"
    },
    "data": {
      "name": name,
      "values": value
    },
    "mark": "bar",
    "encoding": {
      "x": {"field": x, "axis": {"labelAngle": 0}},
      "y": {"field": y, "type": "quantitative"}
    }
  }    
}