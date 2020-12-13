const charts = [
  {
    src: process.env.PUBLIC_URL + '/images/bar-chart.png',
    thumbnail: process.env.PUBLIC_URL + '/images/bar-chart.png',
    tags: [{value: "Bar chart", title: "Bar chart"}],

    caption: "Bar chart"
  },
  {
    src: process.env.PUBLIC_URL + '/images/donut-chart.png',
    thumbnail: process.env.PUBLIC_URL + '/images/donut-chart.png',
    tags: [{value: "Donut chart", title: "Donut chart"}],
    caption: "Donut chart"
  },
  {
    src: process.env.PUBLIC_URL + '/images/line-chart.png',
    thumbnail: process.env.PUBLIC_URL + '/images/line-chart.png',
    tags: [{value: "Line chart", title: "Line chart"}],
    caption: "Line chart"
  },
  {
    src: process.env.PUBLIC_URL + '/images/area-chart.png',
    thumbnail: process.env.PUBLIC_URL + '/images/area-chart.png',
    tags: [{value: "Area chart", title: "Area chart"}],
    caption: "Area chart"
  }
];

export default charts;
