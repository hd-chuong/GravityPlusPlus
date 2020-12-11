import React from "react";
import {Col, Card, CardImg, CardBody, CardTitle, CardText, Row, Input} from 'reactstrap';
import Scrollbar from 'react-perfect-scrollbar';
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

function ChartGallery() {
  return ( 
    <div style={{height: "400px"}}>
        <Scrollbar> 
            <Row>
                {
                    charts.map(chart => (
                        <Card className="mb-1 col-md-4" style={{ cursor: 'pointer' }}>
                            <CardBody bottom>
                                <CardTitle><Input type="radio" name="idiom" checked/>{chart.caption}</CardTitle>
                                {/* <CardText>{chart.caption}</CardText> */}
                            </CardBody>
                            <CardImg className="mt-1" top src={chart.src} alt={chart.caption}/>
                        </Card>
                    ))
                }
            </Row>
        </Scrollbar>
    </div>
  )
}

export default ChartGallery;
