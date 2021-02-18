import React, { useState, lazy, Fragment } from 'react';
import {
  Card,
  CardBody,
  CardImg,
  Row,
  Col,
  Input,
  Label,
  Button,
  Progress,
  FormGroup,
  ModalBody,
} from 'reactstrap';

import Scrollbar from 'react-perfect-scrollbar';
import { Field, Form, Formik } from 'formik';
import AttributeExtractor from '../../utils/AttributeExtractor';
import calculateDataset from '../../utils/dataGeneration';
import Vega from '../Vega';
import Charts from './ChartGallery';

import BarChart from '../../vegaTemplates/bar-chart';
import PieChart from '../../vegaTemplates/pie-chart';
import LineChart from '../../vegaTemplates/line-chart';
import GeoMap from '../../vegaTemplates/geo-map';
import Boxplot from '../../vegaTemplates/boxplot';
import NormalizedAreaChart from '../../vegaTemplates/normalized-area-chart';
import StackedBarChart from '../../vegaTemplates/stacked-bar-chart';
import Scatterplot from '../../vegaTemplates/scatterplot';
import { toast } from 'react-toastify';
import toastOptions from '../config/toastOptions';

const BarChartForm = lazy(() => import('./BarChartForm'));
const PieChartForm = lazy(() => import('./PieChartForm'));
const LineChartForm = lazy(() => import('./LineChartForm'));
const GeoMapForm = lazy(() => import('./GeoMapForm'));
const BoxplotForm = lazy(() => import('./BoxplotForm'));
const ScatterplotForm = lazy(() => import('./ScatterplotForm'));

const VisForm = props => {
  const initialValues = {
    useOurTemplate: true,
    idiom: 'BarChart',
    dataNode: null,
    xField: null,
    yField: null,
    categoryField: null,
    choroplethField: null,
    shapeField: null,
    title: '',
  };

  const [stepNumber, setStepNumber] = useState(0);
  const [snapshot, setSnapshot] = useState(initialValues);
  const steps = [<OwnSchema />, <VisVegaTemplateBuilder />];
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
    if (!isLastStep) 
    {
      bag.setTouched({});
      next(values);
    }

    if (!values.title)
    {
      toast.warn("Please provide a node title", toastOptions);
      return;
    }

    if (!values.dataNode)
    {
      toast.warn("Please provide a data node", toastOptions);
      return;
    }

    if (!values.spec)
    {
      toast.warn("Insufficient specification", toastOptions);
      return;
    }

    props.addVisNode(values.title, values.dataNode, values.spec);
    props.toggle();
     
   
  };

  return (
    <Formik
      initialValues={snapshot}
      onSubmit={handleSubmit}
      // validationSchema={step.props.validationSchema}
    >
      {formik => (
        <Form>
          <Progress className="mb-2" value={(stepNumber * 100) / totalSteps} />

          {stepNumber === 0 && <OwnSchema formik={formik} />}

          {stepNumber === 1 && (
            <VisVegaTemplateBuilder
              datagraph={props.datagraph}
              formik={formik}
              datasets={props.datasets}
            />
          )}
          <div>
            {stepNumber > 0 && (
              <Button
                onClick={() => previous(formik.values)}
                color="primary"
                className="float-left"
              >
                Back{' '}
              </Button>
            )}

            <Button
              type="submit"
              disabled={formik.isSubmitting}
              color="primary"
              className="float-right"
            >
              {isLastStep ? 'Create node' : 'Next'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

const OwnSchema = ({ formik }) => {
  return (
    <ModalBody>
      <Row className="form-group">
        <Label md={3}>Enter the visualisation title</Label>
        <Col md={9}>
          <Input type="text" onChange={formik.handleChange} name="title" />
        </Col>
      </Row>

      {/* <Row className="form-group">
        <Field
          component="input"
          type="radio"
          name="useOurTemplate"
          value={false}
          disabled
        />{' '}
        Write my own visualisation schema
      </Row> */}

      <Row className="form-group">
        <Field type="radio" name="useOurTemplate" value={true} /> Use our
        template (recommended)
      </Row>
    </ModalBody>
  );
};

const VisVegaTemplateBuilder = ({ datagraph, formik, datasets }) => {
  const [data, setData] = useState(null);

  if (
    formik.values.dataNode &&
    ((formik.values.xField && formik.values.yField) ||
      formik.values.choroplethField)
  ) {
    switch (formik.values.idiom) {
      case 'BarChart':
        setSpecs(
          formik,
          BarChart('table', formik.values.xField, formik.values.yField, []),
        );
        break;

      case 'PieChart':
        setSpecs(
          formik,
          PieChart('table', formik.values.xField, formik.values.yField, []),
        );
        break;

      case 'LineChart':
        setSpecs(
          formik,
          LineChart(
            'table',
            formik.values.xField,
            formik.values.yField,
            formik.values.categoryField,
            [],
          ),
        );
        break;

      case 'ChoroplethMap':
        setSpecs(formik, GeoMap('map', formik.values.choroplethField, []));
        break;

      case 'Boxplot':
        setSpecs(
          formik,
          Boxplot(
            'table',
            formik.values.xField,
            formik.values.yField,
            formik.values.categoryField,
            [],
          ),
        );
        break;

      case 'NormalizedAreaChart':
        setSpecs(
          formik,
          NormalizedAreaChart(
            'table',
            formik.values.xField,
            formik.values.yField,
            formik.values.categoryField,
            [],
          ),
        );
        break;

      case 'StackedBarChart':
        setSpecs(
          formik,
          StackedBarChart(
            'table',
            formik.values.xField,
            formik.values.yField,
            formik.values.categoryField,
            [],
          ),
        );
        break;

      case 'Scatterplot':
        setSpecs(
          formik,
          Scatterplot(
            'table',
            formik.values.xField,
            formik.values.yField,
            formik.values.categoryField,
            formik.values.shapeField,
            [],
          ),
        );
        break;
      default:
        break;
    }
  }

  return (
    <Fragment>
      <FormGroup style={{ height: '250px' }}>
        <Scrollbar>
          <Row>
            {Charts.map((chart, i) => (
              <Card
                key={i}
                className="mb-1 col-12 col-lg-3"
                style={{ cursor: 'pointer' }}
              >
                <CardBody>
                  <p>
                    <Field type="radio" name="idiom" value={chart.value} />
                    {chart.caption}
                  </p>
                </CardBody>
                <CardImg
                  className="mt-1"
                  top
                  src={chart.src}
                  alt={chart.caption}
                />
              </Card>
            ))}
          </Row>
        </Scrollbar>
      </FormGroup>
      <Row className="form-group">
        <Label md={3}>Select a data node</Label>
        <Col md={9}>
          <Input
            type="select"
            onChange={event => {
              formik.handleChange(event);
              calculateDataset(event.target.value, datasets.datasets).then(
                ({data: dataset}) => {
                  setData(dataset);
                },
              );
            }}
            name="dataNode"
          >
            <option key={-1} value={''}>
              Select a data node
            </option>
            {datagraph.nodes.map(node => (
              <option key={node.id} value={node.id}>
                {node.data.label}
              </option>
            ))}
          </Input>
        </Col>
      </Row>

      {Array.isArray(data) && formik.values.idiom === 'BarChart' && (
        <BarChartForm
          xFieldChange={formik.handleChange}
          yFieldChange={formik.handleChange}
          attributeList={AttributeExtractor(data[0])}
        />
      )}
      {Array.isArray(data) && formik.values.idiom === 'PieChart' && (
        <PieChartForm
          xFieldChange={formik.handleChange}
          yFieldChange={formik.handleChange}
          attributeList={AttributeExtractor(data[0])}
        />
      )}
      {Array.isArray(data) && formik.values.idiom === 'LineChart' && (
        <LineChartForm
          xFieldChange={formik.handleChange}
          yFieldChange={formik.handleChange}
          categoryFieldChange={formik.handleChange}
          attributeList={AttributeExtractor(data[0])}
        />
      )}
      {Array.isArray(data) && formik.values.idiom === 'ChoroplethMap' && (
        <GeoMapForm
          choroplethFieldChange={newValue =>
            (formik.values.choroplethField = newValue)
          }
          attributeList={AttributeExtractor(data[0])}
        />
      )}
      {Array.isArray(data) && formik.values.idiom === 'Boxplot' && (
        <BoxplotForm
          xFieldChange={formik.handleChange}
          yFieldChange={formik.handleChange}
          categoryFieldChange={formik.handleChange}
          attributeList={AttributeExtractor(data[0])}
        />
      )}
      {Array.isArray(data) && formik.values.idiom === 'NormalizedAreaChart' && (
        <LineChartForm
          xFieldChange={formik.handleChange}
          yFieldChange={formik.handleChange}
          categoryFieldChange={formik.handleChange}
          attributeList={AttributeExtractor(data[0])}
        />
      )}
      {Array.isArray(data) && formik.values.idiom === 'StackedBarChart' && (
        <LineChartForm
          xFieldChange={formik.handleChange}
          yFieldChange={formik.handleChange}
          categoryFieldChange={formik.handleChange}
          attributeList={AttributeExtractor(data[0])}
        />
      )}
      {Array.isArray(data) && formik.values.idiom === 'Scatterplot' && (
        <ScatterplotForm
          xFieldChange={formik.handleChange}
          yFieldChange={formik.handleChange}
          shapeFieldChange={formik.handleChange}
          categoryFieldChange={formik.handleChange}
          attributeList={AttributeExtractor(data[0])}
        />
      )}
      {formik.values.dataNode &&
        ((formik.values.xField && formik.values.yField) ||
          formik.values.choroplethField) && (
          <Row className="form-group">
            <Vega className="mx-auto" spec={formik.values.spec} data={data} />
          </Row>
        )}
    </Fragment>
  );
};

function setSpecs(formik, spec) {
  formik.values.spec = spec;
}

export default VisForm;
