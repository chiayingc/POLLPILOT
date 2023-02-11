import React  from 'react'


// 帶入count(第幾題) 設定div id
function Question({ allQ, recordQue, done }) {

  let allQuestions = [];

  for (let i = 0; i < allQ.length; i++) {
    let id = i + 1;
    if (allQ[i] == "A") {
      let oneQue = <div id={"qus" + id} className={"qus"}>
                      <p id={"title"+id}> 題目標題</p>
                      <input id={"AqueContent"+id} className="qus_titleA" type="text" onChange={recordQue} />
                      <button id={"done"+id} onClick={done}>完成</button>
                    </div>
      allQuestions.push(oneQue);
    }
    if (allQ[i] == "B") {
      let oneQue = <div id={"qus" + id}>
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
