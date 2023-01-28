import React from 'react'
import '../styles/AddNewPage.css'
import Navbar from '../components/Navbar.js'
import Question from '../components/Question';

function AddNewPage() {
    let count=0;  //記錄第幾題
  return (
    <div id='addnewpage'>
        <Navbar/>
        <div id='addnewpage_main'>
            <div id='addnewpage_addtitle'>
                <h3>設定問卷標題</h3>
                <input type="text" placeholder="問卷標題"/>
                <div>
                    <button>取消</button><button>完成</button>
                </div>
            </div>
            <div id='add_questions'>
                <h3>建立題目</h3>
                <button> + </button>
                <div id='all_questions'>
                    <Question/>
                </div>
            </div>
        </div>
    </div>
  )
}
import '../styles/AddNewPage.css'

export default AddNewPage
