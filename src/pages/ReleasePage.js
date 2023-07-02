import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import '../styles/ReleasePage.css'
import { useLocation } from 'react-router-dom'
import { auth } from '../../firebase-config.js'
import {
  onAuthStateChanged,
} from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import link from '../assets/link.png'
import Swal from 'sweetalert2'

function ReleasePage() {
  const navigate = useNavigate();
  const location = useLocation();
  let tmpAry = location.pathname.split("/");
  let serial = tmpAry[tmpAry.length - 1];

  useEffect(()=>{
    onAuthStateChanged(auth, async(currentUser) => {
      if (currentUser) {
        //
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
      Swal.fire({
        icon: 'success',
        title: '複製成功！',
        timer: 1500,
        timerProgressBar: true,
      });
    }
    else{
      //
    }
    window.getSelection().removeAllRanges();    
  }

  const openLink=()=>{
    window.open("https://pollpilot-1c440.web.app/fillin/"+serial);
  }

  return (
    <div id='releasepage'>
      <Navbar type={1} />
      <div id='releasepage_main'>
        <h3>問卷已經發布成功 !</h3>
        <div id='releasepage_content'>
          <div className='releacepage_secondtitle'>
            <img src={link} onClick={copyUrl}/>
            <p>分享你的問卷</p>
          </div>
          <div className='releacepage_copylink'>
            <span id="url" onClick={openLink}>{"https://pollpilot-1c440.web.app/fillin/"+serial}</span>
            <button className='copylink' onClick={copyUrl}>複製</button>
          </div>
          <br/>
        </div>
      </div>
    </div>
  )
}

export default ReleasePage
