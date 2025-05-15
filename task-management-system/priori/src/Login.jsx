import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {HSTogglePassword} from 'flyonui/flyonui'
import useFormValidation from './useFormValidation';

import { useUser } from './auth/UserContext'; 
import { useConfig } from './util/ConfigContext';

const Login = () => {
    // Initialize FlyonUI components
    useFormValidation();
    useEffect(() => {
        HSTogglePassword.autoInit();
      }, []);

    const { serverUrl, appName } = useConfig();
    // Variable Declaration
    const { login } = useUser();
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    
    const LoginClick = async (e) => {
        const form = e.target;
        const payload = {
            email: form.elements.email.value,
            password: form.elements.password.value,
        };
        try {
            const response = await fetch(`${serverUrl}/auth/login`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },        
              credentials: 'include',
              body: JSON.stringify(payload),
            });
            if (response.ok) {
              const data = await response.json();
              login(data);
              navigate('/menu');
            } else {
              const data = await response.json();
              setErrorMessage(data.error);
            }
        } catch (error) {
            console.error("Error during login:", error);
            setErrorMessage('An error occurred, please try again.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        LoginClick(e); // Trigger the login logic
    };
      
    return (
        <div className="w-screen h-screen relative top-0 flex flex-col items-center">
            <header className='w-full absolute pr-5 pt-5 flex justify-end opacity-90'>                
                <a onClick={() => navigate('/register')}  className="btn rounded-full transition-all duration-300 ease-in-out transform hover:scale-105">Sign Up</a>
            </header>
            <main className='w-full h-full flex flex-col justify-center items-center'>                
                <div className="logo-banner-container mb-[50px]">
                    <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
                        {appName ?? ''}
                    </h1>
                </div>
                <form id="form-container" className="gap-4 flex flex-col needs-validation" noValidate onSubmit={handleSubmit}>
                    <div className="w-[300px]">
                        <label className="label-text mb-1" htmlFor="email-input">Email</label>
                        <input type="email" className="input" id="email-input" name="email" required />
                        <span className="error-message">Please enter your email.</span>
                    </div>
                    <div className="w-[300px]">
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
                            Login
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default Login;