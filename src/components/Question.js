import { doc } from 'firebase/firestore';
import React from 'react'


// 帶入count(第幾題) 設定div id
function Question({ allQ, recordQue, done }) {
  // function Question({ allQ }) {

  let allQuestions = [];

  for (let i = 0; i < allQ.length; i++) {
    let id = i + 1;
    if (allQ[i] == "A") {
      let oneQue = <div key={id} id={"qus" + id} className="qus">
        {/* <p id={"title"+id} className="qus_titleA"> 題目標題</p> */}
        <input id={"AqueContent" + id} className="qus_titleA" type="text" placeholder='標題'
               onClick={()=>{document.querySelector("#Adone"+id).className="Adone"}} />
        <br />
        <input className="qus_title_inputA" type="text" readOnly />
        {/* <input id={"AqueContent"+id} className="qus_title_inputA" type="text"/> */}
        {/* <button id={"done"+id}>完成</button> */}
        {/* <input id={"AqueContent"+id} className="qus_titleA" type="text" onChange={recordQue} /> */}
        <br />
        <div className='done'>
          <button id={"Adone" + id} className="Adone" onClick={done}>完成</button>
        </div>
      </div>
      allQuestions.push(oneQue);
    }
    if (allQ[i] == "B") {
      let oneQue = <div key={id} id={"qus" + id}>
        <input className="qus_title" type="text" placeholder="題目" />
        <input type="text" />
      </div>
      allQuestions.push(oneQue);
    }
  }


  return (
    <div id='questions'>
      {allQuestions}
    </div>
  )
}

export default Question
