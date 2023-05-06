import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ClosePage.css'

function ClosePage() {
    const navigate=useNavigate();
  return (
    <div id='closepage'>
      <h3 className='close_title'>問卷關閉中</h3>
      <button className='gohome' onClick={()=>{navigate("/");}}>回首頁</button>
    </div>
  )
}

export default ClosePage
