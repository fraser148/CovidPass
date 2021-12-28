import React, { useEffect, useState }   from "react";
import { Link, useNavigate }            from "react-router-dom";
import { Container, Row, Col }          from 'react-bootstrap';
import * as sign                        from "./firebase";
import { useAuthState }                 from "react-firebase-hooks/auth";
import Header                           from './Header';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(sign.auth);
  
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/dashboard");
  }, [user, loading]);

  return (
    <div className="main">
      <Container className="container-main">
        <Header />
        <Row className="login-row">
          <Col className="login-col" lg={6}>
            <div className="login-container">
              <div className="login">
                <h1>Login</h1>
                <input
                  type="text"
                  className="login__textBox"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mail Address"
                  autocomplete="false"
                />
                <input
                  type="password"
                  className="login__textBox"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  autocomplete="false"
                />
                <button
                  className="login__btn"
                  onClick={() => sign.signInEmailPass(email, password)}
                >
                  Log In
                </button>
                <span className="login-break">or</span>
                <div id="gSignInWrapper" onClick={sign.signInGoogle}>
                  <div id="customBtn" className="customGPlusSignIn">
                    <span className="icon"></span>
                    <span className="buttonText">Sign in with Google</span>
                  </div>
                </div>
                <div>
                  <Link to="/reset">Forgot Password</Link>
                </div>
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

export default Login;