import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../helper/Context'
import Navbar from '../components/Navbar'
import '../styles/ReleasePage.css'
import { useLocation } from 'react-router-dom'
import { auth, db } from '../../firebase-config.js'
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

function ReleasePage() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [shortUid, setShortUid]=useState("");

  const location = useLocation();
  let tmpAry = location.pathname.split("/");
  let theSurvey = tmpAry[tmpAry.length - 1];

  useEffect(()=>{
    onAuthStateChanged(auth, async(currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setShortUid(currentUser.uid.substring(0,4));
      }else {
        navigate("/signin");
      }
    });
},[]);

  const copyUrl=()=>{
    let copyDOM=document.querySelector("#url");
    let range=document.createRange();
    window.getSelection().removeAllRanges();
    range.selectNode(copyDOM);
    window.getSelection().addRange(range);
    let successful =document.execCommand('copy');

    if(successful){
      alert("複製成功！");
    }
    else{
      alert("fail");
    }
    window.getSelection().removeAllRanges();    
  }

  return (
    <div id='releasepage'>
      <Navbar />
      <div id='releasepage_main'>
        <h2>問卷已經發布成功!</h2>
        <div id='releasepage_content'>
          <div>img + 分享你的問卷</div>
          <div>
            <span id="url">{"https://pollpilot-1c440.web.app/fillin/"+shortUid+"/"+theSurvey}</span>
            <button onClick={copyUrl}>複製</button>
          </div>
          <div>QR code</div>
        </div>
      </div>
    </div>
  )
}

export default ReleasePage
