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
        queSerials = Object.keys(allAnswers[0]);
        allAns = [];
        allAnswers.forEach((obj) => {
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
                  if (allQuestions[i].type == "A") {
                    oneResult=[];
                    allContents.push(<div id={"que" + i} key={"que" + i} className="result_que_A">{allQuestions[i].content}------------</div>);
                    for (let j = 0; j < allAns[allQuestions[i].queSerial].length; j++) { //第i題的所有回答
                      let oneAns = <p id={"q" + i + "a" + j} key={"q" + i + "a" + j} className="result_oneans_A">{allAns[allQuestions[i].queSerial][j]}</p>;    //因為是簡答題,取字串
                      oneResult.push(oneAns);
                    }

                    aResult = <div id={"q" + i} key={"q" + i} className="result_oneque_A">
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
      <Navbar type={1}/>
      <div id='resultpage_content'>
        {resultFinal}
      </div>
    </div>
  )
}

export default ResultPage
