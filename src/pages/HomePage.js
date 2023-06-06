import React, { useState, useEffect } from 'react'
import '../styles/HomePage.css'
import pplogo from '../assets/pp-logo.png'
import homepage_bk1 from '../assets/homepage_bk1.svg'
import homepage_bk2 from '../assets/homepage_bk2.svg'
import homepage_bk3 from '../assets/homepage_bk3.svg'
import homepage_bk4 from '../assets/homepage_bk4.svg'
import Navbar from '../components/Navbar'
import { auth } from '../../firebase-config.js'
import {
  onAuthStateChanged
} from 'firebase/auth'
import { Link } from 'react-router-dom'

function HomePage() {
  // const [user, setUser] = useState({});
  const [url, setUrl] = useState("/signin");

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      // setUser(currentUser);
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
      <Navbar type={2} />
      <iframe className='home_bk1' src={homepage_bk1}></iframe>
      <iframe className='home_bk2' src={homepage_bk2}></iframe>
      <iframe className='home_bk3' src={homepage_bk3}></iframe>
      <iframe className='home_bk4' src={homepage_bk4}></iframe>
      <div id='homepage_main'>
        <div id='homepage_main_left'>
          <img src={pplogo} className='logo'/>
          <p>雲端問卷服務</p><p>Quisque vitae diam sesagaugue. </p>
          <button id='homepage_btn_start'>
            <Link to={url}>免費建立問卷</Link>
          </button>
        </div>
        {/* <div id='homepage_main_right'> */}
          
        {/* </div> */}
      </div>
    </div>
  )
}

export default HomePage
