import React from 'react'
import '../styles/Question.css'

//帶入count(第幾題) 設定div id
function Question() {
  return (
    <div id="qus"> 
    {/* id要改 */}
        <input className="qus_title" type="text" placeholder="題目標題"/>
        <input type="text" />
    </div>
  )
}

export default Question
