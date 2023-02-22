import React, { useState, useEffect, useContext } from 'react'
import '../styles/FillInPage.css'
import { useLocation } from 'react-router-dom'
import { db } from '../../firebase-config.js'
import { doc, collection, setDoc, getDoc, query, where, onSnapshot } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

//////路徑要改 不能依賴user

function FillInPage() {
  const [surveyData, setSurveyData] = useState([]);
  const [surveySetting, setSurveySetting] = useState([]);

  const [allAns, setAllAns] = useState([]);
  const [ansCount, setAnsCount] = useState();

  const navigate = useNavigate();

  const location = useLocation();
  // console.log(location);
  // console.log(location.pathname);
  let tmpAry = location.pathname.split("/");
  let shortUid = tmpAry[tmpAry.length - 2];
  let theSurvey = tmpAry[tmpAry.length - 1];

  useEffect(() => {

    const countAns = doc(db, "allUsers", "user_" + shortUid, "userSurveys", theSurvey, "Answers", "count");
    const data = getDoc(countAns)
      .then((data) => {
        setAnsCount(data.data().ansCount + 1);
      });


  }, []);


  useEffect(() => {
    async () => {
      let surveySetting = [];
      const getSetting = onSnapshot(
        collection(db, "allUsers", "user_" + shortUid, "userSurveys"), (snapshot) => {
          snapshot.forEach((doc) => {
            // console.log(doc.data().name);
            surveySetting.push({ ...doc.data(), id: doc.data().id, name: doc.data().name, serial: doc.data().serial, welcomeText: doc.data().welcomeText, showNum: doc.data().showNum });
          });
          setSurveySetting(surveySetting);
          console.log(surveySetting);
        });
      return getSetting;
    }
  }, []);


  useEffect(() => {
    // console.log("here");
    let questionsList = [];
    const showQues = onSnapshot(
      collection(db, "allUsers", "user_" + shortUid, "userSurveys", theSurvey, "Questions"), (snapshot) => {
        snapshot.forEach((doc) => {
          // console.log(doc);
          questionsList.push({ ...doc.data(), id: doc.data().id, type: doc.data().type, content: doc.data().content });
        });
        setSurveyData(questionsList);
        // console.log(questionsList);
      });
    return showQues;
  }, []);


  function AQue(props) {
    if (props.type == "A") {
      let aque =
        <div className='fillin_aque'>
          <div className='fillin_que'>{props.content}</div>
          <input type="text" className='fillin_ans' id={"ans" + props.id} placeholder={props.id} onChange={recordAns} />
        </div>
      return aque;
    }
  }



  const recordAns = (e) => {
    let id = e.target.id.replace("ans", "");
    let newAllAns = [];
    newAllAns = allAns;
    // newAllAns[id] = [id, e.target.value];
    newAllAns[id] = [e.target.value];
    setAllAns(newAllAns);
    // console.log(allAns);
  }

  const fillin = async () => {
    // console.log(allAns);
    // for (let i = 0; i < allAns.length; i++) {
    //   if (allAns[i] != undefined) {

    let allAnsObj = {};
    allAns.forEach((element, index) => {
      allAnsObj[index] = element;
    });
    const surveyAnswers = doc(db, "allUsers", "user_" + shortUid, "userSurveys", theSurvey, "Answers", "Ans" + ansCount);  //要改第幾張答案!!
    await setDoc(surveyAnswers,
      allAnsObj
      , { merge: true })
      .then(async () => {
        console.log("success");
        console.log(ansCount);
        const addCount = doc(db, "allUsers", "user_" + shortUid, "userSurveys", theSurvey, "Answers", "count");
        await setDoc(addCount,
          {
            ansCount: ansCount
          },
          { merge: true })
          .then(() => {
            //跳轉到感謝頁面
            navigate("/thanks/" + shortUid + "/" + theSurvey);
          });

      }).catch(() => { console.log("fail") });
    // }
    // }
  }

  return (
    <div id='fillinpage'>
      <Navbar />
      <div>{surveySetting.welcomeText}</div>
      <div id='fillinpage_questions'>
        {surveyData.map((que, index) => <AQue key={index} id={que.id} type={que.type} content={que.content} showNum={surveySetting.showNum} />)}
      </div>
      <button onClick={fillin} id='btn_fillin'>送出問卷</button>
    </div>
  )
}

export default FillInPage
