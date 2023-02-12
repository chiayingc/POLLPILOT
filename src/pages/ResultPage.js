import React, { useState, useEffect, useContext } from 'react'
import '../styles/ResultPage.css'
import { useLocation } from 'react-router-dom'
import { auth, db } from '../../firebase-config.js'
import { doc, collection, setDoc,getDocs, query, where, onSnapshot } from 'firebase/firestore'
import { UserContext } from '../helper/Context'
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

function ResultPage() {
    const { user, setUser } = useContext(UserContext);
    const [resultData, setResultData]=useState([]);

    let tmpAry = location.pathname.split("/");
    let theSurvey = tmpAry[tmpAry.length - 1];

    useEffect(() => {
        onAuthStateChanged(auth, async (currentUser) => {
          setUser(currentUser);
        //   console.log(currentUser);
        });
      }, []);

      useEffect(() => {
        // console.log("here");
        let answersList = [];
        const showResult = onSnapshot(
          collection(db, "allUsers", "user_" + user.uid, "userSurveys", theSurvey, "Answers"), (snapshot) => {
            snapshot.forEach((doc) => {
            //   console.log(doc.data());
              answersList.push({ ...doc.data()});
            //   console.log(doc.data());
            //   console.log(answersList);
            });
            setResultData(answersList);
          });
        return showResult;
      }, [user]);

      function Ans(props) {
        /////這邊要大改喔
        
    // console.log(props.content);
          let ans =
            <div >
              {props.content[1][0]}_ {props.content[1][1]}
              <br/>
              {props.content[2][0]}_ {props.content[2][1]}
              <br/>
              {props.content[3][0]}_ {props.content[3][1]}
              <br/>
              {props.content[4][0]}_ {props.content[4][1]}
            </div>
          return ans;
        
      }
      

  return (
    <div id='resultpage'>
      <div id='resultpage_answer'>
        {resultData.map((ans, index) => <Ans key={index} content={ans}/>)}
      </div>
    </div>
  )
}

export default ResultPage
