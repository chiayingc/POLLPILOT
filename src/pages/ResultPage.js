import React, { useState, useEffect, useContext } from 'react'
import '../styles/ResultPage.css'
import { UserContext } from '../helper/Context'
import { auth, db } from '../../firebase-config.js'
import { doc, collection, addDoc, setDoc, getDoc, arrayUnion, onSnapshot, query, where } from 'firebase/firestore'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import {
  onAuthStateChanged
} from 'firebase/auth'


function ResultPage() {
  // const { user, setUser } = useContext(UserContext);
  // const [shortUid, setShortUid] = useState("");
  // const [questionList, setQuestionList] = useState([]);
  // const [answersList, setAnswersList] = useState([]);
  // const [eachResult, setEachResult] = useState([]);
  // const [allAnswers, setAllAnswers] = useState([]);
  let allAnswers = [];
  const [resultFinal, setResultFinal] = useState([]);

  let queSerials = [];  //紀錄所有題目編號
  let allAns = []; //紀錄整理各題所有答案
  let version;
  let allQuestions = [];
  // let answer = {};

  let queTypes = {}; //紀錄所有題目題型
  // let settings=


  let tmpAry = location.pathname.split("/");
  let serial = tmpAry[tmpAry.length - 1];

  useEffect(() => {

    const answers = collection(db, "answers");
    const select = query(answers, where("surveySerial", "==", serial));

    onSnapshot(select, (querySnapshot) => {
      allAnswers = [];
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        allAnswers.push(data.answer);

      });
      if (allAnswers[0] != undefined && allAnswers[0] != null) {
        console.log(allAnswers);
        // let tmp=allAnswers.filter(ele => ele !== {});
        // console.log(tmp);
  //03.06這邊要改 如果答案裡面有空值的要排除//
        queSerials = Object.keys(allAnswers[1]);   
        console.log(queSerials);
        allAns = [];
        allAnswers.forEach((obj) => {
          console.log(obj);
          for (let j = 0; j < queSerials.length; j++) {
            if (allAns[queSerials[j]] == undefined) { allAns[queSerials[j]] = [] }
            allAns[queSerials[j]].push(obj[queSerials[j]]);
          }
        });

        const getVersion = doc(db, "surveys", serial);
        getDoc(getVersion)
          .then((data) => {

            version = data.data().version;
            queTypes = data.data().questionsType;

            const getQuestions = doc(db, "surveys", serial, "questions", "version" + version);
            getDoc(getQuestions)
              .then((data) => {
                allQuestions = data.data().questions;
                // console.log(allQuestions);

                let allContents = [];
                let oneResult = [];
                let key = 1;
                let aResult = [];
                // console.log(allAns);

                for (let i = 0; i < allQuestions.length; i++) {
    //03.06 這邊要修改, B的回答是textarea 要再改
                  if (allQuestions[i].type == "A" || allQuestions[i].type == "B" ) {
                    oneResult = [];
                    // allContents.push(<div id={"que" + i} key={"que" + i} className="result_que_A">{allQuestions[i].content}------------</div>);
                    for (let j = 0; j < allAns[allQuestions[i].queSerial].length; j++) { //第i題的所有回答
                      let oneAns = <p id={"q" + i + "a" + j} key={"q" + i + "a" + j} className="result_oneans_A">{allAns[allQuestions[i].queSerial][j]}</p>;    //因為是簡答題,取字串
                      oneResult.push(oneAns);
                    }

                    aResult = <div id={"q" + i} key={"q" + i} className="result_oneque_A">
                      {/* 題號(要再看是否修改) */}
                      <h4>{i+1}</h4>  
                      <div id={"que" + i} key={"que" + i} className="result_que_A">{allQuestions[i].content}</div>
                      {oneResult}
                    </div>
                    allContents.push(aResult);
                    key += 1;
                  }
                  if (allQuestions[i].type == "C") {
                    oneResult = [];
                    // allContents.push(<div id={"que" + i} key={"que" + i} className="result_que_A">{allQuestions[i].content}------------</div>);
                  //這題的所有選項
                    // let thealloptions=allQuestions[i].options;
let count=new Array(allQuestions[i].options.length).fill(0);                  
                    for (let j = 0; j < allAns[allQuestions[i].queSerial].length; j++) { //第i題的所有回答
                  //這裡要改成計數    

/////////////////////////////////////////////這個範圍內都要改掉///////////////////

for(let k=0; k<allQuestions[i].options.length; k++){
  // console.log(allAns[allQuestions[i].queSerial][j]);
  if(allAns[allQuestions[i].queSerial][j]==k){
    count[k]+=1;
    // console.log(allQuestions[i].options[allAns[allQuestions[i].queSerial][j]]);
  }
}

/////////////////////////////////////////////這個範圍內都要改掉///////////////////

        
                      // let oneAns = <p id={"q" + i + "a" + j} key={"q" + i + "a" + j} className="result_oneans_A">{allAns[allQuestions[i].queSerial][j]]}</p>;   
                      let oneAns = <p id={"q" + i + "a" + j} key={"q" + i + "a" + j} className="result_oneans_A">{allQuestions[i].options[allAns[allQuestions[i].queSerial][j]]}</p>; 
                      oneResult.push(oneAns);
                    }
console.log(count);
                    aResult = <div id={"q" + i} key={"q" + i} className="result_oneque_A">
                      {/* 題號(要再看是否修改) */}
                      <h4>{i+1}</h4>  
                      <div id={"que" + i} key={"que" + i} className="result_que_A">{allQuestions[i].content}</div>
                      {oneResult}
                    </div>
                    allContents.push(aResult);
                    key += 1;
                  }
                }
                setResultFinal(allContents);
              });
          })
          .catch(() => {
            console.log("fail");
          });
      }

    });

  }, []);


  return (
    <div id='resultpage'>
      <Navbar type={1} />
      <div id='resultpage_content'>
        {resultFinal}
      </div>
    </div>
  )
}

export default ResultPage
