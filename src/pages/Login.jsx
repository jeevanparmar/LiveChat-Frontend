import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import axios from "axios";
import { LuMessageCircleHeart } from "react-icons/lu";

function Login() {

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [ ]);

  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    password: '',
  });

  const handleLoginClick = () => {
    navigate("/signup");
  };

  const formHandler = async(e) => {
    e.preventDefault();

    if (user.name.length < 4) {
      toast.error("userName incorrect");
      return;
    }
    if (user.password.length < 6) {
      toast.error("password incorrect");
      return;
    }

    await axios.post("http://localhost:5000/api/auth/login",user)
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

  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2a1e37] to-[#1a1523] p-6">
<div>
          <h1 className="text-4xl font-extrabold mb-5 text-center text-white"> GupShup</h1>
          

    <div className="bg-black bg-opacity-80 p-8 rounded-2xl shadow-xl max-w-md w-full space-y-6 ">
    
    
        <h1 className="text-xl  mb-6 text-center text-white">login</h1>
        <form className="space-y-6" onSubmit={formHandler}>
            <input
                type="text"
                placeholder="Enter User Name"
                value={user.name}
                onChange={e => setUser({ ...user, name: e.target.value })}
                className="p-3 w-full border border-blue-500 rounded-lg bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

            <input
                type="password"
                placeholder="Enter Password"
                value={user.password}
                onChange={e => setUser({ ...user, password: e.target.value })}
                className="p-3 w-full border border-blue-500 rounded-lg bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105 duration-300"
            >
                Login
            </button>
        </form>

        <div className="flex items-center justify-center mt-4 space-x-2">
            <p className="text-gray-300">Don't have an account?</p>
            <button onClick={handleLoginClick} className="text-blue-400 hover:underline">Sign Up</button>
        </div>

    </div>
</div>
</div>

  );
}

export default Login;
