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
    src: process.env.PUBLIC_URL + '/images/area-chart.png',
    thumbnail: process.env.PUBLIC_URL + '/images/area-chart.png',
    tags: [{value: "Area chart", title: "Area chart"}],
    caption: "Area chart"
  }
];

export default charts;
