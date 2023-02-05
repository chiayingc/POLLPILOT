import React, { useState, useEffect, useContext } from 'react'
import Navbar from '../components/Navbar'
import '../styles/AddQuesPage.css'

function AddQuesPage() {
  const [count, setCount]=useState(0); //紀錄第幾題
  
  return (
    <div id='addquespage'>
      {/* 要改成會員版nav */}
      <Navbar />
      <div id='addquespage_main'>
        <div id='addquespage_main_left'>

        </div>
        <div id='addquespage_main_right'>
          <h5>選擇題型</h5>
          <div id='ques_type'>
            <button>單行文字</button>
            <button>多行文字</button>
            <button>單選題</button>
            <button>多選題</button>
            <button>矩陣題</button>
            <button>數字題</button>
            <button>數字滑桿</button>
            <button>引言</button>
            <button>分類標題</button>
            <button>日期</button>
            <button>分隔線</button>
          </div>
          <div id='step_btn'>
            <button>＜問卷設定</button>
            <button>外觀設定＞</button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default AddQuesPage
