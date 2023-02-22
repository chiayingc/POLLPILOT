import React from 'react'
import "../styles/Results.css"

function Results({allResult, allQuestions}) {
    
    let allContents=[]; //所有要呈現的內容(題目+答案)
    let key=0;


    for(let i=1; i<allResult.length; i++){
        // let type = allResult[i].shift(); //type 紀錄第i題的題型
        let type=allResult[i][0];

        let oneResult=[];
        let aResult=[];
        let theQue=allQuestions[i-1].content

        if(type=="A"){
            allContents.push(<div id={"que"+i} key={"que"+i} className="result_que_A">{theQue}------------</div>);
            for(let j=1; j<allResult[i].length; j++){ //第i題的所有回答
                let oneAns=<p id={"q"+i+"a"+j} key={"q"+i+"a"+j} className="result_oneans_A">{allResult[i][j][0]}</p>;    //因為是簡答題,取字串
                oneResult.push(oneAns);
            }

            aResult=<div id={"q"+i} key={"q"+i} className="result_oneque_A">
                    {oneResult}
                </div>
                allContents.push(aResult);
            key+=1;
        }

    }

  return (
    <div id="results_content">
      {allContents}
    </div>
  )
}

export default Results






// import React from 'react'

// function Results({ allResult, allQuestions }) {

//     let allContents = [];

//     if (allResult != '') {
//         //     // console.log("R", allResult);

//         for (let k = 1; k < allResult.length; k++) {
//             //         // console.log(allResult[k]);
//             let type = allResult[k].shift();

//             //         // console.log(type); //第k題題目類型
//             //         // console.log(allResult[k]); //第k題所有答案
//             let thisQue = []
//             if (type == "A") {

//                 for (let l = 0; l < allResult[k].length; l++) {
//                     //                 // console.log(k,l);
//                     // let tmp=<p id={k + "ans" + l}>{allResult[k][l][0]}</p>
//                     thisQue.push(allResult[k][l][0]);
//                 }
//                 //             // console.log(allQuestions[k-1].content); //每一題題目
//                 let oneResult =
//                     <div id={'result' + k}>
//                          <p id={"que" + k}>{allQuestions[k - 1].content}</p>
//                          <br />
//                         <div id={"anws" + k}>
//                          {thisQue}
//                         </div>
//                     </div>
//                 allContents.push(oneResult);
//             }
//         }
//     }



//     return (
//         <div>sdakfjs;adf
//             {allResult}
//         </div>
//     )
// }

// export default Results

