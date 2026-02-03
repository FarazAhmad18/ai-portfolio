import { useContext, useState } from "react";
import { loginUser } from "../api/auth.api";
import {AuthContext} from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const Login =()=>{
const [email,setEmail]=useState('')
const[password,setPassword]=useState('')
const[error,setError]=useState('')
const loadUser=useContext(AuthContext)
const navigate=useNavigate()
const submit=async(e)=>{
    e.preventDefault()
      console.log("SUBMIT FIRED", { email, password });
    setError('')
    try{
        res=await loginUser({email,password})
        localStorage.setItem("token",res.data.token)
        await loadUser()
        const role=res.data.user?.role
        if(role=='Agent') navigate('/dashboard')
        else navigate('/properties')
    }
    catch(e){
        setError(e?.response?.data?.msg||"Login Failed")
    }
    finally{
        setError('')
    }
}
    return(
        <>
        <form onSubmit={submit}>
            <input type="text" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
            <input type="password"value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
        <button type="submit">Login</button>
        {error&&<p>{error}</p>}
        </form>
        </>
    );
}
export default Login;