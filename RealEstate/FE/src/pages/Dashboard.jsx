import { AuthContext } from "../context/AuthContext"
import { useContext } from "react"
const Dashboard=async()=>{
const{logout,user}=useContext(AuthContext)
return(
    <div>
        <h2>Dashboard</h2>
        <pre>{JSON.stringify(user,null,2)}</pre>
        <button onClick={logout}>Logout</button>
    </div>
)
}
export default Dashboard;