import React, { useContext, useEffect, useState } from 'react'
import './ChatBox.css'
import assets from '../../assets/assets/assets'
import { AppContext } from '../../context/AppContext'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { toast } from 'react-toastify'
import upload from '../../lib/upload'

const ChatBox = () => {
  const { userData, chatUser, messages, setMessages, messagesId,chatVisible,setChatVisible ,rightSideVisible,setRightSideVisible} = useContext(AppContext);

  const [input, setInput] = useState("");

  const sendMessage = async () => {
    try {
      if (input && messagesId) {
        await updateDoc(doc(db, 'messages', messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            text: input,
            createdAt: new Date()
          })
        })
        const userIDs = [chatUser.rId, userData.id];

        userIDs.forEach(async (id) => {
          const userChatsRef = doc(db, 'chats', id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data();
            const chatIndex = userChatData.chatsData.findIndex((c) => c.messageId === messagesId);
            userChatData.chatsData[chatIndex].lastMessage = input.slice(0, 30);
            userChatData.chatsData[chatIndex].updatedAt = Date.now();
            if (userChatData.chatsData[chatIndex].rId === userData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false;
            }
            await updateDoc(userChatsRef, {
              chatsData: userChatData.chatsData
            })
          }
        })
      }
    } catch (error) {
      toast.error(error.message)
      console.error(error);
    }
    setInput('');
  }

  const sendImage = async (e) => {
    try {
      const fileUrl = await upload(e.target.files[0]);
      if (fileUrl && messagesId) {
        await updateDoc(doc(db, 'messages', messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            image: fileUrl,
            createdAt: new Date()
          })
        })
        const userIDs = [chatUser.rId, userData.id];

        userIDs.forEach(async (id) => {
          const userChatsRef = doc(db, 'chats', id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data();
            const chatIndex = userChatData.chatsData.findIndex((c) => c.messageId === messagesId);
            userChatData.chatsData[chatIndex].lastMessage = "image";
            userChatData.chatsData[chatIndex].updatedAt = Date.now();
            if (userChatData.chatsData[chatIndex].rId === userData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false;
            }
            await updateDoc(userChatsRef, {
              chatsData: userChatData.chatsData
            })
          }
        })
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const covertTimeStamp = (timeStamp) => {
    let date = timeStamp.toDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    if (hour > 12) {
      return hour - 12 + ":" + minute + " PM";
    }
    else {
      return hour + ":" + minute + " AM";

    }
  }

  useEffect(() => {
    if (messagesId) {
      const unSub = onSnapshot(doc(db, 'messages', messagesId), (res) => {
        setMessages(res.data().messages.reverse())
        console.log(res.data().messages.reverse());

      })
      return () => {
        unSub();
      }
    }
  }, [messagesId])

  return chatUser ? (
    <div className={`Chat-Box ${chatVisible ? "" : "hidden"}`}>
      <div className="chat-user" onClick={()=>setRightSideVisible(true)}>
        <img src={chatUser.userData.avatar} alt="" />
        <p>{chatUser.userData.name} {Date.now()-chatUser.userData.lastSeen <= 70000 ? <img className='dot' src={assets.green_dot} alt="" /> : null} </p>
        <img src={assets.help_icon} alt="" className='help'/>
        <img src={assets.arrow_icon} alt="" className='arrow' onClick={()=>setChatVisible(false)}/>
      </div>

      <div className="chat-msg">

        {messages.map((msg, index) => (
          <div key={index} className={msg.sId === userData.id ? "s-msg" : "r-msg"}>
            {msg["image"]
              ? <img className='msg-img' src={msg.image} alt="" />
              : <p className='msg'>{msg.text}</p>
            }

            <div>
              <img src={msg.sId === userData.id ? userData.avatar : chatUser.userData.avatar} alt="" />
              <p>{covertTimeStamp(msg.createdAt)}</p>
            </div>
          </div>
        ))}


        {/* <div className='s-msg'>
          <img src={assets.pic1} alt="" className='msg-img' />
          <div>
            <img src={assets.profile_img} alt="" />
            <p>2:30 PM</p>
          </div>
        </div>

        <div className='r-msg'>
          <p className='msg'>Lorem ipsum is placeholder text commonly used in ..</p>
          <div>
            <img src={assets.profile_img} alt="" />
            <p>2:30 PM</p>
          </div>
        </div> */}
      </div>





      <div className="chat-input">
        <input type="text" placeholder='Send a message' onChange={(e) => setInput(e.target.value)} value={input} />
        <input type="file" id='image' accept='image/png, image/jpeg' hidden onChange={sendImage} className='sendimage'/>
        <label htmlFor='image'>
          <img src={assets.gallery_icon} alt="" />
          <div></div>
        </label>
        <img src={assets.send_button} alt="" onClick={sendMessage} style={{background:"#25d366",borderRadius:"50%",padding:"4px",width:"33px"}}/>
      </div>
    </div>
  )
    : <div className={`chat-Welcome ${chatVisible ? "" : "hidden"}`}>
      <img src={assets.chatbackimg} alt="" />
      <img src={assets.logo_icon} alt="" />
      
    </div>
}

export default ChatBox