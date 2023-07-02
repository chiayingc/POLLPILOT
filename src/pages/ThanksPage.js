import React, { useState, useEffect } from 'react'
import '../styles/ThanksPage.css'
import { useLocation } from 'react-router-dom'
import { db } from '../../firebase-config.js'
import { doc, getDoc } from 'firebase/firestore'

import Navbar from '../components/Navbar'

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
                //
            });
    }, []);

    return (
        <div id='thankspage'>
            <Navbar type={4} />
            <div className='thankspage_content'>
                <p>{thanksText}</p>
            </div>
        </div>
    )
}

export default ThanksPage
