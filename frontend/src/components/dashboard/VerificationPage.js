import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const VerificationPage = () => {
  const { userId, token } = useParams();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Define the URL endpoint for your API
    const endpoint = `http://localhost:4000/auth/${userId}/verify/${token}`;

    // Perform the Axios request
    axios.post(endpoint)
      .then(response => {
        //console.log(response.data.message)
        // Handle successful response
        setStatus('success');
        setMessage(response.data.message);
      })
      .catch(error => {
        // Handle error
        setStatus('error');
        setMessage('There was an error activating your account. Please try again.');
      });
  }, []); 

  return (
    <div
      style={{
        fontFamily: "Arial,Helvetica,sans-serif",
        lineHeight: "1.5",
        fontWeight: "normal",
        fontSize: 15,
        color: "#2F3044",
        minHeight: "100vh",
        margin: 0,
        padding: 0,
        width: "100%",
        height:"100%",
        backgroundColor: "#edf2f7"
      }}
    >
      <table
        align="center"
        border={0}
        cellPadding={0}
        cellSpacing={0}
        width="100%"
        style={{
          borderCollapse: "collapse",
          margin: "0 auto",
          padding: 0,
          maxWidth: 600
        }}
      >
        <tbody>
          <tr>
            <td
              align="center"
              valign="center"
              style={{ textAlign: "center", padding: 40 }}
            >
              <a href="/" rel="noopener" target="_blank">
                <img alt="Logo" style={{ width: '100px' }} src="/assets/media/logos/logo-compact.svg" />
              </a>
            </td>
          </tr>
          <tr>
            <td align="left" valign="center">
              <div
                style={{
                  textAlign: "center",
                  margin: "0 20px",
                  padding: 40,
                  backgroundColor: "#ffffff",
                  borderRadius: 6
                }}
              >
                {/*begin:Email content*/}
                {status === 'loading' && (
                  <div style={{ paddingBottom: 30, fontSize: 36 }}>
                    <strong>Loading...</strong>
                  </div>
                )}
                {status === 'success' && (
                  <div style={{ paddingBottom: 30, fontSize: 36 }}>
                    <strong>{message}</strong>
                  </div>
                )}
                {status === 'error' && (
                  <div style={{ paddingBottom: 30, fontSize: 36 }}>
                    <strong>{message}</strong>
                  </div>
                )}
              </div>
            </td>
          </tr>
          <tr>
            <td
              align="center"
              valign="center"
              style={{
                fontSize: 13,
                textAlign: "center",
                padding: 20,
                color: "#6d6e7c"
              }}
            >
              <p>Floor 5, 450 Avenue of the Red Field, SF, 10050, USA.</p>
              <p>
                {" "}
                Copyright ©{" "}
                <a href="/" rel="noopener" target="_blank">
                  Keenthemes
                </a>
                .
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default VerificationPage;
