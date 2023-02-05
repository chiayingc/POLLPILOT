import React from 'react'
import Navbar from '../components/Navbar'
import '../styles/ReleasePage.css'

function ReleasePage() {
  return (
    <div id='releasepage'>
      <Navbar />
      <div id='releasepage_main'>
        <h2>問卷已經發布成功!</h2>
        <div id='releasepage_content'>
          <div>img + 分享你的問卷</div>
          <div>
            <span>https://.....</span><button>複製</button>
          </div>
          <div>QR code</div>
        </div>
      </div>
    </div>
  )
}

export default ReleasePage
