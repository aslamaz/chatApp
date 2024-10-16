import React, { useState } from 'react'
import './Login.css'
import assets from '../../assets/assets/assets'
import { signup,login,resetPassword } from '../../config/firebase'


const Login = () => {
    const [currentState, seCurrentState] = useState("Sign up");
    const [Username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const onSubmitHandler = async (event)=> {
            event.preventDefault();
            if (currentState==="Sign up") {
                signup(Username,email,password);
            }
            else{
                login(email,password);
            }
    }

    return (
        <div className='login'>
            <img src={assets.logo_big} alt="" className='logo' />
            <form onSubmit={onSubmitHandler} className='login-form'>
                <h2>{currentState}</h2>
                {currentState === "Sign up" ? <input type="text" placeholder='Username' className="form-input" required onChange={(e)=>setUsername(e.target.value)} value={Username}/> : null}
                <input type="email" placeholder='Email address' className="form-input" required onChange={(e)=>setEmail(e.target.value)} value={email}/>
                <input type="password" placeholder='Password' className="form-input" required onChange={(e)=>setPassword(e.target.value)} value={password}/>
                <button type='submit'>{currentState === "Sign up" ? "Create an account" : "Login"}</button>
                <div className='login-term'>
                    <input type="checkbox" />
                    <p>Agree to the terms of use & privacy policy.</p>
                </div>
                <div className="login-forgot">
                    {currentState === "Sign up"? 
                    <p className='login-toggle'>Already have an account <span onClick={() => seCurrentState("Login")}>Login here</span> </p>
                    :<p className='login-toggle'>Create an account <span onClick={() => seCurrentState("Sign up")}>Click here</span> </p>
                    }
                    {
                        currentState === "Login" ? <p className='login-toggle'>Forgot Password <span onClick={() => resetPassword(email)}>reset here</span> </p> : null
                    }
                </div>
            </form>
        </div>
    )
}

export default Login