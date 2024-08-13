import React , {useEffect} from 'react';
import { useLocation,useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { email, id } = location.state || {};

    useEffect(() => {
        if (!email || !id) {
            navigate('/'); // Redirect to home if email or id is missing
        }
    }, [email, id, navigate]);

    return (
            <>
                <div id="kt_body" className="auth-bg" >
                <h2>{id}</h2>



                    <div className="d-flex flex-column flex-root" style={{ height: "100vh" }}>

                        <div className="d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed"
                            style={{ backgroundImage: "url(/assets/media/illustrations/dozzy-1/14.png)" }}>


                            <div className="d-flex flex-column flex-column-fluid text-center p-10 py-lg-20">

                                <a href="../../index.html" className="mb-10 pt-lg-20">
                                    <img alt="Logo" src="/assets/media/logos/logo-default.svg" className="h-60px mb-5" />
                                </a>

                                <div className="pt-lg-10">


                                    <h1 className="fw-bold fs-2qx text-gray-900 mb-7">Verify Your Email</h1>

                                    <div className="fs-3 fw-semibold text-gray-500 mb-10">
                                        We have sent an email to

                                        <a href="#" className="link-primary fw-bold"> {email}</a> <br />

                                        pelase follow a link to verify your email.
                                    </div>

                                    <div className="text-center mb-10">
                                        <a href="#" className="btn btn-lg btn-primary fw-bold">Skip for now</a>
                                    </div>


                                </div>

                            </div>

                            <div className="d-flex flex-center flex-column-auto p-10">

                                <div className="d-flex align-items-center fw-semibold fs-6">
                                    <a href="https://keenthemes.com/" className="text-muted text-hover-primary px-2">About</a>

                                    <a href="mailto:support@keenthemes.com" className="text-muted text-hover-primary px-2">Contact</a>

                                    <a href="https://keenthemes.com/products/rider-html-pro" className="text-muted text-hover-primary px-2">
                                        Purchase
                                    </a>
                                </div>

                            </div>

                        </div>

                    </div>


                </div>


            </>
        );
    };
    
    export default VerifyEmail;