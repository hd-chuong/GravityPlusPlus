function barChartSchema(name, x, y) {
  return {
    "$schema": "https://vega.github.io/schema/vega/v5.json",
    "description": "A basic bar chart example, with value labels shown upon mouse hover.",
    "width": 400,
    "height": 200,
    "padding": 5,
  
    "data": [{ "name": name }],
  
    "signals": [
      {
        "name": "tooltip",
        "value": {},
        "on": [
          {"events": "rect:mouseover", "update": "datum"},
          {"events": "rect:mouseout",  "update": "{}"}
        ]
      }
    ],
  
    "scales": [
      {
        "name": "xscale",
        "type": "band",
        "domain": {"data": name, "field": x},
        "range": "width",
        "padding": 0.05,
        "round": true
      },
      {
        "name": "yscale",
        "domain": {"data": name, "field": y},
        "nice": true,
        "range": "height"
      }
    ],
  
    "axes": [
      { "orient": "bottom", "scale": "xscale" },
      { "orient": "left", "scale": "yscale" }
    ],
  
    "marks": [
      {
        "type": "rect",
        "from": {"data":name},
        "encode": {
          "enter": {
            "x": {"scale": "xscale", "field": x},
            "width": {"scale": "xscale", "band": 1},
            "y": {"scale": "yscale", "field": y},
            "y2": {"scale": "yscale", "value": 0}
          },
          "update": {
            "fill": {"value": "steelblue"}
          },
          "hover": {
            "fill": {"value": "red"}
          }
        }
      },
      {
        "type": "text",
        "encode": {
          "enter": {
            "align": {"value": "center"},
            "baseline": {"value": "bottom"},
            "fill": {"value": "#333"}
          },
          "update": {
            "x": {"scale": "xscale", "signal": `tooltip.${x}`, "band": 0.5},
            "y": {"scale": "yscale", "signal": `tooltip.${y}`, "offset": -2},
            "text": {"signal": `tooltip.${y}`},
            "fillOpacity": [
              {"test": "datum === tooltip", "value": 0},
              {"value": 1}
            ]
          }
        }
      }
    ]
  };
}

export default barChartSchema;