const charts = [
  {
    src: process.env.PUBLIC_URL + '/images/bar-chart.png',
    thumbnail: process.env.PUBLIC_URL + '/images/bar-chart.png',
    tags: [{value: "BarChart", title: "Bar chart"}],

    caption: "Bar chart",
    value: "BarChart"
  },
  {
    src: process.env.PUBLIC_URL + '/images/pie-chart.png',
    thumbnail: process.env.PUBLIC_URL + '/images/pie-chart.png',
    tags: [{value: "Pie chart", title: "Pie chart"}],
    caption: "Pie chart",
    value: "PieChart"
  },
  {
    src: process.env.PUBLIC_URL + '/images/line-chart.png',
    thumbnail: process.env.PUBLIC_URL + '/images/line-chart.png',
    tags: [{value: "Line chart", title: "Line chart"}],
    caption: "Line chart",
    value: "LineChart"
  
  },
  {
    src: process.env.PUBLIC_URL + '/images/stacked-bar-chart.png',
    thumbnail: process.env.PUBLIC_URL + '/images/stacked-bar-chart.png',
    tags: [{value: "Stacked bar chart", title: "Stacked bar chart"}],
    caption: "Stacked bar chart",
    value: "StackedBarChart"
  },
  {
    src: process.env.PUBLIC_URL + '/images/choropleth-map.png',
    thumbnail: process.env.PUBLIC_URL + '/images/choropleth-map.png',
    tags: [{value: "Choropleth Map", title: "Choropleth Map"}],
    caption: "Choropleth Map",
    value: "ChoroplethMap"
  },
  {
    src: process.env.PUBLIC_URL + '/images/boxplot.png',
    thumbnail: process.env.PUBLIC_URL + '/images/boxplot.png',
    tags: [{value: "Box Plot", title: "Box Plot"}],
    caption: "Box Plot",
    value: "Boxplot"
  },
  {
    src: process.env.PUBLIC_URL + '/images/normalized-area-chart.png',
    thumbnail: process.env.PUBLIC_URL + '/images/normalized-area-chart.png',
    tags: [{value: "Normalized Area Chart", title: "Normalized Area Chart"}],
    caption: "Normalized Area Chart",
    value: "NormalizedAreaChart"
  },

  {
    src: process.env.PUBLIC_URL + '/images/scatterplot.png',
    thumbnail: process.env.PUBLIC_URL + '/images/scatterplot.png',
    tags: [{value: "Scatterplot", title: "Scatterplot"}],
    caption: "Scatterplot",
    value: "Scatterplot"
  },

  // {
  //   src: process.env.PUBLIC_URL + '/images/area-chart.png',
  //   thumbnail: process.env.PUBLIC_URL + '/images/area-chart.png',
  //   tags: [{value: "Area chart", title: "Area chart"}],
  //   caption: "Area chart"
  // }
];

export default charts;