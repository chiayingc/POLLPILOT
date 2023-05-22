import React, { useState, useEffect, useContext } from 'react'
import '../styles/FillInPage.css'
import { useLocation } from 'react-router-dom'
import { doc, collection, setDoc, getDoc, getDocs, query, where, onSnapshot, get } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { auth, db } from '../../firebase-config.js'
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth'
import { UserContext } from '../helper/Context'

function TestDB() {
    const { user, setUser } = useContext(Context);
    const [userName, setUserName] = useState("");

    let uid;

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                uid = currentUser.uid;
                // console.log(currentUser);   
                // testa();
            }  //92
        });


    }, []);


    // const getUser=doc(db, "users", "user_PIio");
    // const data=getDoc(getUser)
    // .then((data)=>{
    //     console.log("userData:",data.data()); //取得使用者資料 ok 
    // });


    //取得使用者的所有問卷 ok
    // async function test() {
    const testb =async ()=> {
        const citiesRef = collection(db, "surveys");

        // Create a query against the collection.
        const q = query(citiesRef, where("creator", "==", "leh8bmdtPIio")); //creater打錯ㄌ
        console.log(q);

        // const tt=doc(db, "surveys")

        const data = await getDocs(q);
        data.forEach(async (d) => {
            // console.log("hereee");
            console.log(d.id); //ok!
            // const t=collection(db, "surveys",d.id,"Answers");  //如果要拿問卷(文件)下的集合
            // // console.log(t);
            // const ttt=await getDocs(t);
            // ttt.forEach((y)=>{console.log(y.data())});

            // const t=doc(db, "surveys",d.id);  //如果要拿問卷(文件)下的欄位走這裡
            // const ttt=await getDoc(t);
            // console.log(ttt.data());
        });
    }
    // test();



    // 寫入新的使用者資料   ok
    //使用者的doc 用完整uid當文件名

    // console.log(user.uid);
    // let random = Date.now().toString(36); //用來當每個使用者對應問卷的ID 
    // let shortuid;
    // if(user.uid!=undefined){
    //     shortuid = user.uid.substring(0, 4);
    //     test();
    // }
    // console.log(shortuid);

    // async function test() {
    //     if (shortuid != undefined) {
    //         const createUser = doc(db, "users", user.uid);
    //         await setDoc(createUser, {
    //             name: "lianlian",
    //             email: "lianlian@mail",
    //             usermark: random + shortuid
    //         }, { merge: true });
    //     }
    // }



    //

    // const testa =async ()=> {
    //     let userMark = "";
    //     console.log("HHH");
    //     if (uid != undefined) {
    //         //取得使用者的usermark
    //         const getUser = doc(db, "users", uid);
    //         await getDoc(getUser)
    //             .then((data) => {
    //                 // console.log(data.data());
    //                 userMark = data.data().usermark;
    //                 // console.log("userData:", data.data()); //取得使用者資料 ok 
    //             });
    //         console.log(userMark);

    //         //生成不重複代碼的方法 1.用時間產生,永不重複 Date.now().toString(36)  2.隨機 Math.random().toString(36).slice(2,8)
    //         let random = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    //         // console.log(random);
    //         const addSurvey = doc(db, "surveys", random);

    //         let settingAry=[3,5,4];
    //         // settingAry['id']
    //         await setDoc(addSurvey, {
    //                         creator: userMark,
    //                         Settings:{
    //                             id: "test",
    //                             name:"name"
    //                         },
    //                         settingAry:settingAry

    //                     }, { merge: true });
    //     }

    // }










    return (
        // <div onClick={testa}>
        <div onClick={testb}>
                adsighyusadhg
        </div>
    )
}

export default TestDB
