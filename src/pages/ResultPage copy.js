import React, { useState, useEffect, useContext } from 'react'
import '../styles/ResultPage.css'
import { useLocation } from 'react-router-dom'
import { auth, db } from '../../firebase-config.js'
import { doc, collection, setDoc, getDocs, query, where, onSnapshot } from 'firebase/firestore'
import { UserContext } from '../helper/Context'
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Results from '../components/Results'

function ResultPage() {
  const { user, setUser } = useContext(UserContext);
  const [resultData, setResultData] = useState([]);
  const [shortUid, setShortUid] = useState("");
  const [queCount, setQueCount] = useState(0);
  const [eachResult, setEachResult]=useState([]);
  const [questionsType, setQuestionsType]=useState([]);
  const [surveyData, setSurveyData] = useState([]);

  let tmpAry = location.pathname.split("/");
  let theSurvey = tmpAry[tmpAry.length - 1];
  // console.log(theSurvey);
  // let questionsType=[];

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setShortUid(currentUser.uid.substring(0, 4));
    });
  }, []);

  //取得所有的問卷結果
  useEffect(() => {
    let answersList = [];
    const showResult = onSnapshot(
      collection(db, "allUsers", "user_" + shortUid, "userSurveys", theSurvey, "Answers"), (snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.id != "count") {
            answersList.push({ ...doc.data() });
          } else {
            setQueCount(doc.data().queCount);
            setQuestionsType(doc.data().queType);
          };
        });
        setResultData(answersList);
      });
    return showResult;
  }, [user]);

  //整理收到的問卷結果(分成每題的所有答案)
  useEffect(() => {
    let eachResult = [];
    for (let i = 0; i < resultData.length; i++) {
      for (let j = 1; j <= queCount; j++) {
        if (resultData[i] != undefined && resultData[i][j]!=undefined) { 
          if(eachResult[j]==undefined){
            eachResult[j]=[];
            eachResult[j].push(questionsType[j-1]);
          }
          eachResult[j].push(resultData[i][j]);
        }
      }
    }
    setEachResult(eachResult);
  }, [resultData]);

  //找出全部的題目
  useEffect(() => {
    // console.log("here");
    let questionsList = [];
    const showQues = onSnapshot(
      collection(db, "allUsers", "user_" + shortUid, "userSurveys", theSurvey, "Questions"), (snapshot) => {
        snapshot.forEach((doc) => {
          // console.log(doc.data());
          questionsList.push({ ...doc.data(), id: doc.data().id, type: doc.data().type, content: doc.data().content });
        });
        setSurveyData(questionsList);
        // console.log(questionsList);
      });
    return showQues;
  }, [user]);



  return (
    <div id='resultpage'>
      <Navbar />
      <div id='resultpage_answer'>

        <Results allResult={eachResult} allQuestions={surveyData}/>

      </div>
    </div>
  )
}

export default ResultPage
