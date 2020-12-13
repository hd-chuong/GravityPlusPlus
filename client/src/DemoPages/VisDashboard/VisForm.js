import React, {useState, lazy} from 'react';
import {Card, CardBody, CardTitle, CardImg, Row, Col, Input, Label, Button, Progress, FormGroup} from 'reactstrap';
import Async from 'react-select/async';
import Select from 'react-select';
import Scrollbar from 'react-perfect-scrollbar';
import {Field, Form, Formik } from 'formik';
import Charts from './ChartGallery';
import { Fragment } from 'react';
import AttributeExtractor from '../../utils/AttributeExtractor';
import calculateDataset from '../../utils/dataGeneration';
import Vega from 'react-vega';
import BarChart from "../../vegaTemplates/bar-chart";

const Wizard = (props) => {
  const initialValues = {
    useOurTemplate: true,
    idiom: 'bar chart',
    dataNode: null,
    xField: null,
    yField: null,
    title: "Title"
  };

  const [stepNumber, setStepNumber] = useState(0);
  const [snapshot, setSnapshot] = useState(initialValues);
  
  const steps = [<OwnSchema/>, <VisVegaTemplateBuilder/>];
  
  const step = steps[stepNumber];
  const totalSteps = steps.length;
  const isLastStep = (stepNumber === totalSteps - 1);

  const next = values => {
    setSnapshot(values);
    setStepNumber(Math.min(stepNumber + 1, totalSteps - 1));
  };

  const previous = values => {
    setSnapshot(values);
    setStepNumber(Math.max(stepNumber - 1, 0));
  };

  const handleSubmit = async (values, bag) => {
    if (step.props.onSubmit) {
      await step.props.onSubmit(values, bag);
    }
    if (isLastStep) {
      return onSubmit(values, bag);
    } else {
      bag.setTouched({});
      next(values);
    }
  };

  return (
    <Formik
      initialValues={snapshot}
      onSubmit={handleSubmit}
      validationSchema={step.props.validationSchema}
    >
      {formik => (
        <Form>
          <Progress value={stepNumber * 100 / totalSteps}/>
          
          {stepNumber===0 && <OwnSchema/>}          
          
          {stepNumber===1 && <VisVegaTemplateBuilder 
                                datagraph={props.datagraph} 
                                formik={formik} 
                                datasets={props.datasets}
                              />}
          <div>
            {stepNumber > 0 && (
              <Button 
                onClick={() => previous(formik.values)} 
                color="primary" 
                className="float-left">
                Back
                {" "}</Button>  
            )}
            
            <Button 
              type="submit"
              disabled={formik.isSubmitting} 
              color="primary" 
              className="float-right"> 
              {isLastStep ? 'Submit' : 'Next'}
            </Button>
          </div>
        
        </Form>
      )}
    </Formik>
  );
};

const OwnSchema = () => {
  return (
    <Fragment>
      <FormGroup>
          <Field 
            component="input"
            type="radio" 
            name="useOurTemplate" 
            value={false}
            disabled/> Write my own visualisation schema
      </FormGroup>

      <FormGroup>
          <Field 
            type="radio" 
            name="useOurTemplate" 
            value={true}  
          /> Use our template (recommended)
      </FormGroup>
      
      <FormGroup style={{height: "400px"}}>
        <Scrollbar> 
            <Row>
                {
                  Charts.map(chart => (
                    <Card className="mb-1 col-md-4" style={{ cursor: 'pointer' }}>
                        <CardBody>
                            <CardTitle>
                            <Field 
                              type="radio" 
                              name="idiom" 
                              value={chart.caption}         
                              />{chart.caption}</CardTitle>
                        </CardBody>
                        <CardImg className="mt-1" top src={chart.src} alt={chart.caption}/>
                    </Card>
                  ))
                }
            </Row>
        </Scrollbar>
      </FormGroup>
    </Fragment>);
};

const VisVegaTemplateBuilder = ({datagraph, formik, datasets}) => {
  const [data, setData] = useState(null);
  return (
    <Fragment>
      <Row className="form-group">
          <Label md={3}>Select a data node</Label>
          <Col md={9}>
            <Input type="select" onChange={(event) => {
                                              formik.handleChange(event);
                                              calculateDataset(event.target.value, datasets.datasets).then(dataset => {setData(dataset)}); 
                                          }} name="dataNode">
              {datagraph.nodes.map((node) => (<option key={node.id} value={node.id}>{node.data.label}</option>))}
            </Input>
          </Col>
      </Row>

      { formik.values.dataNode && Array.isArray(data) && ( 
      <Fragment>
        <Row className="form-group">
          <Col>
              <Input 
                type="select" 
                onChange={formik.handleChange}
                name="xField"
                placeholder="Select x axis field" 
              >
                {AttributeExtractor(data[0]).map(header => (<option key={header} value={header}>{header}</option>))}
                </Input>
          </Col>

          <Col>
              <Input  
                type="select" 
                onChange={formik.handleChange}
                name="yField"
                placeholder="Select y axis field" 
              >
                {AttributeExtractor(data[0]).map(header => (<option key={header} value={header}>{header}</option>))}
              </Input>
          </Col>
        </Row>
        <Row className="form-group">
          <Label md={3}>Enter the graph title</Label>
          <Col md={9}>
            <Input type="text" onChange={formik.handleChange} name="title"/>
          </Col>
        </Row>
      </Fragment>
      )}
      <Row className="form-group">
        {/* {formik.values.dataNode && formik.values.xField && formik.values.yField &&  */}
          <Vega spec={BarChart("table", "a", "b")} data={ { "table": [
    { "a": 'A', "b": 28 },
    { "a": 'B', "b": 55 },
    { "a": 'C', "b": 43 }
  ] }} />
          {/* <Vega specs={BarChart("table", formik.values.xField, formik.values.yField)} data={ { table: data }} /> */}
        
      </Row>
    </Fragment>
  )
}

export default Wizard;
