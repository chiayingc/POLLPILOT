import React from 'react'
import { Link } from 'react-router-dom'
import pplogo from '../assets/pp-logo-tmp_05.png'
import '../styles/Navbar.css'

function Navbar() {
  return (
    <div id='navbar'>
      <div id='nav_logo'> 
        <img src={pplogo} className="pplogo"/> 
      </div>
      <div id='nav_btns'>
        <button id='nav_btn_signin'><Link to={"/signin"}>登入</Link></button>
        <button id='nav_btn_signup'><Link to={"/signup"}>註冊</Link></button>
      </div>
    </div>
  )
}

export default Navbar
