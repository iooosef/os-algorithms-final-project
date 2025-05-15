import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {HSTogglePassword} from 'flyonui/flyonui'
import useFormValidation from './useFormValidation';
import { useConfig } from './util/ConfigContext';

const Register = () => {
    const { serverUrl, appName } = useConfig();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    useFormValidation();

    const RegisterClick = async (e) => {
        const form = e.target;
        const payload = {
            email: form.elements.email.value,
            password: form.elements.password.value,
            username: form.elements.username.value
        };

        try {
            const response = await fetch(`${serverUrl}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },        
                credentials: 'include',
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                const data = await response.json();
                alert('Registration successful!');
                navigate('/');
            } else {
                const data = await response.json();
                setErrors(data);
                console.error(data.error)
                alert(`Registration failed! ${data.error}`);
            }
        } catch (err) {
            console.error("Error during registration:", err);
            alert('An error occurred, please try again.',);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        RegisterClick(e); // Trigger the registration logic
    }
      
    return (
        <section className="bg-gray-50 relative">
            <header className='w-full absolute pr-5 pt-5 flex justify-end opacity-90'>                
                <a onClick={() => navigate('/login')}  className="btn rounded-full transition-all duration-300 ease-in-out transform hover:scale-105">Sign In</a>
            </header>
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="#" className="flex items-center mb-6 mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl">
                    {appName ?? ''}
                </a>
                <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 ">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                            Create an account
                        </h1>
                        <form id="form-container" className="gap-4 flex flex-col needs-validation" noValidate onSubmit={handleSubmit}>
                            <div className="w-full">
                                <label className="label-text mb-1" htmlFor="username-input">Username</label>
                                <input type="text" className="input" id="username-input" name="username" required minLength={6} />
                                <span className="error-message">Please enter your username.</span>
                            </div>
                            <div className="w-full">
                                <label className="label-text mb-1" htmlFor="email-input">Email</label>
                                <input type="email" className="input" id="email-input" name="email" required />
                                <span className="error-message">Please enter your email.</span>
                            </div>
                            <div className="w-full">
                                <label className="label-text mb-1" htmlFor="password-input">Password</label>
                                <div className='flex relative'>
                                    <input type="password" className="w-full grow input" id="password-input" name="password" required minLength={6} />
                                    <button type="button" data-toggle-password='{ "target": "#password-input" }' 
                                            className="block absolute right-0 p-2 cursor-pointer text-black" aria-label="password toggle" >
                                        <span className="icon-[tabler--eye] text-base-content/80 password-active:block hidden size-5 shrink-0"></span>
                                        <span className="icon-[tabler--eye-off] text-base-content/80 password-active:hidden block size-5 shrink-0"></span>
                                    </button>
                                </div>
                                <span className="error-message">Please enter your password.</span>
                            </div>
                            {errorMessage && <p className="w-full mt-2 py-4 badge badge-error">{errorMessage}</p>}
                            <div id="login-btn-container" className="flex flex-col items-center justify-center mt-4">
                                <button type="submit" className="relative w-full flex justify-center items-center
                                    btn btn-primary
                                    transition-all duration-300 ease-in-out transform hover:scale-105">
                                    Register
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            </section>
    );
}

export default Register;