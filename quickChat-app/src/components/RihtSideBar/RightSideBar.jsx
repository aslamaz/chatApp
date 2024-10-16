import React, { useContext, useEffect, useState } from 'react'
import './RightSideBar.css'
import assets from '../../assets/assets/assets'
import { logout } from '../../config/firebase'
import { AppContext } from '../../context/AppContext'

const RightSideBar = () => {
  const { chatUser, messages,rightSideVisible,setRightSideVisible } = useContext(AppContext);
  const [msgImg, setmsgImg] = useState([]);

  useEffect(() => {
    let tempVar = [];
    messages.map((msg) => {
      if (msg.image) {
        tempVar.push(msg.image)
      }
    })
    setmsgImg(tempVar)
  }, [messages])
  return chatUser ? (
    <div className='Right-SideBar'>
      <div className='RightSideBarHeader'>
      <img src={assets.close_btn} alt="" className='closeBtn'onClick={()=>setRightSideVisible(false)}/>
      <div>Contact info</div>
      </div>
      <div className="rs-profile">
        <img src={chatUser.userData.avatar} alt="" />
        <h3>{chatUser.userData.name} {Date.now() - chatUser.userData.lastSeen <= 70000 ? <img className='dot' src={assets.green_dot} alt="" /> : null}</h3>

      </div>
      <div className='hrline'></div>
      <div className='About'>
        <div>About</div>
        <p>{chatUser.userData.bio}</p>
      </div>
      <div className='hrline'></div>
      <div className="rs-media">
        <p>Media</p>
        <div>
          {msgImg.map((url, index) => (
            <img key={index} src={url} alt="" onClick={() => window.open(url)} />
          ))}
          {/* <img src={assets.pic1} alt="" />
          <img src={assets.pic2} alt="" />
          <img src={assets.pic3} alt="" />
          <img src={assets.pic4} alt="" />
          <img src={assets.pic1} alt="" />
          <img src={assets.pic2} alt="" /> */}
        </div>
      </div>
      <button onClick={() => logout()}>Logout</button>
    </div>
  ) :
    (
      <div className='Right-SideBar'>
        <button onClick={() => logout()}>Logout</button>
      </div>
    )
}

export default RightSideBar