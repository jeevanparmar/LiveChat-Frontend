import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IoMdSend } from "react-icons/io";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { RiDeleteBinFill } from "react-icons/ri";
import "../App.css"

function ChatBox({ selectedUser, user, setSelectedUser, socket }) {

    const B_URL = process.env.REACT_APP_BACKEND_URL;
    const ADDMSG = `${B_URL}/api/auth/addMessage`;
    const GETMSG = `${B_URL}/api/auth/getMessages`;
    const DELETEMSG = `${B_URL}/api/auth/deleteMsg`;

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef(null);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [dlt, setDlt] = useState(false);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        const msgsend = newMessage;
        setNewMessage('');

        try {
            socket.current.emit("send-msg", {
                to: selectedUser._id,
                from: user._id,
                msg: msgsend,
            });

            const response = await axios.post(ADDMSG, {
                from: user._id,
                to: selectedUser._id,
                message: msgsend,
            });
            setMessages((prev) => [...prev, { fromSelf: true, message: response.data.message }]);
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Message not sent.');
        }
    };


    useEffect(() => {
        console.log("current", socket.current);
        const currentSocket = socket.current;

        if (currentSocket) {
            currentSocket.on("msg-recieve", (msg) => {
                if (msg.from === selectedUser._id) {
                    setArrivalMessage({ fromSelf: false, message: msg.msg });
                }
            });
        }

        return () => {
            if (currentSocket) {
                currentSocket.off("msg-recieve");
            }
        };
    }, [selectedUser]);

    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    const fetchChat = async () => {
        try {
            const res = await axios.post(GETMSG, {
                from: user._id,
                to: selectedUser._id,
            });
            setMessages(res.data.msg);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;

        }
    }, [messages]);

    useEffect(() => {
        setMessages([]);
        setDlt(false)
        if (selectedUser) {
            fetchChat();
        }
    }, [selectedUser]);

    async function handleDeleteChat() {
        try {
            setDlt(false);
            const res = await axios.post(DELETEMSG, {
                from: user._id,
                to: selectedUser._id,
            });
            if (res) {
                setMessages([]);
                toast.success("Chat Deleted", {
                    autoClose: 1000,
                });
            }

        } catch (e) {
            toast.error("Something went worng", {
                autoClose: 1000,
            })
        }

    }  

    return (
        <div className=" relative bg-gradient-to-br from-[#1e1e2f] to-[#2b2b45] h-[80vh] rounded-xl shadow-xl overflow-hidden max-sm:h-screen">

            <div className="h-full grid grid-rows-[10%_80%_10%] text-white">

                <div className="p-4 bg-[#3a3a5a] font-semibold flex gap-4 items-center shadow-md justify-between">
                    <div className='flex justify-center gap-4 items-center'>
                        <MdOutlineArrowBackIos
                            onClick={()=>setSelectedUser(null)}
                            className="text-2xl cursor-pointer hover:text-[#a29bfe] transition-all duration-300 max-sm:text-xl"
                        />

                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center font-serif justify-center font-semibold max-sm:w-8 max-sm:h-8">
                            {selectedUser?.name?.charAt(0).toUpperCase()}
                        </div>

                        <h2 className="text-xl max-sm:text-lg truncate">{selectedUser?.name || "User"}</h2>
                    </div>
                    <div>
                        {
                            messages.length > 0 &&
                            <RiDeleteBinFill className='text-white text-xl '
                                onClick={() => { setDlt(true) }} />

                        }
                    </div>
                </div>
                {
                    dlt &&
                    <div className="absolute inset-0 flex justify-center items-center text-white z-50">
                        <div className="flex h-14 bg-gradient-to-r from-purple-700 to-indigo-800 gap-4 justify-center items-center p-6 rounded-xl shadow-xl">
                            <button
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-full transition-transform transform hover:scale-105 shadow-md"
                                onClick={handleDeleteChat}
                            >
                             Delete Chat
                            </button>

                            <button
                                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded-full transition-transform transform hover:scale-105 shadow-md"
                                onClick={()=>setDlt(false)}
                            >
                            Cancel
                            </button>
                        </div>
                    </div>

                }

                <div
                    ref={scrollRef}
                    className="p-4 overflow-y-auto text-[#d1d1d1] scrollable-div"
                >
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.fromSelf ? "justify-end" : "justify-start"} mb-2 animate-fadeIn`}
                        >
                            <div
                                className={`p-3 rounded-xl break-words shadow-md transition-transform duration-300 ease-in-out ${message.fromSelf
                                    ? "bg-gradient-to-r from-blue-500 to-blue-700"
                                    : "bg-gradient-to-r from-purple-500 to-purple-700"
                                    }`}
                                style={{
                                    maxWidth: message.message.length > 40 ? "80%" : "60%",
                                }}
                            >
                                {message.message}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-1 bg-[#3a3a5a] shadow-inner">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            sendMessage();
                        }}
                        className="flex items-center justify-center gap-2"
                    >
                        <input
                            type="text"
                            className="w-[90%] h-[100%] p-3 rounded-full bg-[#2b2b45] border-none focus:outline-none focus:ring-2
                        focus:ring-blue-500 text-white placeholder-gray-400 transition-all duration-300 max-sm:p-2 max-sm:w-[80%]"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => {
                                setNewMessage(e.target.value);
                            }}
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-500 transition-transform
                        duration-300 ease-in-out transform active:scale-90 flex justify-center items-center max-sm:p-2"
                        >
                            <IoMdSend className="text-xl max-sm:text-lg" />
                        </button>
                    </form>
                </div>

            </div>

        </div>

    );
}

export default ChatBox;
