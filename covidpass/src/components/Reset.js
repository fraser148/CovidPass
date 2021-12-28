import React, { useEffect, useState }   from "react";
import { Container, Row, Col }          from 'react-bootstrap';
import { useAuthState }                 from "react-firebase-hooks/auth";
import { Link, useNavigate }            from "react-router-dom";
import { auth, PasswordResetEmail }     from "./firebase";
import Header                           from "./Header";


const Reset = () => {
  const [email, setEmail] = useState("");
  const [user, loading, error] = useAuthState(auth);

  const navigator = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) navigator("/dashboard");
  }, [user, loading, navigator]);

  return (
    <div className="main">
        <Container className="container-main">
            <Header />
            <Row className="reset-row">
                <Col className="reset-col" lg={6}>
                    <div className="reset-container">
                        <div className="reset">
                            <h1>Password Reset</h1>
                            <input
                            type="text"
                            className="reset__textBox"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="E-mail Address"
                            />
                            <button
                            className="reset__btn"
                            onClick={() => PasswordResetEmail(email)}
                            >
                            Reset Password
                            </button><br/>
                            <div>
                            Don't have an account? <Link to="/register">Register</Link> now.
                            </div>
                        </div>
                    </div>
                </Col>
                <Col className="login-col design" lg={6}>
                    <div className="login-container ">
                        <img src="./lft-people.png" alt="covid people"/>
                    </div>
                </Col>
            
            </Row>
        </Container>
    </div>
  );
}
export default Reset;