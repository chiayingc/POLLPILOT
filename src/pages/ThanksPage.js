import React, { useState, useEffect } from 'react'
import '../styles/ThanksPage.css'
import { useLocation } from 'react-router-dom'
import { auth, db } from '../../firebase-config.js'
import { doc, collection, setDoc, getDocs, getDoc, getString } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import humaaans from '../assets/Humaaans.png'
import Navbar from '../components/Navbar'



//////路徑要改 不能依賴user

function ThanksPage() {
    const [thanksText, setThanksText] = useState("");

    const location = useLocation();
    let tmpAry = location.pathname.split("/");
    // let shortUid = tmpAry[tmpAry.length - 2];
    let serial = tmpAry[tmpAry.length - 1];
    // console.log(shortUid);
    // console.log(theSurvey);

    useEffect(() => {
        const getSetting = doc(db, "surveys", serial);
        getDoc(getSetting)
            .then(async (data) => {
                // console.log(data.data());
                setThanksText(data.data().Settings.thanksText);
                // let version = data.data().version;
                // let surveySetting = [version, data.data().Settings];
            }).catch((error) => {
                        console.log(error);
                    });

                // const survey = doc(db, "allUsers", "user_" + shortUid, "userSurveys", theSurvey);
                // const data = getDoc(survey)
                //     .then((data) => {
                //         const tmp = data.data();
                //         if (tmp.thanksText != "") {
                //             setThanksText(tmp.thanksText);
                //         }
                //         else {
                //             setThanksText("問卷已送出，感謝填寫！");
                //         }
                //     })
                //     .catch((error) => {
                //         console.log(error);
                //     });



            }, []);

        return (
            <div id='thankspage'>
                <Navbar type={4}/>
                <img src={humaaans} />
                <h2>{thanksText}</h2>
                {/* <button onClick={close}>關閉</button> */}
            </div>
        )
    }

export default ThanksPage
