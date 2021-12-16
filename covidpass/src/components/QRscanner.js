import React, { useState } from 'react';
import QrReader from 'react-qr-reader';
import Header from './Header';
import { Formik } from 'formik';

const Basic = (props) => (
    <div>
      <Formik
        enableReinitialize
        initialValues={{LFT: props.result}}
            validate={values => {
            const errors = {};
            if (!values.LFT) {
                errors.LFT = 'Required';
            } else if (
                !/^L[A-Z]{2}[0-9]{8}$/gm.test(values.LFT)
            ) {
                errors.LFT = 'Invalid LFT ID';
            }
            return errors;
            }}

            onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
            }, 400);
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
            <div className="QRscanner-container">
                <div className="QRscanner">
                    <QrReader
                        delay={300}
                        onError={handleError}
                        onScan={handleScan}
                        className={"scanner"}
                    />
                    <Basic result={result} />
                    {/* {result && <p className="LFT-ID">{result}</p>} */}
                </div>
            </div>
        </div>

    )
}

export default QRscanner;