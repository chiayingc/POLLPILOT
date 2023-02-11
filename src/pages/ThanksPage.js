import React, { useState, useEffect, useContext } from 'react'
import '../styles/ThanksPage.css'
import { useLocation } from 'react-router-dom'
import { auth, db } from '../../firebase-config.js'
import { doc, collection, setDoc, getDocs, getDoc, getString } from 'firebase/firestore'
import { UserContext } from '../helper/Context'
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'



//////路徑要改 不能依賴user

function ThanksPage() {
    const { user, setUser } = useContext(UserContext);

    const location = useLocation();
    let tmpAry = location.pathname.split("/");
    let theSurvey = tmpAry[tmpAry.length - 1];
    console.log(theSurvey);


    // useEffect(() => {
    //     onAuthStateChanged(auth, async (currentUser) => {
    //         setUser(currentUser);
    //         const survey = doc(db, "allUsers", "user_" + user.uid, "userSurveys", theSurvey);
    //         // await getDoc(survey).then((doc) => {
    //         //     console.log(doc);
    //             // console.log(user);
    //         // });  
            
    //     });
    //     }, []);



        // useEffect(() => {
        //     const test = async () => {
        //         console.log(db, "allUsers", "user_" + user.uid, "userSurveys", theSurvey);
        //         const survey = doc(db, "allUsers", "user_" + user.uid, "userSurveys", theSurvey);
        //         // const data = await getDoc(survey);
        //         // if (data.exists) {
        //         //     console.log(data);
        //         //     // console.log(data.data())
        //         // }
        //         await getDoc(survey).then((doc)=>{
        //             console.log(doc);
        //         });
        //     }
        //     test();
        // }, []);


        return (
            <div>
                <h2>問卷已送出，謝謝您的填寫!</h2>
            </div>
        )
    }

export default ThanksPage
