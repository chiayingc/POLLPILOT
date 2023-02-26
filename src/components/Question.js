import React  from 'react'


// 帶入count(第幾題) 設定div id
function Question({ allQ, recordQue, done }) {
  // function Question({ allQ }) {

  let allQuestions = [];

  for (let i = 0; i < allQ.length; i++) {
    let id = i + 1;
    if (allQ[i] == "A") {
      let oneQue = <div key={id} id={"qus" + id} className={"qus"}>
                      <p id={"title"+id}> 題目標題</p>
                      <input id={"AqueContent"+id} className="qus_titleA" type="text"/>
                      {/* <button id={"done"+id}>完成</button> */}
                      {/* <input id={"AqueContent"+id} className="qus_titleA" type="text" onChange={recordQue} /> */}
                      <button id={"Adone"+id} onClick={done}>完成</button>
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
