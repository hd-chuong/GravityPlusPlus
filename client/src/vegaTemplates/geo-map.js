export default function geoMapSchema(tableName, quantityValue, value) {
    return {
      "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
      "width": 500,
      "height": 300,
      "autosize": {
        "type": 'fit',
        "contains": 'padding',
      },
      "data": {
        "name": tableName,
        "values": value
      },
      "projection": {"type": "mercator"},
      "mark": "geoshape",
      "encoding": {"color": {"field": "", "type": "quantitative"}}
    }
}
