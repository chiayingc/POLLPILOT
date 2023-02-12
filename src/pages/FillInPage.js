import React, { useState, useEffect, useContext } from 'react'
import '../styles/FillInPage.css'
import { useLocation } from 'react-router-dom'
import { auth, db } from '../../firebase-config.js'
import { doc, collection, setDoc,getDocs, query, where, onSnapshot } from 'firebase/firestore'
import { UserContext } from '../helper/Context'
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

//////路徑要改 不能依賴user

function FillInPage() {
  const { user, setUser } = useContext(UserContext);
  const [surveyData, setSurveyData] = useState([]);

  const [allAns, setAllAns] = useState([]);

  const navigate=useNavigate();

  const location = useLocation();
  console.log(location);
  console.log(location.pathname);
  let tmpAry = location.pathname.split("/");
  let theSurvey = tmpAry[tmpAry.length - 1];
  console.log(theSurvey);

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      console.log(user);
    });
  }, []);


  useEffect(() => {
    console.log("here");
    let questionsList = [];
    const showQues = onSnapshot(
      collection(db, "allUsers", "user_" + user.uid, "userSurveys", theSurvey, "Questions"), (snapshot) => {
        snapshot.forEach((doc) => {
          console.log(doc);
          questionsList.push({ ...doc.data(), id: doc.data().id, type: doc.data().type, content: doc.data().content });
        });
        setSurveyData(questionsList);
        console.log(questionsList);
      });
    return showQues;
  }, [user]);


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
    newAllAns[id] = [id, e.target.value];
    setAllAns(newAllAns);
    // console.log(allAns);
  }

  const fillin = async () => {
    // console.log(allAns);
    // for (let i = 0; i < allAns.length; i++) {
    //   if (allAns[i] != undefined) {
        let allAnsObj={};
        allAns.forEach((element, index) => {
          allAnsObj[index] = element;
        });
        const surveyAnswers = doc(db, "allUsers", "user_" + user.uid, "userSurveys", theSurvey, "Answers", "Ans2");  //要改第幾張答案!!
        await setDoc(surveyAnswers,
         allAnsObj 
        , { merge: true })
          .then(async () => {
            console.log("success");
            //跳轉到感謝頁面
            navigate("/thanks/"+theSurvey);
          }).catch(() => { console.log("fail") });
      // }
    // }
  }

  return (
    <div id='fillinpage'>
      <div id='fillinpage_questions'>
        {surveyData.map((que, index) => <AQue key={index} id={que.id} type={que.type} content={que.content} />)}
      </div>
      <button onClick={fillin} id='btn_fillin'>送出問卷</button>
    </div>
  )
}

export default FillInPage
