function pieChartSchema(tableName, x, y, value)
{
  return {
      "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
      "description": "Pie Chart",
      "data": {
        "name": tableName,
        "values": value
      },
      "mark": "arc",
      "encoding": {
        "color": {"field": x, "type": "nominal"},
        "theta": {"field": y, "type": "quantitative"},
      },
      "view": {"stroke": null}
    }   
}

export default pieChartSchema;