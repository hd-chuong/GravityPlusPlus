import React, { Fragment, useState } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
    Row, Col, 
    CardBody, CardTitle, 
    Modal, ModalBody, 
    Input, 
    Label, ModalHeader, Card, CardImg, CardText, 
    NavLink,
    CardSubtitle,
    Button
    // Alert, Button
} from 'reactstrap';

import {Link, withRouter} from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
// import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import moment from 'moment'; 

const steps = [
    "Watch Gravity tutorials",
    "Work on tasks",
    "Complete survey",
    "Check-out"
];

const stepContent = [
    "We are glad to show you the most prominent features of Gravity.",
    "You will use Gravity to complete the tasks given by the researcher. Feel free to ask any questions during your evaluation.",
    "Your feedback is valued as it helps us improve in the next version of Gravity.",
    "Thank you for joining the usability study."
]


const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    actionsContainer: {
      marginBottom: theme.spacing(2),
    },
    resetContainer: {
      padding: theme.spacing(3),
    },
  }));


const UserSteps = ({step, onPrevious, onNext}) => {
    const classes = useStyles(); 
    return (
    <Card>
        <CardBody>
        <Stepper activeStep={step} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <Typography>{stepContent[index]}</Typography>
              <div className={classes.actionsContainer}>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      <Row className="form-group">
          <Col md={6}>
            <Button 
                onClick={onPrevious} 
                color="primary"
                className="float-left"
            >
                Previous
            </Button>
            </Col>
            <Col md={6}>
            <Button 
                onClick={onNext} 
                color="primary"
                className="float-right"
            >
                Next
            </Button>
            </Col>
        </Row>
        </CardBody>
    </Card>
)};

const UserStudy = () => {
    const [step, setStep] = React.useState(0);
    const onChange = nextStep => {
      setStep(nextStep < 0 ? 0 : nextStep > 3 ? 3 : nextStep);
    };
  
    const onNext = () => onChange(step + 1);
    const onPrevious = () => onChange(step - 1);

    const rightColumn = [<RenderWatchVideos/>, <RenderStartTasks/>, <RenderSurvey/>];

    return (
        <div className="app-main">
            <div className="app-main__outer">
                <div className="app-main__inner">
                    <ReactCSSTransitionGroup
                        component="div"
                        transitionName="TabsAnimation"
                        transitionAppear={true}
                        transitionAppearTimeout={0}
                        transitionEnter={false}
                        transitionLeave={false}
                    >
                        <Row>
                            <Col md={4}>
                                <UserSteps step={step} onNext={onNext} onPrevious={onPrevious}/>
                            </Col>
                            <Col md={8}>
                                {rightColumn[step]}
                            </Col>
                        </Row>


                    </ReactCSSTransitionGroup>
                </div>
            </div>
        </div>
    );
}

const tutorial_videos = [
    {
        title: "Add datasets and data nodes.",
        link: process.env.PUBLIC_URL + '/videos/add_dataset.mp4',
        description: "",
        thumbnail: process.env.PUBLIC_URL + '/images/add-dataset-thumbnail.png',
    },
    {
        title: "Transform data using filtering and aggregation",
        link: process.env.PUBLIC_URL + '/videos/transform_data_using_filtering_and_aggregation.mp4',
        description: "",
        thumbnail: process.env.PUBLIC_URL + '/images/simple-transform.png',
    },
    {
        title: "Combine datasets using JOIN.",
        link: process.env.PUBLIC_URL + '/videos/advanced_transform_and_join.mp4',
        description: "",
        thumbnail: process.env.PUBLIC_URL + '/images/join.png',
    },
    {
        title: "Create visualisations and receive recommended paths.",
        link: process.env.PUBLIC_URL + '/videos/vis_domain.mp4',
        description: "",
        thumbnail: process.env.PUBLIC_URL + '/images/vis-thumbnail.png',
    },
    {
        title: "Create scenes and add interaction to produce a complete story.",
        link: process.env.PUBLIC_URL + '/videos/interaction_domain.mp4',
        description: "",
        thumbnail: process.env.PUBLIC_URL + '/images/int-thumbnail.png',
    },
]

const RenderWatchVideos = () => (                                <Card>
    <CardBody>
        <CardTitle>Tutorial demos</CardTitle>
        {tutorial_videos.map(({link, description, title, thumbnail}) => (
        <NavLink target="_blank" href={link}>
            <Card>
                <CardBody>
                    <Row>
                        <Col md={3}>
                            <CardImg src={thumbnail}/>
                        </Col>
                        <CardText>
                            {title}
                        </CardText>
                        <CardSubtitle>
                            {description}
                        </CardSubtitle>
                    </Row>
                </CardBody>
            </Card>
        </NavLink>))}
    </CardBody>
</Card>);


const RenderStartTasks = () => {
    const [showPause, setPause] = useState(false);
    const [isStart, setStart] = useState(false);
    
    const onStart = (time) => {
        sessionStorage.setItem('startTime', parseInt(time));
        sessionStorage.setItem('elapsed', 0);
        setPause(true);
        setStart(true);
    }

    const onPause = (time) => {
        setPause(false);
        const elapsed = sessionStorage.getItem('elapsed');
        sessionStorage.setItem('elapsed', parseInt(elapsed) + parseInt((time - sessionStorage.getItem('startTime'))));
    }

    const onResume = (time) => {
        setPause(true);
        sessionStorage.setItem('startTime', parseInt(time));
    }

    const onStop = (time) => {
        setPause(false);
        setStart(false);
        const elapsed = sessionStorage.getItem('elapsed');
        if (!showPause) sessionStorage.setItem('elapsed', parseInt(elapsed) + parseInt((time - sessionStorage.getItem('startTime'))));
    }
    return (
    <Card>
        <CardBody>
            <CardTitle>Work on tasks</CardTitle>
            {!showPause && <Button color="info" onClick={() => !isStart? onStart(parseInt(Date.now())) : onResume(parseInt(Date.now())) }>
                Start
            </Button>}

            {showPause && <Button color="info" onClick={() => onPause(parseInt(Date.now()))}>
                Pause
            </Button>}

            <Button color="info" onClick={() => onStop(parseInt(Date.now()))}>
                Stop
            </Button>

            {!showPause && <p>Time elapsed: {Math.round(sessionStorage.getItem('elapsed') / 60000)} mins</p>}
        </CardBody>
    </Card>) 
};

const RenderSurvey = () => (<Col md={8}>                  
    <Card>
        <CardBody>
            <CardTitle>Usability survey</CardTitle>
            <Button color="blue" target="_blank" href="https://docs.google.com/forms/d/e/1FAIpQLSeeji59mQiEgxQUCGX7jiURHrJgV0l-djxbw0peBwIW3inWFg/viewform?usp=sf_link">Click here to start our survey</Button>
        </CardBody>
    </Card>         
</Col>);

export default withRouter(UserStudy);

  
