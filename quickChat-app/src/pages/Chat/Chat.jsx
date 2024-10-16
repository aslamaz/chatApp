import React, { useContext, useEffect, useState } from 'react'
import './Chat.css'
import LeftSideBar from '../../components/LeftSidebar/LeftSideBar'
import ChatBox from '../../components/ChatBox/ChatBox'
import RightSideBar from '../../components/RihtSideBar/RightSideBar'
import { AppContext } from '../../context/AppContext'

const Chat = () => {
const {chatData,userData,rightSideVisible } = useContext(AppContext);
const [loading,setLoading] = useState(true);

useEffect(()=>{
  if (chatData && userData) {
    setLoading(false)
  }
},[chatData,userData])
  return (
    <div className='chat'>
      
      <div className='greendiv'></div>
      <div style={{display:"grid",placeItems:"center"}}>
      {
        loading
        ?<p className='loading'>Loading...</p>
        :
        <div className="chat-container" style={{ gridTemplateColumns: rightSideVisible ? "1.2fr 2fr 1fr" : "1.2fr 2fr" }}>
          <LeftSideBar></LeftSideBar>
          <ChatBox></ChatBox>
          {rightSideVisible && <RightSideBar />} {/* Render RightSideBar conditionally */}
        </div>
      }
      </div>
    </div>

  )
}

export default Chat