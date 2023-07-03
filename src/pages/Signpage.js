import React, { useState, useEffect, useContext } from 'react'
import '../styles/Signpage.css'
import { doc, setDoc } from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'
import signbk1 from '../assets/illustration_home_01.svg'
import Navbar from '../components/Navbar'
import { auth, db, provider } from '../../firebase-config.js'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    onAuthStateChanged,
    getAuth
} from 'firebase/auth'
import { UserContext } from '../helper/Context'

function Signpage(props) {
    const { user, setUser } = useContext(UserContext);
    let userName, signinEmail='testtest@mail.com', signupEmail, signinPassword='testtest123', signupPassword;
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
                            const auth = getAuth();
                            const currentUser = auth.currentUser;
                            console.log(currentUser);
                            if (currentUser) {
                                let random = Date.now().toString(36);
                                let shortuid = currentUser.uid.substring(0, 4);
                                const createUser = doc(db, "users", currentUser.uid);
                                setDoc(createUser, {
                                    name: userName,
                                    email: signupEmail,
                                    uid: currentUser.uid,
                                    usermark: random + shortuid,
                                    registTime: Date.now()
                                }, { merge: true })
                                    .then(() => {
                                        Swal.fire({
                                            icon: 'success',
                                            title: '註冊成功！',
                                            timer: 1500,
                                            timerProgressBar: true,
                                        });
                                        navigate("/dashboard");
                                    })
                                    .catch(() => { 
                                        //
                                    });
                            }
                        // });
                    })
                    .catch((error) => {
                        setErrorHint(error.message);
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: '註冊失敗！',
                            timer: 1500,
                            timerProgressBar: true,
                        });
                    });
            } catch (error) {
                setErrorHint(error.message.substring(8, [error.message.length]));
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: '註冊失敗！',
                    timer: 1500,
                    timerProgressBar: true,
                });
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
                            defaultValue={'testtest@mail.com'}
                            onChange={(e) => { signinEmail = e.target.value; }} />
                    </div>
                    <div>
                        <p className='form_column'>您的密碼</p>
                        <div>
                            <input className='sign_input' type="password" placeholder='請輸入您的密碼'
                                defaultValue={'testtest123'}
                                onChange={(e) => { signinPassword = e.target.value; }} />
                            <img />
                        </div>
                        <p className='hint' id='signin_hint'>{errorHint}</p>
                    </div>
                    <button onClick={signin}>
                        登入
                    </button>
                </form>
                <div>
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
