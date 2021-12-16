import React                    from 'react';
import { Container, Row, Col }  from 'react-bootstrap';
import Header                   from './Header';
import { Link } from 'react-router-dom';

const Home = () => {

    return (
        <div className="main">
            <Container className="container-main">
                <Header/>
                <div className="content">
                <Row className="landing">
                    <Col sm={12} lg={6}>
                        <div className="intro content-intro">
                            <h1 className="tagline tagline1">You're serious about<br/>protecting your business.</h1>
                            <h1 className="tagline tagline2">We are too.</h1>
                            <p className="spiel">
                                We've spend the last 6 months developing a secure <b>Rapid Lateral Flow Test</b> logging
                                product for <b>business owners</b> looking to keep their employees
                                <span className="keyword"> safe. </span>
                                Currently, we help to protect over <b>1000 employees</b> across the UK.
                            </p>

                            <Link to="/qr" className="free-trial">Start free trial</Link>
                        </div>
                    </Col>
                    <Col sm={12} lg={6}>
                        <div className="images-landing">
                            <img src="./lft-people.png" alt="lfts"/>
                        </div>
                    </Col>
                </Row>
                <Row className="landing">
                    <Col lg={12}>
                        <div className="intro">
                            <Row>
                                <Col lg={12}>
                                    <div className="home-title">
                                        <h2>Here's what our customers say</h2>
                                    </div>
                                </Col>
                                <Col lg={3} md={6}>
                                    <div className="review-container">
                                        <div className="review">
                                            <h3>Roslyn Rennie</h3>
                                            <p>This was great</p>
                                        </div>
                                    </div>
                                </Col>
                                <Col lg={3} md={6}>
                                    <div className="review-container">
                                        <div className="review">
                                            <h3>Roslyn Rennie</h3>
                                            <p>This was great</p>
                                            <p className="job">Mum</p>
                                        </div>
                                    </div>
                                </Col>
                                <Col lg={3} md={6}>
                                    <div className="review-container">
                                        <div className="review">
                                            <h3>Regina Wu</h3>
                                            <p>Customer service was excellent and the wesbite was super easy to use.</p>
                                            <p className="job">Journalist</p>
                                        </div>
                                    </div>
                                </Col>
                                <Col lg={3} md={6}>
                                    <div className="review-container">
                                        <div className="review">
                                            <h3>Douglas Brierley</h3>
                                            <p>This is the best SaaS of all time. Easy to use and perfect for my business.</p>
                                            <p className="job">Google Analyst</p>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
                </div>
                
            </Container>
        </div>
    )
}

export default Home;