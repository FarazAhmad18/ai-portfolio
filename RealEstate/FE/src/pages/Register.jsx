import { useState } from "react"
import {registerUser} from "../api/auth.api"
import { useNavigate } from "react-router-dom"

function Register(){
    const[name,setName]=useState("")
    const[email,setEmail]=useState("")
    const[password,setPassword]=useState("")
    const[role,setRole]=useState('Buyer')
    const[error,setError]=useState('')
    const navigate=useNavigate()
    const onSubmit=async(e)=>{
e.preventDefault()
setError('')
try{
await registerUser({name,email,password,role})
navigate('/login')
}
catch(err)
{
setError(err?.response?.data?.msg||"Register Failed")
  console.error(err); 
}
    }
    return(
        <form onSubmit={onSubmit}>
            <h2>Register User</h2>
            <input placeholder="Name" value={name} onChange={(e)=>{setName(e.target.value)}} />
            <input placeholder="Email" value={email} onChange={(e)=>{setEmail(e.target.value)}} />
            <input placeholder="password" value={password} type="password" onChange={(e)=>{setPassword(e.target.value)}} />
           <select value={role} onChange={(e)=>{setRole(e.target.value)}}>
            <option value="Buyer">Buyer</option>
            <option value="Agent">Agent</option>
           </select>
            <button type="submit">Register</button>
            {error&&<p>{error}</p>}
        </form>
    )
} 
export default Register;