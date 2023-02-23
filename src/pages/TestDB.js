import React, { useState, useEffect, useContext } from 'react'
import '../styles/FillInPage.css'
import { useLocation } from 'react-router-dom'
import { db } from '../../firebase-config.js'
import { doc, collection, setDoc, getDoc, getDocs, query, where, onSnapshot, get } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

function TestDB() {
    // const getUser=doc(db, "users", "user_PIio");
    // const data=getDoc(getUser)
    // .then((data)=>{
    //     console.log("userData:",data.data()); //取得使用者資料 ok 
    // });
    async function test() {
        const citiesRef = collection(db, "surveys");

        // Create a query against the collection.
        const q = query(citiesRef, where("testCreater", "==", "amy"));
        // console.log(q);

        // const tt=doc(db, "surveys")

        const data = await getDocs(q);
        // console.log(data);
        data.forEach(async (d) => {
            // console.log(d.data()); //ok!
            const t=collection(db, "surveys",d.id,"Answers");
            // console.log(t);
            const ttt=await getDocs(t);
            ttt.forEach((y)=>{console.log(y.data())});
        });
    }
    test();
    // data.forEach((data)=>{console.log(data)});


    return (
        <div>

        </div>
    )
}

export default TestDB
