import React, { useState, useEffect } from 'react'
import '../styles/HomePage.css'
import home from '../assets/home.png'
import Navbar from '../components/Navbar'
import { auth } from '../../firebase-config.js'
import {
  onAuthStateChanged
} from 'firebase/auth'
import { Link } from 'react-router-dom'

function HomePage() {
  const [user, setUser] = useState({});
  const [url, setUrl] = useState("/signin");

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // console.log(user);
        setUrl("/dashboard");
      } else {
        // console.log(user);
        setUrl("/signin");
      }
    });
  }, []);

  return (
    <div id='homepage'>
      <Navbar />
      <div id='homepage_main'>
        <div id='homepage_main_left'>
          <h2>雲端問卷服務</h2>
          <p>ictum elit pulvinar.</p><p>Quisque vitae diam sesagaugue. </p>
          <button id='homepage_btn_start'>
            <Link to={url}>免費建立問卷</Link>
          </button>
        </div>
        <div id='homepage_main_right'>
          <img src={home} />
        </div>
      </div>

    </div>
    // <div id='homepage'>
    //   <Navbar />
    //   <div id='homepage_main'>
    //     <div id='homepage_main_left'>
    //       <h2>寶寶級的雲端問卷服務</h2>
    //       <p>目前僅止於問答</p><p>我努力創造更大的價值</p>
    //       <button id='homepage_btn_start'>
    //         <Link to={url}>免費建立問卷</Link>
    //       </button>
    //     </div>
    //     <div id='homepage_main_right'>
    //       <img src={home} />
    //     </div>
    //   </div>

    // </div>
  )
}

export default HomePage
