import React, { useState, useEffect, useContext } from 'react'
import '../styles/ResultPage.css'
import { UserContext } from '../helper/Context'
import { auth, db } from '../../firebase-config.js'
import { doc, collection, addDoc, setDoc, getDoc, arrayUnion, onSnapshot, query, where } from 'firebase/firestore'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  onAuthStateChanged
} from 'firebase/auth'


function ResultPage() {
  // const { user, setUser } = useContext(UserContext);
  // const [shortUid, setShortUid] = useState("");
  // const [questionList, setQuestionList] = useState([]);
  // const [answersList, setAnswersList] = useState([]);
  // const [eachResult, setEachResult] = useState([]);
  const [allAnswers, setAllAnswers] = useState([]);
  const [resultFinal, setResultFinal] = useState([]);

  let queSerials = [];  //紀錄所有題目編號
  let allAns = []; //紀錄整理各題所有答案
  // let answer = {};


  let tmpAry = location.pathname.split("/");
  let serial = tmpAry[tmpAry.length - 1];

  useEffect(() => {
    console.log(serial);

    const answers = collection(db, "answers");
    const select = query(answers, where("surveySerial", "==", serial));
    // console.log(select);
    let tmpAry = [];

    onSnapshot(select, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        tmpAry.push(data.answer);
      });
      setAllAnswers(tmpAry);
    });


  }, []);

  if (allAnswers[0] != undefined && allAnswers[0] != null) {
    queSerials = Object.keys(allAnswers[0]);
  }

  allAnswers.forEach((obj) => {
    for (let j = 0; j < queSerials.length; j++) {
      if (allAns[queSerials[j]] == undefined) { allAns[queSerials[j]] = [] }
      allAns[queSerials[j]].push(obj[queSerials[j]]);
    }
  });


  console.log(allAns);
  // for(let i=0; i<allAnswers.length; i++){
  //  for(let j=0; j<queSerials.length; j++){
  //     if(allAns[queSerials[j]]==undefined){allAns[queSerials[j]]=[]}

  //   }
  // }
  // console.log(allAns);






  // const allSurAn= onSnapshot(
  //   getDocs(select), (snapshot) => {
  //         snapshot.forEach((doc) => {
  //           console.log(doc);
  //           // questionsList.push({ ...doc.data(), id: doc.data().id, type: doc.data().type, content: doc.data().content });
  //         });
  //       });

  // const getQues = onSnapshot(
  //     collection(db, "surveys", serial, "questions"), (snapshot) => {
  //       snapshot.forEach((doc) => {
  //         // console.log(doc);
  //         questionsList.push({ ...doc.data(), id: doc.data().id, type: doc.data().type, content: doc.data().content });
  //       });





  // let questionsList = [];
  // let answersList = [];
  // let eachRes = [];
  // let queCount;
  // let questionsType = [];

  // onAuthStateChanged(auth, async (currentUser) => {
  //   setUser(currentUser);
  //   setShortUid(currentUser.uid.substring(0, 4));

  //   //取得所有題目
  //   onSnapshot(
  //     collection(db, "allUsers", "user_" + currentUser.uid.substring(0, 4), "userSurveys", theSurvey, "Questions"),
  //     (snapshot) => {
  //       snapshot.forEach((doc) => {
  //         questionsList.push({ ...doc.data() });
  //       });
  //       setQuestionList(questionsList);
  //     });

  //   //取得所有填答
  //   onSnapshot(
  //     collection(db, "allUsers", "user_" + currentUser.uid.substring(0, 4), "userSurveys", theSurvey, "Answers"), (snapshot) => {
  //       snapshot.forEach((doc) => {
  //         if (doc.id != "count") {
  //           answersList.push({ ...doc.data() });
  //         } else {
  //           queCount = doc.data().queCount;
  //           questionsType = doc.data().queType;
  //         };
  //       });
  //       setAnswersList(answersList);

  //       if (answersList != '') {
  //         for (let i = 0; i < answersList.length; i++) {
  //           for (let j = 1; j <= queCount; j++) {
  //             if (answersList[i] != undefined && answersList[i][j] != undefined) {
  //               if (eachRes[j] == undefined) {
  //                 eachRes[j] = [];
  //                 eachRes[j].push(questionsType[j - 1]);
  //               }
  //               eachRes[j].push(answersList[i][j]);
  //             }
  //           }
  //         }
  //         setEachResult(eachRes);
  //       }
  //     });
  // });
  // }, []);



  // useEffect(() => {
  //   let allContents = []; //所有要呈現的內容(題目+答案)
  //   let key = 0;
  //   if (eachResult != '') {

  //     for (let i = 1; i < eachResult.length; i++) {
  //       let type = eachResult[i][0];
  //       let oneResult = [];
  //       let aResult = [];
  //       let theQue = questionList[i - 1].content

  //       if (type == "A") {
  //         allContents.push(<div id={"que" + i} key={"que" + i} className="result_que_A">{theQue}------------</div>);
  //         for (let j = 1; j < eachResult[i].length; j++) { //第i題的所有回答
  //           let oneAns = <p id={"q" + i + "a" + j} key={"q" + i + "a" + j} className="result_oneans_A">{eachResult[i][j][0]}</p>;    //因為是簡答題,取字串
  //           oneResult.push(oneAns);
  //         }

  //         aResult = <div id={"q" + i} key={"q" + i} className="result_oneque_A">
  //           {oneResult}
  //         </div>
  //         allContents.push(aResult);
  //         key += 1;
  //       }
  //     }
  //   }

  //   setResultFinal(allContents);

  // }, [eachResult]);



  return (
    <div id='resultpage'>
      <div id='resultpage_content'>
        {resultFinal}
      </div>
    </div>
  )
}

export default ResultPage
