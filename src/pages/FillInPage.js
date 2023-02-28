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
  let newAllAns = {};
  const [surveyQues, setSurveyQues] = useState([]);  //記錄所有題目內容
  const [surveySettings, setSurveySettings] = useState([]);


  useEffect(() => {

    const getSetting = doc(db, "surveys", serial);
    getDoc(getSetting)
      .then(async (data) => {
        let version = data.data().version;
        let surveySetting = [version, data.data().Settings];
        const getQues = doc(db, "surveys", serial, "questions", "version" + version);
        await getDoc(getQues)
          .then((data) => {
            setSurveySettings(surveySetting);
            setSurveyQues(data.data().questions);
          });
      });
  }, []);

  function AQue(props) {
    let queData = props.quedata;

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
  }

  return (
    <div id='fillinpage'>
      <Navbar type={4} />
      <div className='fillin_questions'>
        {surveyQues.map((que, index) => <AQue key={index} quedata={que} />)}
      </div>
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
