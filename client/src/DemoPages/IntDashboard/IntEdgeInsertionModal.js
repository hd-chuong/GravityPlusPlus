import React, { Fragment, useState } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  CardHeader,
} from 'reactstrap';
import {Form, Label, Input, Row, Col } from 'reactstrap';
import Select from 'react-select';
import Vega from "../../DemoPages/Vega";
import {EventTypes, ExtractMarkTypes, GetCompiledVegaSpec, SignalBuilder} from '../../utils/VegaSpecsBuilder';
import calculateDataset from "../../utils/dataGeneration";
import {describeParams} from "../../utils/describeParams";
import nanoid from "../../utils/nanoid";
import ParamTable from "../Components/ParamTable";
import AttributeExtractor from '../../utils/AttributeExtractor';

const IntEdgeInsertionModal = (props) => {
  const [source, setSource] = useState(null);
  const [target, setTarget] = useState(null);
  const [eventType, setEventType] = useState(null);
  const [element, setElement] = useState(null);
  const [binding, setBinding] = useState({});
  
  // binding params
  const [params, setParams] = useState(null);
  const [spec, setSpec] = useState(null);
  const [data, setData] = useState([]);
  const [sourceSpec, setSourceSpec] = useState(null);
  const [sourceData, setSourceData] = useState(null);
  const [viewSource, setViewSource] = useState(false);
  const [signal, setSignal] = useState({});
  const [id, setId] = useState(nanoid());
  const [interactionData, setInteractionData] = useState(null);

  const eventHandler = (event, item) => {
    setInteractionData(item);
  }
    
  const reset = () => {
    setSource(null);
    setTarget(null);
    setEventType(null);
    setElement(null);
    setBinding(null);
  }
  
  const GetVisSpecs = (intNodeId) => {
    if (!intNodeId) return [];
    
    const intNode = GetNodeById(props.intgraph, intNodeId);
    const visSourceIds = intNode.data.source;

    const visNodes = visSourceIds.reduce(
      (result, visId) => {
        const c =  result.concat(GetNodeById(props.visgraph, visId));
        return c;
      }, []);
      
    return visNodes.map(node => GetCompiledVegaSpec(node.data.spec));
  }

  const GetVisElements = (intNodeId) => {
    // current support one chart
    const visSpecs = GetVisSpecs(intNodeId);
    const markTypes = visSpecs.map(spec => ExtractMarkTypes(spec.marks));
    // will change here to accomodate multiple visualisations
    return markTypes[0];
  }; 

  const getDataId = (intNodeId) => {
    if (!intNodeId) return [];
    
    const intNode = GetNodeById(props.intgraph, intNodeId);
    const visSourceIds = intNode.data.source;
  
    const visNodes = visSourceIds.reduce(
      (result, visId) => {
        const c =  result.concat(GetNodeById(props.visgraph, visId));
        return c;
      }, []);
    
    const dataNodeIds = visNodes.map(node => node.data.dataSource);    
    
    // will change here to accommodate multiple datasets
    // 2-level nested arrays
    // currently only support one data source
    const currentDataId = dataNodeIds[0];
    return currentDataId;
  }

  const SetTargetParams = async (intNodeId) => {
    const currentDataId = getDataId(intNodeId);
    calculateDataset(currentDataId, props.datasets.datasets).then(({spec, params, data}) => {
      setParams(params);
      setSpec(spec);
      setData(data);
    });
  }

  const setSourceVis = async (intNodeId) => {
    const currentDataId = getDataId(intNodeId);
    const visSpec = GetVisSpecs(intNodeId)[0];

    setSourceSpec(visSpec);
    calculateDataset(currentDataId, props.datasets.datasets).then(({data}) => {
      setSourceData(data);
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    props.addIntEdge(source, target, spec, binding, id);
    props.toggle();
    reset();
  }

  return (
    <span className="d-inline-block">
      <Modal
        isOpen={props.isOpen}
        toggle={props.toggle}
        className="modal-lg"
      >
        <CardHeader className="card-header-tab">
          <div className="card-header-title">Add an interaction edge</div>
        </CardHeader>
        <ModalBody>
          <Form>
            <Row className="form-group">
              <Label md={3}>Choose source</Label>
              <Col md={6}>
                <Select
                    options={props.intgraph.nodes.map(node => ({
                      value: node.id,
                      label: node.data.label
                    }))
                    }
                    onChange={(val) => {setSource(val.value); setSourceVis(val.value)}}
                    hideSelectedOptions={false}
                />                      
              </Col>
              <Col>
                  <Button onClick={(e) => {e.preventDefault(); setViewSource(!viewSource)}}>View source</Button>
              </Col>
            </Row>

            <Row className="form-group">
              <Label md={3}>Choose target</Label>
              <Col md={9}>
                <Select
                    options={props.intgraph.nodes.map(node => ({
                      value: node.id,
                      label: node.data.label
                    }))
                    }
                    onChange={(val) => {
                      setTarget(val.value); 
                      SetTargetParams(val.value); 
                    }}
                    hideSelectedOptions={false}
                />                      
              </Col>
            </Row>

            <Row className="form-group">
              <Label md={3}>Choose interaction</Label>
              <Col md={9}>
                <Select
                  options={EventTypes.map(event => ({
                    value: event,
                    label: event
                  }))
                  }
                  onChange={(val) => {
                    setEventType(val.value);
                    setSignal(SignalBuilder(id, element, val.value))}
                  }
                  hideSelectedOptions={false}
                />
              </Col>
            </Row>

            {source && 
            <Row className="form-group">
              <Label md={3}>Choose vis element</Label>
              <Col md={9}>
                <Select
                  options={GetVisElements(source).map(mark => ({
                    value: mark.type,
                    label: mark.style
                  }))
                  }
                  onChange={(val) => {
                    setSignal(SignalBuilder(id, val.value, eventType));
                    setElement(val.value);
                  }}
                  hideSelectedOptions={false}
                />
              </Col>
            </Row>}
            
            <Row className="form-group">
              <Col md={6}>
                {viewSource && <Vega className="mx-auto" data={sourceData} spec={sourceSpec} signal={{signal, eventHandler}}/>}
              </Col>
              <Col md={6}>
                {interactionData && <ParamTable 
                  keys={AttributeExtractor(interactionData)} 
                  values={AttributeExtractor(interactionData).map(key => interactionData[`${key}`])} 
                />}
              </Col>
            </Row>
            
            {/* <Row className="form-group">
              <Label md={3}>Choose binding</Label>
              <Col md={9}>
                <Input
                  type="text" 
                  onChange={(e) => setBinding(e.target.value)}
                />
              </Col>
            </Row> */}
            
            <Row className="form-group">
              {spec && describeParams(spec.data, Object.keys(params))
                .map((param) => (
                    <Fragment>
                        <p>{param.description} 
                        <Input type="text" onChange={(e) => setBinding({...binding, [param.name]: e.target.value}) }></Input></p>
                    </Fragment>
                  ))}
            </Row>
            {/* <Row className="form-group"> */}
              {/* {spec && params && describeParams(spec.data, Object.keys(params)).map((param) => (<Label>{param.description}</Label>))} */}
            {/* </Row> */}

            <div>
              <Button
                type="submit"
                color="primary"
                className="float-right"
                onClick={handleSubmit}
              >
                Create Edge
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </span>
  );
}

const GetNodeById = (graph, id) => {
  if (!graph.nodes) return null;
  const nodeList = graph.nodes.filter(node => node.id === id);
  if (nodeList.length > 0) return nodeList[0];
  else return null; 
};

export default IntEdgeInsertionModal;