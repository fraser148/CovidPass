import React, { useEffect, useState }   from "react";
import { Container, Row, Col }          from 'react-bootstrap';
import { useAuthState }                 from "react-firebase-hooks/auth";
import { Link, useNavigate }            from "react-router-dom";
import { fetchFromAPI  }                from './helpers';
import * as sign                        from "./firebase";
import Header                           from './Header';

const StepOne = ({nextStep, prevStep, handleFormData}) => {

}


function EmployeeRegister() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        companyId:"",
        companyName:"",
    });
    const [ref, setRef] = useState("");

    const [errors, setErrors] = useState({
        code: ""
    });

    const [company, setCompany] = useState({
        name: "",
        id: ""
    });

    const [user, loading, error] = useAuthState(sign.auth);
    const navigate = useNavigate();


    const register = () => {
        if (!formData.name) alert("Please enter name");
        const {name, email, password, companyId } = formData
        sign.registerEmailPass(name, email, password, companyId);
    };

    const checkCode = async () => {
        const res = await fetchFromAPI('company/reference/'+ ref, { method: 'GET' });
        if (res.company) {
            setFormData({...formData,
                companyName: res.company,
                companyId: res.id
            })
            setErrors({...errors,
                code: ""
            })
        } else {
            setErrors({...errors,
                code: "Whoops, that company doesn't exist."
            })
        }
    }

    const resetCode = () => {
        setFormData({...formData,
            companyName: "",
            CompanyId: "",
        });
        setErrors({...errors,
            code: ""
        })
    }

    const nextStep = () => {
        setStep(step + 1);
    };

    // function for going to previous step by decreasing step state by 1
    const prevStep = () => {
        setStep(step - 1);
    };

    const handleInputData = input => e => {
            // input value from the form
            const {value } = e.target;
        
            //updating for data state taking previous state and then adding new value to create new object
            setFormData(prevState => ({
            ...prevState,
            [input]: value
        }));
    }



    useEffect(() => {
        if (loading) return;
        if (user) navigate("/dashboard");
    }, [user, loading, navigate]);

    switch (step) {
        default:
            return(
                <p>Something has gone wrong :(</p>
            )
        case 1:
            return (
                <div className="main">
                    <Container className="container-main">
                        <Header />
                        <Row className="register-row">
                            <Col className="register-col" lg={6}>
                                <div className="register-container">
                                    <div className="register">
                                        <h1>Staff Sign Up</h1>
                                        {!formData.companyName && (
                                            <>
                                                <p>Please sign up here if your company has registered for this service.</p>
                                                <p>You should have a reference code to join the company.</p>
                                                <input
                                                type="text"
                                                className="register__textBox"
                                                value={ref}
                                                onChange={(e) => setRef(e.target.value)}
                                                placeholder="Company Reference Code"
                                                />
                                                <p>{errors.code}</p>
                                                <button className="register__btn" onClick={checkCode}>
                                                Join Company
                                                </button>
                                            </>
                                        
                                        )}
                                        {formData.companyName && (
                                            <>
                                                <h2>Joining:</h2>
                                                <h3>{formData.companyName}</h3>
                                                <button className="register__btn" onClick={resetCode}>
                                                Change Code
                                                </button>
                                                <button className="register__btn" onClick={nextStep}>
                                                Good to Go!
                                                </button>
                                            </>
                                        )}
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
        case 2:
            return (
                <div className="main">
                    <Container className="container-main">
                        <Header />
                        <Row className="register-row">
                            <Col className="register-col" lg={6}>
                                <div className="register-container">
                                    <div className="register">
                                        <h1>Staff Sign Up</h1>
                                        <button className="" onClick={prevStep}>
                                            &lt;-- Back
                                        </button>
                                        <input
                                            type="text"
                                            className="register__textBox"
                                            value={formData.companyName}
                                            disabled={"disabled"}
                                            placeholder="Full Name"
                                        />
                                        <input
                                            type="text"
                                            className="register__textBox"
                                            value={formData.name}
                                            onChange={handleInputData("name")}
                                            placeholder="Full Name"
                                        />
                                        <input
                                            type="text"
                                            className="register__textBox"
                                            value={formData.email}
                                            onChange={handleInputData("email")}
                                            placeholder="E-mail Address"
                                        />
                                        <input
                                            type="password"
                                            className="register__textBox"
                                            value={formData.password}
                                            onChange={handleInputData("password")}
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
            )
    }

}
export default EmployeeRegister;