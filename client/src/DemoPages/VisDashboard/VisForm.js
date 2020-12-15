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
import Vega from '../Vega';
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
      console.log(values);
      props.addVisNode(values.title, values.dataNode, values.spec);
      // return onSubmit(values, bag);
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
              {isLastStep ? 'Create node' : 'Next'}
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
        <Label md={3}>Enter the visualisation node</Label>
        <Col md={9}>
          <Input type="text" onChange={formik.handleChange} name="title"/>
        </Col>
      </Row>
      
      <Row className="form-group">
          <Label md={3}>Select a data node</Label>
          <Col md={9}>
            <Input type="select" onChange={(event) => {
                                              formik.handleChange(event);
                                              calculateDataset(event.target.value, datasets.datasets).then(dataset => {setData(dataset)}); 
                                          }} name="dataNode">
              <option key={-1} value={""}>Select a data node</option>
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
                <option key={-1} value={""}>Select an attribute</option>
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
                <option key={-1} value={""}>Select an attribute</option>
                {AttributeExtractor(data[0]).map(header => (<option key={header} value={header}>{header}</option>))}
              </Input>
          </Col>
        </Row>
      </Fragment>
      )}
      {
        formik.values.dataNode 
        && formik.values.xField 
        && formik.values.yField 
        && <Row className="form-group"><Vega 
              className="mx-auto" 
              spec={BarChart("table", formik.values.xField, formik.values.yField, data)} 
              config={{actions: {compiled: false, editor: false, source: false}}}
        /></Row> 
      }
      {
        formik.values.dataNode 
        && formik.values.xField 
        && formik.values.yField 
        && setSpecs(formik, BarChart("table", formik.values.xField, formik.values.yField, ""))}
      
    </Fragment>
  )
}

function setSpecs(formik, specs)
{
  formik.values.spec = specs;
}

export default Wizard;
