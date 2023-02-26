import React, { useState, useEffect, useContext } from 'react'
import '../styles/FillInPage.css'
import { useLocation } from 'react-router-dom'
import { db } from '../../firebase-config.js'
import { doc, collection, setDoc, getDoc, query, where, onSnapshot } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

//////路徑要改 不能依賴user

function FillInPage() {

  const navigate = useNavigate();
  const location = useLocation();
  let tmpAry = location.pathname.split("/");
  let serial = tmpAry[tmpAry.length - 1];
  console.log(serial);
  // let newAllAns = [];
  let newAllAns = {};
  // const [allAns, setAllAns] = useState([]);
  const [surveyQues, setSurveyQues] = useState([]);  //記錄所有題目內容
  const [surveySettings, setSurveySettings] = useState([]);

  // let surveySetting;
  // let surveyData = [];
  // let version;


  // const [ansCount, setAnsCount] = useState();
  // console.log(location);
  // console.log(location.pathname);

  // let shortUid = tmpAry[tmpAry.length - 2];



  useEffect(() => {

    const getSetting = doc(db, "surveys", serial);
    getDoc(getSetting)
      .then(async (data) => {
        console.log(data.data());
        let version = data.data().version;
        let surveySetting = [version, data.data().Settings];
        // setSurveySettings([version, data.data().Settings]);

        let questionsList = [];
        const getQues = doc(db, "surveys", serial, "questions", "version" + version);
        await getDoc(getQues)
          .then((data) => {
            console.log(data.data().questions)
            setSurveySettings(surveySetting);
            setSurveyQues(data.data().questions);
          });
      });

    // console.log(surveySettings);
    // let questionsList = [];
    // const getQues=doc(db, "surveys", serial, "questions", "version"+version);
    // const getQues = onSnapshot(
    //     collection(db, "surveys", serial, "questions"), (snapshot) => {
    //       snapshot.forEach((doc) => {
    //         // console.log(doc);
    //         questionsList.push({ ...doc.data(), id: doc.data().id, type: doc.data().type, content: doc.data().content });
    //       });
    //       setSurveyData(questionsList);
    //       // console.log(questionsList);
    //     });
    // return showQues;




    // const countAns = doc(db, "allUsers", "user_" + shortUid, "userSurveys", theSurvey, "Answers", "count");
    // const data = getDoc(countAns)
    //   .then((data) => {
    //     setAnsCount(data.data().ansCount + 1);
    //   });


  }, []);


  // useEffect(() => {
  // async () => {
  // let surveySetting = [];
  // const getSetting = onSnapshot(
  //   collection(db, "allUsers", "user_" + shortUid, "userSurveys"), (snapshot) => {
  //     snapshot.forEach((doc) => {
  //       // console.log(doc.data().name);
  //       surveySetting.push({ ...doc.data(), id: doc.data().id, name: doc.data().name, serial: doc.data().serial, welcomeText: doc.data().welcomeText, showNum: doc.data().showNum });
  //     });
  //     setSurveySetting(surveySetting);
  //     console.log(surveySetting);
  //   });
  // return getSetting;
  // }
  // }, []);


  // useEffect(() => {
  // console.log("here");
  // let questionsList = [];
  // const showQues = onSnapshot(
  //   collection(db, "allUsers", "user_" + shortUid, "userSurveys", theSurvey, "Questions"), (snapshot) => {
  //     snapshot.forEach((doc) => {
  //       // console.log(doc);
  //       questionsList.push({ ...doc.data(), id: doc.data().id, type: doc.data().type, content: doc.data().content });
  //     });
  //     setSurveyData(questionsList);
  //     // console.log(questionsList);
  //   });
  // return showQues;
  // }, []);


  function AQue(props) {
    // console.log(props);
    let queData = props.quedata;
    // console.log(queData);

    if (queData.type == "A") {
      let aque =
        <div className='fillin_aque'>
          <div className='fillin_que'>{queData.content}</div>
          <input type="text" className='fillin_ans' id={"ans" + queData.queSerial} placeholder={queData.serial} onChange={recordAns} />
        </div>
      return aque;
    }
  }



  const recordAns = (e) => {
    let ansSerial = e.target.id.replace("ans", "");
    // console.log(id);

    // newAllAns = allAns;
    // // newAllAns[id] = [id, e.target.value];
    //這邊要增加條件 看有沒有是必填題
    //沒填答案的話要不要給空值

    // newAllAns[ansSerial] = {
    //   queSerial: ansSerial,
    //   value: e.target.value
    // };
    newAllAns[ansSerial] = {
      [ansSerial]: e.target.value
    };

    // newAllAns[ansSerial] = [e.target.value];
    // newAllAns[ansSerial] = e.target.value;

    // setAllAns(newAllAns);
    // // console.log(allAns);
  }

  const fillin = async () => {
    let serials = [];
    // let tmpAllAns=[];
    let tmpAllAns = {};
    for (let i = 0; i < surveyQues.length; i++) {
      serials.push(surveyQues[i].queSerial);
      let tmp = tmpAllAns;
      tmpAllAns = {
        ...tmp,
        ...newAllAns[serials[i]]
      }
      // tmpAllAns.push(newAllAns[serials[i]]);
    }

    let answerSerial = Math.random().toString(36).slice(2, 8) + Date.now().toString(36); //答案編號
    // const setAnswer=doc(db, "surveys", serial, "answers", answerSerial);
    const setAnswer = doc(db, "answers", answerSerial);
    await setDoc(setAnswer,
      {
        surveySerial: serial,
        answer: tmpAllAns
      }
      , { merge: true })
      .then(() => {
        console.log("success");
        navigate("/thanks/" + serial);
      }).catch(() => { console.log("fail") });


    // let len = surveyQues.length;
    // let keys = [];
    // for (let i = 0; i < len; i++) {

    // keys.push(surveyQues[i].queSerial);
    // }


    // console.log(allAns);
    // for (let i = 0; i < allAns.length; i++) {
    //   if (allAns[i] != undefined) {

    // let allAnsObj = {};
    // allAns.forEach((element, index) => {
    //   allAnsObj[index] = element;
    // });
    // const surveyAnswers = doc(db, "allUsers", "user_" + shortUid, "userSurveys", theSurvey, "Answers", "Ans" + ansCount);  //要改第幾張答案!!
    // await setDoc(surveyAnswers,
    //   allAnsObj
    //   , { merge: true })
    //   .then(async () => {
    //     console.log("success");
    //     console.log(ansCount);
    //     const addCount = doc(db, "allUsers", "user_" + shortUid, "userSurveys", theSurvey, "Answers", "count");
    //     await setDoc(addCount,
    //       {
    //         ansCount: ansCount
    //       },
    //       { merge: true })
    //       .then(() => {
    //         //跳轉到感謝頁面
    //         navigate("/thanks/" + shortUid + "/" + theSurvey);
    //       });

    //   }).catch(() => { console.log("fail") });
    // // }
    // // }
  }

  return (
    <div id='fillinpage'>
      <Navbar />

      {surveyQues.map((que, index) => <AQue key={index} quedata={que} />)}
      <button onClick={fillin} id='btn_fillin'>送出問卷</button>

      {/* <div>{surveySetting.welcomeText}</div>
      <div id='fillinpage_questions'>
        {surveyData.map((que, index) => <AQue key={index} id={que.id} type={que.type} content={que.content} showNum={surveySetting.showNum} />)}
      </div>
      <button onClick={fillin} id='btn_fillin'>送出問卷</button> */}
    </div>
  )
}

export default FillInPage
