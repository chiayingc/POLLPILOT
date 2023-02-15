import React, { useState, useEffect, useContext } from 'react'
import Navbar from '../components/Navbar'
import '../styles/AddQuesPage.css'
import Question from '../components/Question.js'
import '../styles/Question.css'
import { UserContext } from '../helper/Context'
import { auth, db } from '../../firebase-config.js'
import { doc, collection, addDoc, setDoc, getDoc, arrayUnion } from 'firebase/firestore'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  onAuthStateChanged
} from 'firebase/auth'


function AddQuesPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const serial = state[0];  //這份問卷的編號
  const survey = state[1]; //問卷的id

  const { user, setUser } = useContext(UserContext);
  const [queCount, setQueCount] = useState(0); //紀錄第幾題(所有題目)

  // const [allAssayQue, setAllAssayQue]=useState([1,2,3,6]); //紀錄所有單選題
  // const [allMutiQue, setAllMutiQue]=useState([4,5]); //紀錄所有多選
  const [allQues, setAllQues] = useState([]); //紀錄所有題目題型
  const [allQuestions, setAllQuestions] = useState([]);  //記錄所有題目內容

  const [theQue, setTheQue] = useState([]);

  const [id, setId] = useState("");
  const [type, setType] = useState("");

  const [shortUid, setShortUid]=useState("");

  useEffect(()=>{
    onAuthStateChanged(auth, async(currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setShortUid(currentUser.uid.substring(0,4));
      }else {
        navigate("/signin");
      }
    });
},[]);


  const done = async (e) => {
    e.preventDefault();

    if (theQue[0] == "" || theQue[1] == "" || theQue[2] == "") {
      return;
    }
    let newAllQues = allQuestions;
    newAllQues[e.target.id.replace("done", "")] = theQue;
    setAllQuestions(newAllQues);

    setTheQue('');
    setId("");

  };

  const recordQue = (e) => {   //記錄題目內容(單行文字問答題)
    // console.log(e.target.id);
    setId(e.target.id.replace("AqueContent", ""));
    setType(e.target.id.substr(0, 1));
    setTheQue([id, type, e.target.value]);
  }


  const saveQues = async () => {
    let size = Object.keys(allQuestions).length;

    for (let i = 1; i <= size; i++) {
      const userSurveys = doc(db, "allUsers", "user_" + shortUid, "userSurveys", serial + "survey" + survey, "Questions", "Que" + allQuestions[i][0]);
      await setDoc(userSurveys, {
        id: allQuestions[i][0],
        type: allQuestions[i][1],
        content: allQuestions[i][2]
      }, { merge: true })
        .then(async () => {
          console.log("success");
          // navigate("/fillin/"+ serial + "survey" + survey);
          navigate("/release/"+ serial + "survey" + survey);
          //跳轉到發布頁面
        }).catch(() => { console.log("fail") });

    }
  }

  const addQue = (e) => {   //新增題目區塊
    let queAry = allQues;
    // console.log(e.target.value);
    if (e.target.value == "A") {  //設定題型 
      queAry[queCount] = "A";
    }
    else if (e.target.value == "B") {
      queAry[queCount] = "B";
    }
    setAllQues(queAry);
    setQueCount(queCount + 1);

  }

  return (
    <div id='addquespage'>
      {/* 要改成會員版nav */}
      <Navbar />
      <div id='addquespage_main'>
        <div id='addquespage_main_left'>
          <Question allQ={allQues} recordQue={recordQue} done={done} />
        </div>
        <div id='addquespage_main_right'>
          <h5>選擇題型</h5>
          <div id='ques_type'>
            <button onClick={addQue} value={"A"}>單行文字</button>
            <button onClick={addQue} value={"B"}>多行文字</button>
            <button>單選題</button>
            <button>多選題</button>
            <button>矩陣題</button>
            <button>數字題</button>
            <button>數字滑桿</button>
            <button>引言</button>
            <button>分類標題</button>
            <button>日期</button>
            <button>分隔線</button>
          </div>
          <div id='step_btn'>
            <button>＜問卷設定</button>
            <button onClick={saveQues}>外觀設定＞</button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default AddQuesPage
