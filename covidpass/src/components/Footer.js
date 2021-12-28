import React , { useState, useEffect } from 'react';
import { Container, Row, Col }  from 'react-bootstrap';
import { Link } from 'react-router-dom';


const Footer = () => {
    return (
        <div className="footer">
            <div className="footer-content">
                <Container className="footer-container">
                    <Row className="footer-row">
                        <Col md={4}>
                            <div className="links">
                                <h3>Useful Links</h3>
                                <Link to="/">Home</Link>
                                <Link to='/checkout'>Checkout</Link>
                                <Link to='/payments'>Payments</Link>
                                <Link to='/customers'>Customers</Link>
                                <Link to='/subscriptions'>Subscriptions</Link>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="links">
                                <h3>Useful Links</h3>
                                <Link to="/">Home</Link>
                                <Link to='/checkout'>Checkout</Link>
                                <Link to='/payments'>Payments</Link>
                                <Link to='/customers'>Customers</Link>
                                <Link to='/subscriptions'>Subscriptions</Link>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="links">
                                <h3>Useful Links</h3>
                                <Link to="/">Home</Link>
                                <Link to='/checkout'>Checkout</Link>
                                <Link to='/payments'>Payments</Link>
                                <Link to='/customers'>Customers</Link>
                                <Link to='/subscriptions'>Subscriptions</Link>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    )
}

export default Footer;