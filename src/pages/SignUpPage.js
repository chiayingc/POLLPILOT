import React, { useState, useEffect, useContext } from 'react'
import '../styles/SignUpPage.css'
import { Link, useNavigate } from 'react-router-dom'
import home from '../assets/home.png'
import pplogo from '../assets/pp-logo-tmp_05.png'
import { auth, db } from '../../firebase-config.js'
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth'
import { UserContext } from '../helper/Context'
import { doc, collection, addDoc, setDoc, getDocs } from 'firebase/firestore'


function SignUpPage() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    // const [uid, setUid]=useState("");
    const [userName, setUserName] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // const [user, setUser] = useState({});

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
    }, []);

    const signup = async (e) => {
        e.preventDefault();
        try {
            if (userName=="") {
                setErrorMsg("資料輸入不完全");
            }
            else {
                await createUserWithEmailAndPassword(
                    auth,
                    signupEmail,
                    signupPassword)
                    .then(() => {
                        //把使用者註冊資料放進資料庫
                        onAuthStateChanged(auth, async (currentUser) => {
                            const shortUid= currentUser.uid.substring(0,4);

                            const userData = doc(db, "allUsers", "user_" + shortUid);
                            await setDoc(userData,
                                {
                                    name: userName,
                                    email: signupEmail,
                                    uid:currentUser.uid,
                                    registTime: Date.now(),
                                    surveyCount: 0
                                },
                                { merge: true })
                                .then(() => {
                                    console.log("create successed!");
                                    alert("註冊成功");
                                    navigate("/dashboard");
                                });
                                // .catch(() => { console.log("create fail") });
                        });
                    })
                    .catch((error) => {
                        setErrorMsg(error.message.substring(8, [error.message.length]));
                        alert("註冊失敗");
                    });
            }

        } catch (error) {
            //註冊失敗
            // console.log(3);
            setErrorMsg(error.message.substring(8, [error.message.length]));
            alert("註冊失敗");
        }

    };

    return (
        <div id='signuppage'>
            {/* <Navbar/> */}
            <div id='signuppage_main'>
                <div id='signuppage_main_left'>
                    <div>
                        <img src={pplogo} id="logo" />
                    </div>
                    <div>
                        <h2>註冊</h2>
                        <form>
                            <div>
                                <p>您的姓名</p>
                                <input type="text" placeholder='請輸入您的姓名'
                                    onChange={(e) => { setUserName(e.target.value) }} />
                            </div>
                            <div>
                                <p>您的電子郵件地址</p>
                                <input type="text" placeholder='請輸入您的電子郵件地址'
                                    onChange={(e) => { setSignupEmail(e.target.value) }} />
                            </div>
                            <div id='aaa'>
                                <p>您的密碼</p>
                                <div>
                                    <input type="password" placeholder='請輸入您的密碼'
                                        onChange={(e) => { setSignupPassword(e.target.value) }} />
                                    <img />
                                </div>
                                <p>hint // {errorMsg ? errorMsg : ""}</p>
                            </div>
                            <button onClick={signup}>註冊</button>
                        </form>
                        <div>
                            <p>其他註冊</p>
                            <button>使用 Facebook 註冊</button>
                            <div><p>已經有帳號嗎？</p> <p><Link to={"/signin"}>前往登入</Link></p></div>
                        </div>
                    </div>
                </div>
                <div id='signuppage_main_right'>
                    <img src={home} />
                </div>
            </div>
        </div>
    )
}

export default SignUpPage

