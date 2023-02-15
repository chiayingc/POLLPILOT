import React, { useState, useEffect, useContext } from 'react'
import '../styles/SignInPage.css'
import { Link, useNavigate } from 'react-router-dom'
import home from '../assets/home.png'
import pplogo from '../assets/pp-logo-tmp_05.png'
import { auth } from '../../firebase-config.js'
import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from 'firebase/auth'
import { UserContext  } from '../helper/Context'


function SignInPage() {
    const {user, setUser}=useContext(UserContext);

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
    return (
        <div id='signinpage'>
            <div id='signinpage_main'>
                <div id='signinpage_main_left'>
                    <div id="logo">
                        <img src={pplogo} />
                    </div>
                    <div>
                        <h2>登入</h2>
                        <form>
                            <div>
                                <p>您的電子郵件地址</p>
                                <input type="text" placeholder='請輸入您的電子郵件地址'
                                    onChange={(e) => { setSigninEmail(e.target.value) }} />
                            </div>
                            <div id='aaa'>
                                <p>您的密碼</p>
                                <div>
                                    <input type="password" placeholder='請輸入您的密碼'
                                        onChange={(e) => { setSigninPassword(e.target.value) }} />
                                    <img />
                                    <p>忘記密碼了嗎</p>
                                </div>
                                <p className='hint' id='signin_hint'>{signinHint}</p>
                            </div>
                            <button onClick={signin}>
                                登入
                            </button>
                        </form>
                        <div>
                            <p>其他登入</p>
                            {/* <button>使用 Facebook 登入</button> */}
                            <div><p>還沒有註冊嗎？</p> <p><Link to={"/signup"}>前往註冊</Link></p></div>
                        </div>
                    </div>
                </div>
                <div id='signinpage_main_right'>
                    <img src={home} />
                </div>
            </div>
        </div>
    )
}

export default SignInPage

