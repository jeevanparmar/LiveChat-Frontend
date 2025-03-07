import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import ChatBox from '../componet/ChatBox';
import ChatEmpty from '../componet/ChatEmpty';
import { io } from "socket.io-client";
import { FaSignOutAlt } from 'react-icons/fa';
import { RiChatSmileAiFill } from "react-icons/ri";
import "../App.css"


function Chat() {
  const B_URL = process.env.REACT_APP_BACKEND_URL;
  const GETUSERS = `${B_URL}/api/auth/getAlluser`;
  const ChatedUsers = `${B_URL}/api/auth/chatedMsg`;

  const [activeTab, setActiveTab] = useState('All');
  const socket = useRef();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [Loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [chatedUsers, setChatedUsers] = useState([]);
  const [showUsers, setshowUsers] = useState([]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const onLogout = () => {
    localStorage.clear();
    navigate("/login")
  }


  useEffect(() => {
    if (user) {
      socket.current = io(B_URL, {
        transports: ["websocket"],
        withCredentials: true,
      });
      socket.current.emit("add-user", user._id);
      return () => {
        socket.current.disconnect();
      };
    }
  }, [user]);

  const fetchUsers = async (userId) => {
    try {
      const response = await axios.post(GETUSERS, { id: userId });
      setAllUsers(response.data.users);
      setshowUsers(response.data.users);
    } catch (error) {
      console.error('Error:', error?.response?.data?.message || 'Something went wrong');
      toast.error(error?.response?.data?.message || 'Error fetching users');
    }
  };


  const handleUserClick = (u) => {
    setSelectedUser(u);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchUsers(parsedUser._id);
      setLoading(true)
    }
  }, [navigate]);

  const handleChatTab = async () => {
    setActiveTab('Chat');
    try {
      const response = await axios.post(ChatedUsers, { userId: user._id });
      const chat = response.data.users;
      const chatUserIds = chat.map((user) => user);
      const filteredUsers = allUsers.filter((user) => chatUserIds.includes(user._id));
      setChatedUsers(filteredUsers);
      setshowUsers(filteredUsers);

    } catch (e) {
      alert("something went worng");
    }
  };

  const handleAllTab = async () => {
    setActiveTab('All');
    setshowUsers(allUsers);
  }

  return (
    <div className="h-screen flex justify-center items-center bg-[#1a1c35] ">
      {
        Loading &&
        <div className="grid grid-cols-[30%_70%] gap-1 h-4/5 w-[80%] shadow-lg rounded-lg max-sm:grid-cols-1 
        max-sm:w-full max-sm:h-screen">

          <div className="bg-gradient-to-b from-[#5A3F79] to-[#2B1B3A] grid grid-rows-[12%_78%_12%] h-[80vh] 
          rounded-l-lg max-sm:rounded-lg">

            <div className="flex justify-center items-center font-bold text-xl text-white tracking-wide shadow-md
             max-sm:text-lg gap-2">
              <RiChatSmileAiFill />
              <h1 className='font-serif'> GupShup </h1>
            </div>

            <div className=" scrollable-div">


              {/* Tabs */}
              <div className="flex justify-around border-b-2 p-2 mb-2">
                <button
                  className={`px-4 py-1 rounded-md text-white transition duration-300 
      ${activeTab === 'All' ? 'border-b-white border-b-2 scale-110' : ''} 
      hover:bg-gradient-to-r from-[#6A4B90] to-[#5A3F79] hover:scale-105`}
                  onClick={() => handleAllTab()}
                >
                  All
                </button>

                <button
                  className={`px-4 py-1 rounded-md text-white transition duration-300 
      ${activeTab === 'Chat' ? 'border-b-white border-b-2 scale-110' : ''} 
      hover:bg-gradient-to-r from-[#6A4B90] to-[#5A3F79] hover:scale-105`}
                  onClick={() => handleChatTab()}
                >
                  Chats
                </button>
              </div>



              {showUsers.length > 0 ? (
                showUsers.map((u) => (
                  <div
                    key={u._id}
                    onClick={() => handleUserClick(u)}
                    className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 transition duration-300
                       ${selectedUser && selectedUser._id === u._id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white scale-105'
                        : 'bg-[#4A3A60] hover:bg-[#6A4B90] text-white'
                      }`}
                  >
                    <div className="w-9 h-9 bg-blue-400 rounded-full flex items-center justify-center
                     font-serif max-sm:w-8 max-sm:h-8">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="flex-1 truncate">{u.name}</span>
                  </div>
                ))
              ) : (
                <p className="text-center text-white opacity-75 mt-4 animate-pulse">
                  <span>{activeTab == 'All' ? 'Users are loading...' : 'No Chat found'}</span>
                </p>

              )}
            </div>


            <div className="relative flex justify-center items-center bg-[#36254d] text-white 
            font-medium tracking-wide shadow-md max-sm:text-sm">
              {user ? (
                <>
                  <div onClick={toggleDropdown}
                    className=" cursor-pointer flex items-center gap-1" >
                    <div className="w-8 h-8 bg-[#e4cd46] rounded-full flex items-center justify-center 
                     font-serif max-sm:w-8 max-sm:h-8 text-black">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="flex-1 truncate text-2xl text-blue-400">{user.name}</span>
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute top-full mb-2 right-auto  text-white rounded-md shadow-lg ">
                      <ul className="p-2">
                        <li
                          className="flex items-center p-2 hover:bg-[rgb(28,29,0)] cursor-pointer"
                          onClick={onLogout}
                        >
                          <FaSignOutAlt className="mr-2" />
                          Logout
                        </li>
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                'User not loaded'
              )}
            </div>

          </div>

          {
            selectedUser ?
              (<div> <ChatBox selectedUser={selectedUser} setSelectedUser={setSelectedUser} user={user} socket={socket} /> </div>)
              : (<div> <ChatEmpty user={user} /> </div>)
          }
          <div className="fixed flex justify-center items-center gap-1 bottom-2 left-1/2 -translate-x-1/2 p-2 text-slate-200 text-sm hide-on-small">
            <RiChatSmileAiFill className="text-lg" />
            <span className="flex items-center font-serif gap-1">
              Created by <span className='text-white'>JEEVAN PARMAR</span>
            </span>
          </div>


        </div>}
    </div>
  );
}

export default Chat;
