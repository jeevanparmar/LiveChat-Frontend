import React from 'react'
import Logo from "../assets/images.jpeg";


function ChatEmpty({ user }) {
    return (
        <div className='bg-gradient-to-br from-[#2a1e37] to-[#1a1523] h-full flex justify-center items-center p-6'>
            <div className='flex flex-col items-center text-center space-y-8'>

                <div className='relative'>
                    <img 
                        src={Logo} 
                        alt='Welcome Image' 
                        className='w-40 h-40 object-cover rounded-full shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out'
                    />
                    <div className='absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-30 blur-lg'></div>
                </div>

                <h1 className='text-cyan-100 font-mono text-4xl font-semibold tracking-wide animate-fade-in'>
                    Welcome, <span className='text-blue-400'>{user.name}</span>
                </h1>
                
                <p className='text-gray-300 text-lg max-w-md leading-relaxed'>
                    Select a chat to start messaging and stay connected with your friends!
                </p>

            </div>
        </div>
    )
}

export default ChatEmpty
