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
import {GetNodeById} from '../../utils/graphUtil';
import Creatable from 'react-select/creatable';

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
    console.log(markTypes);
    return markTypes;
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
    calculateDataset(currentDataId, props.datasets).then(({spec, params, data}) => {
      setParams(params);
      setSpec(spec);
      setData(data);
    });
  }

  const setSourceVis = async (intNodeId) => {
    const currentDataId = getDataId(intNodeId);
    const visSpec = GetVisSpecs(intNodeId)[0];

    setSourceSpec(visSpec);
    calculateDataset(currentDataId, props.datasets).then(({data}) => {
      setSourceData(data);
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const label = `${element}-${eventType}`;
    props.addIntEdge(source, target, signal, binding, label, id);
    props.toggle();
    reset();
  }

  const attributes = sourceData ? Object.keys(sourceData[0]) : [];

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
                  options={GetVisElements(source).map((mark, i) => ({
                    label: `View ${i+1}`,
                    options: mark.map(element => ({
                      value: element.type,
                      label: element.style
                    }))
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
                {viewSource && sourceData && sourceSpec && <Vega className="mx-auto" data={sourceData} spec={sourceSpec} signals={[{signal, eventHandler}]}/>}
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
            
              {spec && <Row className="form-group">
                <Col md={12}><h6>Param binding</h6></Col>  
              </Row>}
              {spec && describeParams(spec.data, Object.keys(params))
                .map((param) => (
                  <Row className="form-group">
                    <Col md={8}>
                      <Label>{param.description}</Label>
                    </Col>
                    <Col md={4}>
                      {/* <Input type="text" onChange={(e) => setBinding({...binding, [param.name]: e.target.value}) }></Input> */}
                      <Creatable 
                        options={attributes.map(attr => ({value: attr, label: attr}))}
                        onChange={(pair) => setBinding({...binding, [param.name]: pair.value}) }
                      />
                    </Col>
                  </Row>
                  ))}
            
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

export default IntEdgeInsertionModal;