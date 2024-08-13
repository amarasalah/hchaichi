import React, {  useState,useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';


const clientId = "212614114764-scduo8rud6qlrg210iqpu7b981kl2hvd.apps.googleusercontent.com";

const Signup = () => {
    const btnRef1 = useRef(null);
    const btnRef2 = useRef(null);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const password = watch('password');

    const [passwordStrength, setPasswordStrength] = useState(0);

    const checkPasswordStrength = (password) => {
        //alert(password)
        let nbverif = 0;
        if(password.length >= 8){
            nbverif += 1;
        }
        if(/[a-zA-Z]/.test(password)){
            nbverif += 1;
        }
        if(/\d/.test(password)){
            nbverif += 1;
        }
        if(/[@!%*?&]/.test(password)){
            nbverif += 1;
        }


        setPasswordStrength(nbverif);
    };



    const onSubmit = async data => {

        try {
            btnRef1.current.style.display = 'none';
            btnRef2.current.style.display = 'block';
            const response = await axios.post('http://localhost:4000/auth/register', data, { withCredentials: true });

            if (response.data.result) {

                // Redirect to "verifemail" and pass email and id from data response
                navigate('/auth/verifemail', { state: { email: response.data.email, id: response.data.id } });
            } else {

                Swal.fire({
                    title: 'Error',
                    text: response.data.message,
                    icon: 'error'
                });

                // Handle redirection or success message here

            }



            //console.log('Response:', response.data);
            // Redirect or show success message
        } catch (error) {
            console.error('There was an error signing up!', error);
            Swal.fire({
                title: 'Error',
                text: 'There was an error signing up!: ' + error,
                icon: 'error'
            });
        }
        btnRef2.current.style.display = 'none';
        btnRef1.current.style.display = 'block';
    };



    const onSuccess = (res) => {
        console.log("Login Success! Current user: ", res.profileObj);
        try {
            axios.post('http://localhost:4000/auth/google/register', res.profileObj, { withCredentials: true } 
            ).then(response => {
                if (response.data.result) {
                    if (response.data.token) {
                        //navigate(`/user/addorder/${response.data.user._id}`, { replace: true });

                        if(response.data.client.role == 'admin'){
                            navigate(`/dashboard`, { replace: true });
                        }else if (response.data.client.role == 'client'){
                            navigate(`/user/addorder`, { replace: true });
                        }else{
                            navigate(`/`, { replace: true });
                        }




                        
                    }
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: response.data.message,
                        icon: 'error'
                    });
                }
            }).catch(error => {
                console.error('There was an error signing up!', error);
            });
        } catch (error) {
            console.error('There was an error signing up!', error);
            Swal.fire({
                title: 'Error',
                text: 'There was an error signing up!: ' + error,
                icon: 'error'
            });
        }
    }
    const onFailure = (res) => {
        console.log("Login Failure!: ", res);
        Swal.fire({
            title: 'Error',
            text: 'There was an error signing up!: ' + res,
            icon: 'error'
        });
    }

    useEffect(() => {
        function start() {
            gapi.client.init({
                clientId: clientId,
                scope: ""
            })
        }
        gapi.load("client:auth2", start);
    }, []);





    return (
        <>
            <div id="kt_body" className="auth-bg">

                <div className="d-flex flex-column flex-root">

                    <div className="d-flex flex-column flex-lg-row flex-column-fluid">

                        <div className="d-flex flex-column flex-lg-row-auto w-xl-600px bg-primary positon-xl-relative">

                            <div className="d-flex flex-column position-xl-fixed top-0 bottom-0 w-xl-600px ">

                                <div className="d-flex flex-row-fluid flex-column flex-center text-center p-10 pt-lg-20">

                                    <a href="/" className="py-9 mb-10">
                                        <img alt="Logo" src="/assets/media/logos/logo-compact-light.svg" className="h-70px" />
                                    </a>



                                    <h1 className="fw-bold fs-2qx pb-5 pb-md-10 text-white">
                                        Welcome to Rider
                                    </h1>



                                    <p className="text-white fw-semibold fs-2">
                                        Discover Simply Amazing Admin Dashboard <br />
                                        With The Stunning Design System
                                    </p>

                                </div>

                                <div className="d-flex flex-row-auto flex-center">
                                    <img src="/assets/images/signupimg.jpg" alt=""
                                        className="h-200px h-lg-350px mb-10" />
                                </div>

                            </div>

                        </div>

                        <div className="d-flex flex-column flex-lg-row-fluid py-10">

                            <div className="d-flex flex-center flex-column flex-column-fluid">

                                <div className="w-lg-600px p-10 p-lg-15 mx-auto">


                                    <div className="form w-100">
                                        <div className="mb-10 text-center">
                                            <h1 className="text-gray-900 mb-3">Create an Account</h1>
                                            <div className="text-gray-500 fw-semibold fs-4">
                                                Already have an account?
                                                <a href="/auth/signin" className="link-primary fw-bold"> Sign in here</a>
                                            </div>
                                        </div>


                                        <GoogleLogin
                                            className="google-login-button  btn btn-light-primary fw-bold w-100 mb-10 "
                                            clientId={clientId}
                                            buttonText="Sign in with Google"
                                            onSuccess={onSuccess}
                                            onFailure={onFailure}
                                            cookiePolicy={'single_host_origin'}
                                            isSignedIn={false}  

                                        />

                                        <form className="form w-100" noValidate="novalidate" onSubmit={handleSubmit(onSubmit)}>
                                            <div className="d-flex align-items-center mb-10">
                                                <div className="border-bottom border-gray-300 mw-50 w-100"></div>
                                                <span className="fw-semibold text-gray-500 fs-7 mx-2">OR</span>
                                                <div className="border-bottom border-gray-300 mw-50 w-100"></div>
                                            </div>

                                            <div className="row fv-row mb-7">
                                                <div className="col-xl-6">
                                                    <label className="form-label fw-bold text-gray-900 fs-6">First Name</label>
                                                    <input
                                                        className="form-control form-control-lg form-control-solid"
                                                        type="text"
                                                        placeholder=""
                                                        {...register('firstName', { required: 'First name is required' })}
                                                    />
                                                    {errors.firstName && <p>{errors.firstName.message}</p>}
                                                </div>

                                                <div className="col-xl-6">
                                                    <label className="form-label fw-bold text-gray-900 fs-6">Last Name</label>
                                                    <input
                                                        className="form-control form-control-lg form-control-solid"
                                                        type="text"
                                                        placeholder=""
                                                        {...register('lastName', { required: 'Last name is required' })}
                                                    />
                                                    {errors.lastName && <p>{errors.lastName.message}</p>}
                                                </div>
                                            </div>

                                            <div className="fv-row mb-7">
                                                <label className="form-label fw-bold text-gray-900 fs-6">Email</label>
                                                <input
                                                    className="form-control form-control-lg form-control-solid"
                                                    type="email"
                                                    placeholder=""
                                                    {...register('email', { required: 'Email is required', pattern: { value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, message: 'Email is not valid' } })}
                                                />
                                                {errors.email && <p>{errors.email.message}</p>}
                                            </div>

                                            <div className="mb-10 fv-row">
                                                <div className="mb-1">
                                                    <label className="form-label fw-bold text-gray-900 fs-6">Password</label>
                                                    <div className="position-relative mb-3">
                                                        <input
                                                            className="form-control form-control-lg form-control-solid"
                                                            type="password"
                                                            placeholder=""
                                                            
                                                            {...register('password', {
                                                                required: 'Password is required',
                                                                pattern: {
                                                                    value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!%*?&])[A-Za-z\d@!%*?&]{8,}$/,
                                                                    message: 'Use 8 or more characters with a mix of letters, numbers & symbols except $'
                                                                }
                                                            })}
                                                            onChange={(e) => checkPasswordStrength(e.target.value)}
                                                        />
                                                        {errors.password && <p>{errors.password.message}</p>}
                                                    </div>
                                                    <div className="d-flex align-items-center mb-3">
                                                        <div className={`flex-grow-1 rounded h-5px me-2 bg-secondary bg-active-success  ${passwordStrength > 0 ? 'active' : ''}`}></div>
                                                        <div className={`flex-grow-1 rounded h-5px me-2 bg-secondary bg-active-success  ${passwordStrength > 1 ? ' active' : ''}`}></div>
                                                        <div className={`flex-grow-1 rounded h-5px me-2 bg-secondary bg-active-success  ${passwordStrength >2 ? 'active' : ''}`}></div>
                                                        <div className={`flex-grow-1 rounded h-5px bg-secondary bg-active-success  ${passwordStrength >3 ? 'active' : ''}`}></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="fv-row mb-5">
                                                <label className="form-label fw-bold text-gray-900 fs-6">Confirm Password</label>
                                                <input
                                                    className="form-control form-control-lg form-control-solid"
                                                    type="password"
                                                    placeholder=""
                                                    {...register('confirmPassword', {
                                                        required: 'Confirm password is required',
                                                        validate: value => value === password || 'Passwords do not match'
                                                    })}
                                                />
                                                {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
                                            </div>

                                            <div className="fv-row mb-10">
                                                <label className="form-check form-check-custom form-check-solid form-check-inline">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        {...register('toc', { required: 'You must agree to the terms and conditions' })}
                                                    />
                                                    <span className="form-check-label fw-semibold text-gray-700 fs-6">
                                                        I Agree <a href="#" className="ms-1 link-primary">Terms and conditions</a>.
                                                    </span>
                                                </label>
                                                {errors.toc && <p>{errors.toc.message}</p>}
                                            </div>

                                            <div className="text-center">
                                                <button type="submit" id="kt_sign_up_submit" className="btn btn-lg btn-primary">
                                                    <span ref={btnRef1} className="indicator-label">Submit</span>
                                                    <span ref={btnRef2} className="indicator-progress">
                                                        Please wait...
                                                        <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                                                    </span>
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                </div>

                            </div>

                            <div className="d-flex flex-center flex-wrap fs-6 p-5 pb-0">

                                <div className="d-flex flex-center fw-semibold fs-6">
                                    <a href="/" className="text-muted text-hover-primary px-2"
                                         >Home</a>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </>
    );
};

export default Signup;