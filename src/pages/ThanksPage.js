import React, { useState, useEffect, useContext } from 'react'
import '../styles/ThanksPage.css'
import { useLocation } from 'react-router-dom'
import { auth, db } from '../../firebase-config.js'
import { doc, collection, setDoc, getDocs, getDoc, getString } from 'firebase/firestore'
import { UserContext } from '../helper/Context'
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import humaaans from '../assets/Humaaans.png'
import Navbar from '../components/Navbar'



//////路徑要改 不能依賴user

function ThanksPage() {
    const { user, setUser } = useContext(UserContext);
    const [thanksText, setThanksText]=useState("");

    const location = useLocation();
    let tmpAry = location.pathname.split("/");
    let theSurvey = tmpAry[tmpAry.length - 1];

    useEffect(()=>{
        onAuthStateChanged(auth, async(currentUser) => {
            setUser(currentUser);
            const survey = doc(db, "allUsers", "user_" + currentUser.uid, "userSurveys", theSurvey);
            const data=await getDoc(survey);
            const tmp=data.data();
            if(tmp.thanksText!=""){
                setThanksText(tmp.thanksText);
            }
            else{
                setThanksText("問卷已送出，感謝填寫！");
            }
            // console.log(tmp.thanksText);
        });
    },[]);

        return (
            <div id='thankspage'>
                <Navbar/>
                <img src={humaaans} />
                <h2>{thanksText}</h2>
                {/* <button onClick={close}>關閉</button> */}
            </div>
        )
    }

export default ThanksPage
