import {useNavigate } from "react-router-dom";
import { useState , useEffect } from "react";
import { toast } from 'react-toastify';
import axios from 'axios';

function Signup() {

  const navigate = useNavigate();

useEffect(()=>{
if(localStorage.getItem("user")){
  navigate("/");
}
},[]);

  const [user, setUser] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  const handleLoginClick = () => {
    navigate("/login");
  };

  const FormSubmit = async (e) => {
    e.preventDefault();
    //validation 
    if (user.email === "" || user.password === "" || user.name === "" || user.confirmPassword === "") {
      toast.error("Please fill all the fields");
      return;
    }
    if (user.password !== user.confirmPassword) {
      toast.error("Password does not match");
      return;
    }
    if (user.name.length < 4) {
      toast.error("UserName should be atleast 4 characters");
      return;
    }
    if (user.password.length < 6) {
      toast.error("Password should be atleast 6 digits");
      return;
    }
    //api call
    await axios.post("http://localhost:5000/api/auth/signup",user)
            .then(response => {
                toast.success(response.data.message);
               const user = response.data.user;
               localStorage.setItem('user', JSON.stringify(user)); 
                navigate("/");
            })
            .catch(error => {
                console.log( error.response.data.message); 
                toast.error(error.response.data.message);
            });
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2a1e37] to-[#1a1523] p-6">
      <div>
      <h1 className="text-4xl font-extrabold mb-5 text-center text-white"> GupShup</h1>

    <div className="bg-black bg-opacity-80 p-8 rounded-2xl shadow-xl max-w-md w-full space-y-6">

        <h1 className="text-xl  mb-6 text-center text-white">SignUp</h1>

        <form className="space-y-6" onSubmit={FormSubmit}>
            <input
                type="text"
                placeholder="Enter User Name"
                value={user.name}
                onChange={e => setUser({ ...user, name: e.target.value })}
                className="p-3 w-full border border-blue-500 rounded-lg bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
            />

            <input
                type="email"
                placeholder="Enter Email"
                value={user.email}
                onChange={e => setUser({ ...user, email: e.target.value })}
                className="p-3 w-full border border-blue-500 rounded-lg bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
            />

            <input
                type="password"
                placeholder="Enter Password"
                value={user.password}
                onChange={e => setUser({ ...user, password: e.target.value })}
                className="p-3 w-full border border-blue-500 rounded-lg bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
            />

            <input
                type="password"
                placeholder="Confirm Password"
                value={user.confirmPassword}
                onChange={e => setUser({ ...user, confirmPassword: e.target.value })}
                className="p-3 w-full border border-blue-500 rounded-lg bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
            />

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105 duration-300"
            >
                Sign Up
            </button>
        </form>

        <div className="flex items-center justify-center mt-4 space-x-2">
            <p className="text-gray-300">Already have an account?</p>
            <button onClick={handleLoginClick} className="text-blue-400 hover:underline">Login</button>
        </div>

    </div>
</div>
</div>
  );
}

export default Signup;
