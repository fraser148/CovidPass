import React, { useEffect, useState }   from "react";
import { Container, Row, Col }          from 'react-bootstrap';
import { useAuthState }                 from "react-firebase-hooks/auth";
import { Link, useNavigate }            from "react-router-dom";
import * as sign                        from "./firebase";
import Header                           from './Header';

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, loading, error] = useAuthState(sign.auth);
  const navigate = useNavigate();
  const register = () => {
    if (!name) alert("Please enter name");
    sign.registerEmailPass(name, email, password);
  };


  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading]);


  return (
    <div className="main">
      <Container className="container-main">
        <Header />
        <Row className="register-row">
          <Col className="register-col" lg={6}>
            <div className="register-container">
              <div className="register">
                <h1>Sign Up</h1>
                <input
                  type="text"
                  className="register__textBox"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                />
                <input
                  type="text"
                  className="register__textBox"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mail Address"
                />
                <input
                  type="password"
                  className="register__textBox"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
                <button className="register__btn" onClick={register}>
                  Sign Up
                </button>

                <span className="login-break">or</span>
                <div id="gSignInWrapper" onClick={sign.signInGoogle}>
                  <div id="customBtn" className="customGPlusSignIn">
                    <span className="icon"></span>
                    <span className="buttonText">Sign Up with Google</span>
                  </div>
                </div>
                <div>
                  Already have an account? <Link to="/login">Login</Link> now.
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
export default Register;