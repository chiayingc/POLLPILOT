import React, { useState, useEffect } from 'react'
import '../styles/ThanksPage.css'
import { useLocation } from 'react-router-dom'
import { auth, db } from '../../firebase-config.js'
import { doc, collection, setDoc, getDocs, getDoc, getString } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'



//////路徑要改 不能依賴user

function ThanksPage() {
    const [thanksText, setThanksText] = useState("");

    const location = useLocation();
    let tmpAry = location.pathname.split("/");
    let serial = tmpAry[tmpAry.length - 1];

    useEffect(() => {
        const getSetting = doc(db, "surveys", serial);
        getDoc(getSetting)
            .then(async (data) => {
                setThanksText(data.data().Settings.thanksText);
            }).catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div id='thankspage'>
            <Navbar type={4} />
            <div className='thankspage_content'>
                <p>{thanksText}</p>
            </div>
            {/* <button onClick={close}>關閉</button> */}
        </div>
    )
}

export default ThanksPage
