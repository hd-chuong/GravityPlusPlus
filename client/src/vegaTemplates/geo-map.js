export default function geoMapSchema(tableName, quantityValue, value) {
  return {
    $schema: 'https://vega.github.io/schema/vega/v5.json',
    width: 500,
    height: 600,
    autosize: 'fit',
    projections: [
      {
        name: 'projection',
        size: { signal: '[width, height]' },
        fit: { signal: "data('map')" },
      },
    ],
    data: [
      {
        name: tableName,
        value: value,
        // "url": "https://raw.githubusercontent.com/hd-chuong/GravityPlusPlus/main/client/src/data/LGA_VIC.json",
        // "format": {
        //   "type": "json",
        //   "property": "features"
        // }
      },
    ],

    scales: [
      {
        name: 'color',
        type: 'quantize',
        domain: [0, 0.15],
        range: { scheme: 'blues', count: 7 },
      },
    ],
    marks: [
      {
        type: 'shape',
        from: {
          data: tableName,
        },
        encode: {
          update: {
            strokeWidth: {
              value: 0.5,
            },
            stroke: {
              value: 'black',
            },
            fill: {
              scale: 'color',
              field: quantityValue,
            },
            fillOpacity: {
              value: 0.5,
            },
          },
          hover: {
            fill: {
              value: '#66C2A5',
            },
            strokeWidth: {
              value: 2,
            },
            stroke: {
              value: '#FC8D62',
            },
            tooltip: { signal: 'datum.properties' },
          },
        },
        transform: [
          {
            type: 'geoshape',
            projection: 'projection',
          },
        ],
      },
    ],
  };
}
