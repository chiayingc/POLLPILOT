import React, { useState, useEffect, useContext } from 'react'
import '../styles/Signpage.css'
import { doc, collection, setDoc, getDoc, getDocs, query, where, onSnapshot, get } from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'
// import signbk1 from '../assets/signbk1.svg'
import signbk1 from '../assets/illustration_home_01.svg'
import Navbar from '../components/Navbar'
import { auth, db, provider } from '../../firebase-config.js'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    onAuthStateChanged,
} from 'firebase/auth'
import { UserContext } from '../helper/Context'

function Signpage(props) {
    const { user, setUser } = useContext(UserContext);
    let userName, signinEmail, signupEmail, signinPassword, signupPassword;
    const [errorHint, setErrorHint] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                navigate("/dashboard");
            }
        });
    }, []);

    const signin = async (e) => {
        e.preventDefault();
        try {
            const user = await signInWithEmailAndPassword(
                auth,
                signinEmail,
                signinPassword);
            if (user) {
                setUser(user);
                navigate("/dashboard");
            }
        } catch (error) {
            // console.log(error.message);
            setErrorHint("登入失敗:" + error.message.substring(8, [error.message.length]));
        }

    };

    const signup = async (e) => {
        e.preventDefault();
        if (userName == "" || signupEmail == "" || signupPassword == "" ||
            userName == undefined || signupEmail == undefined || signupPassword == undefined) {
            setErrorHint("資料輸入不完全");
        }
        else {
            try {
                await createUserWithEmailAndPassword(
                    auth,
                    signupEmail,
                    signupPassword)
                    .then(() => {
                        // 把使用者註冊資料放進資料庫
                        onAuthStateChanged(auth, async (currentUser) => {
                            if (currentUser) {
                                let random = Date.now().toString(36);
                                let shortuid = currentUser.uid.substring(0, 4);
                                const createUser = doc(db, "users", currentUser.uid);
                                await setDoc(createUser, {
                                    name: userName,
                                    email: signupEmail,
                                    uid: currentUser.uid,
                                    usermark: random + shortuid,
                                    registTime: Date.now()
                                }, { merge: true })
                                    .then(() => {
                                        console.log("create successed!");
                                        alert("註冊成功");
                                        navigate("/dashboard");
                                    })
                                    .catch(() => { console.log("create fail") });
                            }
                        });
                    })
                    .catch((error) => {
                        console.log(error.message);
                        // setErrorHint(error.message.substring(8, [error.message.length]));
                        setErrorHint(error.message);
                        alert("註冊失敗");
                    });
            } catch (error) {
                //註冊失敗
                // console.log(3);
                setErrorHint(error.message.substring(8, [error.message.length]));
                alert("註冊失敗");
            }
        }
    };

    const signingoogle = ()=>{
        signInWithPopup(auth, provider).then((data)=>{
            localStorage.setItem("email",data.user.email);
        });
    }

    const SignForm = () => {
        let form;
        if (props.sign == "signin") {
            form = <div className='sign_form'>
                <h3>登入</h3>
                <form>
                    <div>
                        <p className='form_column'>您的電子郵件地址</p>
                        <input className='sign_input' type="text" placeholder='請輸入您的電子郵件地址'
                            onChange={(e) => { signinEmail = e.target.value; }} />
                    </div>
                    <div>
                        <p className='form_column'>您的密碼</p>
                        <div>
                            <input className='sign_input' type="password" placeholder='請輸入您的密碼'
                                onChange={(e) => { signinPassword = e.target.value; }} />
                            <img />
                            <p className='second_title'>忘記密碼了嗎</p>
                        </div>
                        <p className='hint' id='signin_hint'>{errorHint}</p>
                    </div>
                    <button onClick={signin}>
                        登入
                    </button>
                </form>
                <div>
                    {/* <p>其他登入</p> */}
                    {/* <button onClick={signingoogle}>使用 Google 登入</button> */}
                    <div><p className='sign_btn'>還沒有註冊嗎？</p> <p className='sign_btn'><Link to={"/signup"}>前往註冊</Link></p></div>
                </div>
            </div>

        }
        if (props.sign == "signup") {
            form = <div className='sign_form'>
                <h3>註冊</h3>
                <form>
                    <div>
                        <p className='form_column'>您的姓名</p>
                        <input className='sign_input' type="text" placeholder='請輸入您的姓名'
                            onChange={(e) => { userName = e.target.value; }} />
                    </div>
                    <div>
                        <p className='form_column'>您的電子郵件地址</p>
                        <input className='sign_input' type="text" placeholder='請輸入您的電子郵件地址'
                            onChange={(e) => { signupEmail = e.target.value; }} />
                    </div>
                    <div>
                        <p className='form_column'>您的密碼</p>
                        <div>
                            <input className='sign_input' type="password" placeholder='請輸入您的密碼'
                                onChange={(e) => { signupPassword = e.target.value; }} />
                            <img />
                        </div>
                        <p className='hint' >{errorHint ? errorHint : ""}</p>
                    </div>
                    <button onClick={signup}>註冊</button>
                </form>
                <div>
                    <p className='sign_btn'>其他註冊</p>
                    {/* <button>使用 Facebook 註冊</button> */}
                    <div><p className='sign_btn'>已經有帳號嗎？</p> <p className='sign_btn'><Link to={"/signin"}>前往登入</Link></p></div>
                </div>
            </div>
        }

        return form

    }

    let deploy;
    deploy = <div className='signpage'>
        <Navbar type={3} />
        <div className='signpage_main'>
            <div className='signpage_main_left'>
                <SignForm />
            </div>
            <div className='signpage_main_right'>
                <iframe className='signbk1' src={signbk1}></iframe>
            </div>
        </div>
    </div>

    return deploy
}

export default Signpage
