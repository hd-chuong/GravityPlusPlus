import React, { Fragment } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
    Row, Col, 
    CardBody, CardTitle, 
    Modal, ModalBody, 
    Input, 
    Label, ModalHeader, Card, CardImg, CardText, 
    NavLink,
    CardSubtitle
    // Alert, Button
} from 'reactstrap';

import {Link, withRouter} from 'react-router-dom';
import { Steps } from 'rsuite';
import { Button, IconButton, ButtonGroup, ButtonToolbar, Icon } from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
import ReactPlayer from 'react-player';

const UserSteps = ({step, onPrevious, onNext}) => {

    const styles = {
        display: 'inline-table',
        verticalAlign: 'top'
      };

    return (
    <Card>
        <CardBody>
            <Steps current={step} vertical style={styles} >
                <Steps.Item title="Watch Gravity tutorials" description="We are glad to show you the most prominent features of Gravity." />
                <Steps.Item title="Work on tasks" description="You will use Gravity to complete the tasks given by the researcher. Feel free to ask any questions during your evaluation." />
                <Steps.Item title="Complete survey" description="Your feedback is valued as it helps us improve in the next version of Gravity." />
                <Steps.Item title="Check-out" description="Thank you for joining the usability study." />
            </Steps>
            <ButtonToolbar>
            <IconButton icon={<Icon icon="arrow-left" />} onClick={onPrevious} placement="left">
                Previous
            </IconButton>
            <IconButton icon={<Icon icon="arrow-right" />} onClick={onNext} placement="right">
                Next
            </IconButton>
            </ButtonToolbar>
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

const RenderStartTasks = () => (<Card>
    <CardBody>
        <CardTitle>Work on tasks</CardTitle>
        <IconButton icon={<Icon icon="play" />} placement="left">
            Start
        </IconButton>
        <IconButton icon={<Icon icon="stop" />} placement="left">
            Stop
        </IconButton>
    </CardBody>
</Card>);

const RenderSurvey = () => (<Col md={8}>                  
    <Card>
        <CardBody>
            <CardTitle>Usability survey</CardTitle>
            <Button color="blue" target="_blank" href="https://docs.google.com/forms/d/e/1FAIpQLSeeji59mQiEgxQUCGX7jiURHrJgV0l-djxbw0peBwIW3inWFg/viewform?usp=sf_link">Click here to start our survey</Button>
        </CardBody>
    </Card>         
</Col>);

export default withRouter(UserStudy);

  
