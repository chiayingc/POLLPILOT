import React, { useState, useEffect, useContext } from 'react'
import '../styles/FillInPage.css'
import { useLocation } from 'react-router-dom'
import { auth, db } from '../../firebase-config.js'
import { doc, collection, setDoc,getDocs, query, where, onSnapshot } from 'firebase/firestore'
import { UserContext } from '../helper/Context'
import { onAuthStateChanged } from 'firebase/auth'









function FillInPage() {
  const { user, setUser } = useContext(UserContext);
  const [surveyData, setSurveyData] = useState([]);

  const [ansID, setAnsID] = useState(1);
  const [theAns, setTheAns] = useState([]);
  const [allAns, setAllAns] = useState([]);


  const location = useLocation();
  let tmpAry = location.pathname.split("/");
  let theSurvey = tmpAry[tmpAry.length - 1];

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  let questionsList = [];
  useEffect(() => {
    const showQues = onSnapshot(
      collection(db, "allUsers", "user_" + user.uid, "userSurveys", theSurvey, "Questions"), (snapshot) => {
        snapshot.forEach((doc) => {
          questionsList.push({ ...doc.data(), id: doc.data().id, type: doc.data().type, content: doc.data().content });
        });
        setSurveyData(questionsList);
      });
    return showQues;
  }, [user]);


  function AQue(props) {
    if (props.type == "A") {
      let aque =
        <div>
          <div>{props.content}</div>
          <input type="text" id={"ans" + props.id} placeholder={props.id} onChange={recordAns} />
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

  const test = async () => {
    // console.log(allAns);
    // for (let i = 0; i < allAns.length; i++) {
    //   if (allAns[i] != undefined) {
        let allAnsObj={};
        allAns.forEach((element, index) => {
          allAnsObj[index] = element;
        });
        const surveyAnswers = doc(db, "allUsers", "user_" + user.uid, "userSurveys", theSurvey, "Answers", "Ans1");  //要改第幾張答案!!
        await setDoc(surveyAnswers,
         allAnsObj 
        , { merge: true })
          .then(async () => {
            console.log("success");
            //跳轉到發布頁面
          }).catch(() => { console.log("fail") });
      // }
    // }
  }















  return (
    <div>
      <div>
        {surveyData.map((que, index) => <AQue key={index} id={que.id} type={que.type} content={que.content} />)}
      </div>
      <div onClick={test}>idsahgidsakjg</div>
    </div>
  )
}

export default FillInPage
