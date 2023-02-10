import React  from 'react'


// 帶入count(第幾題) 設定div id
function Question({ allQ, recordQue, done }) {

  // const recordQue=(e)=>{
  //   console.log(e.target.id);
  // }



  let allQuestions = [];
  // console.log("allQ:", allQ);

  for (let i = 0; i < allQ.length; i++) {
    let id = i + 1;
    if (allQ[i] == "A") {
      let oneQue = <div id={"qus" + id} className={"qus"}>
                      <p id={"title"+id}> 題目標題</p>
                      {/* <input id={"title"+id} className="qus_title" type="text" placeholder="題目標題" readOnly/> */}
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
  // console.log(allQuestions);
  // setQuestions(allQuestions);



  return (
    <div id='questions'>
      {allQuestions}
    </div>


    // <div id={"qus"+Qid}> 
    // {/* id要改 */}
    //     <input className="qus_title" type="text" placeholder="題目標題"/>
    //     <input type="text" />
    // </div>
  )
}

export default Question
