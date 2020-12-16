export default function lineChartSchema(tableName, x, y, category, value) {
    return {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "description": "Line chart",
        "width": 500,
        "height": 200,
        "padding": 5,
        "data": [
          {
            "name": tableName,
            "transform": [{
                "type": "collect",
                "sort": {"field": x, "order": "ascending"}
              }
            ],
            "values": value
          }
        ],
      
        "scales": [
          {
            "name": x,
            "type": "point",
            "range": "width",
            "domain": {"data": tableName, "field": x}
          },
          {
            "name": y,
            "type": "linear",
            "range": "height",
            "nice": true,
            "zero": true,
            "domain": {"data": tableName, "field": y}
          },
          {
            "name": "color",
            "type": "ordinal",
            "range": "category",
            "domain": {"data": tableName, "field": category}
          }
        ],
      
        "axes": [
          {"orient": "bottom", "scale": x, "title": x},
          {"orient": "left", "scale": y, "title": y}
        ],
      
        "marks": [
          {
            "type": "group",
            "from": {
              "facet": {
                "name": "series",
                "data": tableName,
                "groupby": category
              }
            },
            "marks": [
              {
                "type": "line",
                "from": {"data": "series"},
                "encode": {
                  "enter": {
                    "x": {"scale": x, "field": x},
                    "y": {"scale": y, "field": y},
                    "stroke": {"scale": "color", "field": category},
                    "strokeWidth": {"value": 4},
                    "tooltip": {"signal": "datum"}
                  },
                  "update": {
                    "strokeOpacity": {"value": 0.5}
                  },
                  "hover": {
                    "strokeOpacity": {"value": 1}
                  }
                }
              }
            ]
          }
        ],
        "legends": [
          {
            "fill": "color",
            "encode": {
              "title": {
                "update": {
                  "fontSize": {"value": 14}
                }
              }
            }
          }
      ]
      }
      

}  
  