import React, { useState, useEffect, useContext } from 'react'
import '../styles/SignInPage.css'
import { Link, useNavigate } from 'react-router-dom'
import signbk1 from '../assets/signbk1.svg'
import Navbar from '../components/Navbar'
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
    )
}

export default SignInPage

