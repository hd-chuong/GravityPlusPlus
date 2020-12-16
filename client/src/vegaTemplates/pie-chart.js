function pieChartSchema(tableName, x, y, value)
{
    return {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "description": "Pie chart",
        "width": 300,
        "height": 300,
        "padding": 5,
        "autosize": "fit",
        "data": [
          {
            "name": tableName,
            "values": value,
            "transform": [
              {
                "type": "pie",
                "field": y
              }
            ]
          }
        ],
        "scales": [
          {
            "name": "color",
            "type": "ordinal",
            "domain": {"data": tableName, "field": x},
            "range": {"scheme": "category20"}
          }
        ],
        "marks": [
          {
            "type": "arc",
            "from": {"data": tableName},
            "encode": {
              "enter": {
                "fill": {"scale": "color", "field": x},
                "x": {"signal": "width / 2"},
                "y": {"signal": "height / 2"},
                "startAngle": {"field": "startAngle"},
                "endAngle": {"field": "endAngle"},
                "outerRadius": {"signal": "width / 2"},
                "tooltip": {"signal": "{'id': datum.id, 'field': datum.field}"}
              }
            }
          },
          {
            "type": "text",
            "from": {"data": tableName},
            "encode": {
              "enter": {
                "x": {"field": {"group": "width"}, "mult": 0.5},
                "y": {"field": {"group": "height"}, "mult": 0.5},
                "radius": {"signal": "width / 4"},
                "theta": {"signal": "(datum.startAngle + datum.endAngle)/2"},
                "align": {"value": "center"},
                "baseline": {"value": "middle"},
                "text": {"field": y}
              }
            }
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
      };
       
}

export default pieChartSchema;