import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import pplogo from '../assets/pp-logo-tmp_05.png'
import '../styles/Navbar.css'

import { auth } from '../../firebase-config.js'
import {
  onAuthStateChanged,
  signOut
} from 'firebase/auth'
import { UserContext } from '../helper/Context'


function Navbar(props) {
  const { user, setUser } = useContext(UserContext);
  // console.log(user);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const signout = async () => {
    await signOut(auth);
  }
  const navigate = useNavigate();
  let result;

  if (props.type == 1) {

    result = <div id='navbar'>
      <div id='nav_logo'>
        <img src={pplogo} className="pplogo" onClick={() => { navigate("/dashboard") }} />
      </div>
      {user ? (
        <div id='nav_btns'>
          <button id='nav_btn_signout' onClick={signout}>登出</button>
        </div>
      )
        : (
          <div id='nav_btns'>
            <button id='nav_btn_signin'><Link to={"/signin"}>登入</Link></button>
            <button id='nav_btn_signup'><Link to={"/signup"}>註冊</Link></button>
          </div>
        )}
    </div>

  }

  if (props.type == 2) {

    result = <div id='navbar2'>
      {user ? (
        <div id='nav_btns'>
          <button id='nav_btn_signout' onClick={signout}>登出</button>
        </div>
      )
        : (
          <div id='nav_btns'>
            <button id='nav_btn_signin'><Link to={"/signin"}>登入</Link></button>
            <button id='nav_btn_signup'><Link to={"/signup"}>註冊</Link></button>
          </div>
        )}
    </div>

  }

  if (props.type == 3 || props.type==4) {

    result = <div id='navbar'>
      <div id='nav_logo'>
        <img src={pplogo} className="pplogo"  onClick={() => { props.type==3? navigate("/dashboard"):navigate("/") }} />
      </div>
    </div>
  }

  

  return result
}
export default Navbar
