import React, {useState, useEffect, useContext} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import pplogo from '../assets/pp-logo-tmp_05.png'
import '../styles/Navbar.css'

import { auth } from '../../firebase-config.js'
import {onAuthStateChanged,
        signOut } from 'firebase/auth'
import { UserContext  } from '../helper/Context'


function Navbar() {
  const {user, setUser}=useContext(UserContext);
  // console.log(user);

  useEffect(()=>{
      onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
      });
  },[]);

  const signout=async()=>{
    await signOut(auth);
  }


  return (
    <div id='navbar'>
      <div id='nav_logo'> 
        <img src={pplogo} className="pplogo"/> 
      </div>
      {user?(
            <div id='nav_btns'>
              <button id='nav_btn_signout' onClick={signout}>登出</button>
            </div>
            )
             :(
              <div id='nav_btns'>
                <button id='nav_btn_signin'><Link to={"/signin"}>登入</Link></button>
                <button id='nav_btn_signup'><Link to={"/signup"}>註冊</Link></button>
              </div>
             )}

      
    </div>
  )
}

export default Navbar
