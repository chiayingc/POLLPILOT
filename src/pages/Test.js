import React, { useState, useEffect, useContext } from 'react'
import '../styles/SignInPage.css'
import '../styles/SignUpPage.css'
import { Link, useNavigate } from 'react-router-dom'
import signbk1 from '../assets/signbk1.svg'
import Navbar from '../components/Navbar'
import { auth } from '../../firebase-config.js'
import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from 'firebase/auth'
import { UserContext } from '../helper/Context'

function Test(props) {
    /////////////////////////////////////
    // const [uid, setUid]=useState("");
    const [userName, setUserName] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    ///////////////////////////////////////

    const { user, setUser } = useContext(UserContext);

    const [signinEmail, setSigninEmail] = useState("");
    const [signinPassword, setSigninPassword] = useState("");
    const [signinHint, setSigninHint] = useState("");
    // const [user, setUser] = useState({}); 
    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
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
                // setLoggedIn(true);
                setUser(user);
                navigate("/dashboard");
            }
        } catch (error) {
            // console.log(error.message);
            // setLoggedIn(false);
            setSigninHint("登入失敗:" + error.message.substring(8, [error.message.length]));
        }

    };

    const signout = async () => {
        await signOut(auth);
    }

    /////////////////////////////////////////////
    const signup = async (e) => {
        e.preventDefault();
        try {
            if (userName == "") {
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
                            const shortUid = currentUser.uid.substring(0, 4);

                            const userData = doc(db, "allUsers", "user_" + shortUid);
                            await setDoc(userData,
                                {
                                    name: userName,
                                    email: signupEmail,
                                    uid: currentUser.uid,
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
    /////////////////////////////////////////////

    let result;
    if (props.sign == "signin") {
        result = <div id='signinpage'>
            <Navbar type={1} />
            <div id='signinpage_main'>
                <div id='signinpage_main_left'>
                    <div>
                        <h3>登入</h3>
                        <form>
                            <div>
                                <p className='form_column'>您的電子郵件地址</p>
                                <input className='sign_input' type="text" placeholder='請輸入您的電子郵件地址'
                                    onChange={(e) => { setSigninEmail(e.target.value) }} />
                            </div>
                            <div>
                                <p className='form_column'>您的密碼</p>
                                <div>
                                    <input className='sign_input' type="password" placeholder='請輸入您的密碼'
                                        onChange={(e) => { setSigninPassword(e.target.value) }} />
                                    <img />
                                    <p className='second_title'>忘記密碼了嗎</p>
                                </div>
                                <p className='hint' id='signin_hint'>{signinHint}sdfasgd</p>
                            </div>
                            <button onClick={signin}>
                                登入
                            </button>
                        </form>
                        <div>
                            {/* <p>其他登入</p> */}
                            {/* <button>使用 Facebook 登入</button> */}
                            <div><p className='sign_btn'>還沒有註冊嗎？</p> <p className='sign_btn'><Link to={"/signup"}>前往註冊</Link></p></div>
                        </div>
                    </div>
                </div>
                <div id='signinpage_main_right'>
                    <iframe className='signbk1' src={signbk1}></iframe>
                </div>
            </div>
        </div>
    }

    if (props.sign == "signup") {
        result = <div id='signuppage'>
            {/* <Navbar/> */}
            <div id='signuppage_main'>
                <div id='signuppage_main_left'>
                    <div>

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

                </div>
            </div>
        </div>
    }

    return result
}

export default Test
