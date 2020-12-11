import React, {useState, Component, Fragment} from 'react';
import {Row, Col, Input, Label, Button, Progress, FormGroup} from 'reactstrap';
import Select from 'react-select';

import { ErrorMessage, Field, Form, Formik } from 'formik';
import ChartGallery from './ChartGallery';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const Wizard = ({ children, initialValues, onSubmit }) => {
  const [stepNumber, setStepNumber] = useState(0);
  const steps = React.Children.toArray(children);
  const [snapshot, setSnapshot] = useState(initialValues);

  const step = steps[stepNumber];
  const totalSteps = steps.length;
  const isLastStep = stepNumber === totalSteps - 1;

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
          {step}
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

const WizardStep = ({ children }) => children;

const VisForm = ({datagraph}) => (
  <div>
    <Wizard
      initialValues={{
        email: '',
        firstName: '',
        lastName: '',
      }}
      onSubmit={async values =>
        sleep(300).then(() => console.log('Wizard submit', values))
      }
    >
      <WizardStep>
        <FormGroup check>
            <Input type="radio" name="schema" disabled/>{' '}
            Write my own visualisation schema
        </FormGroup>
      
        <FormGroup check>
            <Input type="radio" name="schema" checked/>{' '}
            Use our template (recommended)
        </FormGroup>
        <ChartGallery/>
      </WizardStep>
      
      <WizardStep>
        <Row className="form-group">
          {/* Will connect with the data graph */}
            <Label md={3}>Select a data node</Label>
            <Col md={9}>
              <Input type="select">
                {datagraph.nodes.map((node) => (<option key={node.id} value={node.id}>{node.data.label}</option>))}
              </Input>
            </Col>
        </Row>
        <Row className="form-group">
          <Col>
              <Select options={[]} placeholder="Select x axis field" />
          </Col>
          <Col>
              <Select options={[]} placeholder="Select y axis field" />
          </Col>
      </Row>
      </WizardStep>
    </Wizard>
  </div>
);

export default VisForm;

// class VisForm extends Component {

//     constructor(props)
//     {
//         super(props);
//     }
//     render() {
//         return (
//             <Form className="vertical-nav-menu">
//                 <h5 className="app-sidebar__heading">Data</h5>
//                 <Row className="form-group">                   
//                     <Col>
//                         <Select options={[]} placeholder="Select a data node" />
//                     </Col>
//                 </Row>
//                 <h5 className="app-sidebar__heading">Idioms</h5>
//                 <Row className="form-group">
//                     <Col>
//                         <Select options={[]} placeholder="Select a idiom" />
//                     </Col>
//                 </Row>
//                 <h5 className="app-sidebar__heading">Encoding</h5>
                // <Row className="form-group">
                //     <Col>
                //         <Select options={[]} placeholder="Select x axis field" />
                //     </Col>
                //     <Col>
                //         <Select options={[]} placeholder="Select y axis field" />
                //     </Col>
                // </Row>
// {/* 
//                 <Row className="form-group">
//                     <Col>
//                         <Select options={[]} placeholder="Row" />
//                     </Col>
//                     <Col>
//                         <Select options={[]} placeholder="Col" />
//                     </Col>
//                 </Row> */}

//                 <h5 className="app-sidebar__heading">Mark</h5>
//                 <Row className="form-group">
//                     <Col>
//                         <Select options={[]} placeholder="size" />
//                     </Col>
//                     <Col>
//                         <Select options={[]} placeholder="color" />
//                     </Col>
//                 </Row>

//                 <Row className="form-group">
//                     <Col>
//                         <Select options={[]} placeholder="shape" />
//                     </Col>
//                     <Col>
//                         <Select options={[]} placeholder="detail" />
//                     </Col>
//                 </Row>
//                 <Row className="form-group">
//                     <Col>
//                         <Select options={[]} placeholder="text" />
//                     </Col>
//                 </Row>
//             </Form>
//         );
//     }
// }
