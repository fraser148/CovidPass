import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QrReader from 'react-qr-reader';
import { fetchFromAPI, isEmployee } from './helpers';
import Header from './Header';
import Footer from './Footer';
import { Formik, Field } from 'formik';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from './firebase';

const usePremiumStatus = (user) => {
    const [premiumStatus, setPremiumStatus] = useState(undefined);

    useEffect(() => {
        if (user) {
          const checkPremiumStatus = async function () {
                const role = await isEmployee();
                if (role === "employee"){
                    setPremiumStatus(true);
                } else {
                    setPremiumStatus(false)
                }
          };
          checkPremiumStatus();
        }
      }, [user]);
    
      return premiumStatus;
}

const handleSubmit = async (result) => {
    const res = await fetchFromAPI('employee/result', {
        body: {
            resultId: result.LFT,
            result: result.result
        }
    });
    console.log(res)
}

const Basic = (props) => (
    <div>
      <Formik
        enableReinitialize
        initialValues={{
            LFT: props.result,
            result: "",
            }}
            validate={values => {
            const errors = {};
            if (!values.LFT) {
                errors.LFT = 'Required';
            } else if (!/^L[A-Z]{2}[0-9]{8}$/gm.test(values.LFT)) {
                errors.LFT = 'Invalid LFT ID';
            };

            if (!values.result) {
                errors.result = "Please select the result"
            };
            return errors;
            }}

            onSubmit={(values, { setSubmitting, resetForm, props }) => {
                handleSubmit(values);
                setTimeout(() => {
                    alert(JSON.stringify(values, null, 2));
                    setSubmitting(false);
                }, 400);
                resetForm();
                props.setResult("")
            }}

        >
            {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
            }) => (

            <form onSubmit={handleSubmit} className="LFT-submission">
                <input
                type="text"
                name="LFT"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.LFT}
                placeholder="ABC12345678"
                autocomplete="off"
                />
                {errors.LFT && touched.LFT && <p className="errors">{errors.LFT}</p>}
                <div className="radio-group">
                    <div className="radio-holder">
                        <label className="cool-radio">
                            <Field type="radio" name="result" value="negative" />
                            <span>Negative</span>
                            <img src="./negative-test.png" alt="negative tests"/>
                        </label>
                    </div>
                    <div className="radio-holder">
                        <label className="cool-radio">
                            <Field type="radio" name="result" value="positive" />
                            <span>Positive</span>
                            <img src="./positive-test.png" alt="positive tests"/>
                        </label>
                    </div>
                    <div className="radio-holder">
                        <label className="cool-radio">
                            <Field type="radio" name="result" value="invalid" />
                            <span>Invalid</span>
                            <img src="./void-test.png" alt="void tests"/>
                        </label>
                    </div>
                </div>
                {errors.result && touched.result && <p className="errors">{errors.result}</p>}

                <button type="submit" disabled={isSubmitting}>
                Submit
                </button>
            </form>
            )}
        </Formik>
    </div>
  );
  

const QRscanner = () => {
    const [result, setResult] = useState("");
    const [user, userLoading] = useAuthState(auth);
    const [scanner, setScanner] = useState(false)
    const userIsPremium = usePremiumStatus(user);

    console.log(user)

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (loading) {
          // maybe trigger a loading screen
          return;
        }
        if (userIsPremium === false || (!user && !userLoading)) navigate("/dashboard");
      }, [user, userIsPremium, loading, navigate, userLoading]);

    const handleScan = data => {
        // LFT ID regex definition
        const regex = /^L[A-Z]{2}[0-9]{8}$/gm;
        let m;

        if ((m = regex.exec(data)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            
            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
                console.log(`Found match, group ${groupIndex}: ${match}`);
                setResult(data);
            });
        } else if (data !== null) {
            console.log("invalid scan: "+ data)
        }
    }
    const handleError = err => {
        console.error(err)
    }

    return (
        <div className="main">
            <Header />

            {!user && userLoading && <span>Loading...</span>}
            {user && !userLoading && (
                <div className="QRscanner-container">
                    <div className="QRscanner-content">
                        <h2>Submit a Test Result</h2>
                        <h3>What's the test strip ID number?</h3>
                        <p>The ID number is printed on the test strip (near the QR code)</p>
                    </div>
                    <div className="QRscanner-content">
                        <div className="QRscanner">
                            {scanner && (
                                <QrReader
                                    delay={300}
                                    onError={handleError}
                                    onScan={handleScan}
                                    className={"scanner"}
                                    style={{hidden: true}}
                                />
                            )}
                            <button className="action-button" onClick={() => setScanner(!scanner)}>Toggle ID scanner (QR code)</button>
                            <Basic
                                result={result}
                                reset={setResult}
                            />
                            {/* {result && <p className="LFT-ID">{result}</p>} */}
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>

    )
}

export default QRscanner;