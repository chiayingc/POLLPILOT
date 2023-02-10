import React, { useState, useEffect, useContext } from 'react'
import '../styles/FillInPage.css'
import { useLocation } from 'react-router-dom'
import { auth, db } from '../../firebase-config.js'
import { doc, collection, getDocs, query, where } from 'firebase/firestore'
import { UserContext  } from '../helper/Context'
import { onAuthStateChanged } from 'firebase/auth'


function FillInPage() {
    const {user, setUser}=useContext(UserContext);
    const [surveyData, setSurveyData]=useState({});

    const location=useLocation();
    let tmpAry=location.pathname.split("/");
    let theSurvey=tmpAry[tmpAry.length-1];
    // tmpAry=tmpStr.split("survey");
    // let theSurvey=tmpAry[0]+"survey"+tmpAry[tmpAry.length-1];



    useEffect(()=>{
        onAuthStateChanged(auth, async(currentUser) => {
            setUser(currentUser);
            
        });
    },[]);

    // let test=surveyData;
    // console.log(test);
    // console.log(surveyData.Questions);


    const testtest=async()=>{
        const userData=collection(db,"allUsers","user_"+user.uid,"userSurveys",theSurvey,"Questions");

            
            const data=await getDocs(userData);
            // setSurveyData(data.data());
            data.forEach((doc)=>{
                // console.log(doc.id, '=>', doc.data()['content']);
                console.log(doc.data());
            });
            // console.log(data);


    }


        
        




  return (
    <div onClick={testtest}>
      hfgkjhg
    </div>
  )
}

export default FillInPage
