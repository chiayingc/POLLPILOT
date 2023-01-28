import React, { useState, useEffect } from 'react'
import '../styles/SignUpPage.css'
import { Link } from 'react-router-dom'
import home from '../assets/home.png'
import pplogo from '../assets/pp-logo-tmp_05.png'
import { auth } from '../../firebase-config.js'
import { createUserWithEmailAndPassword,
        onAuthStateChanged } from 'firebase/auth'

function SignUpPage() {
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");

    const [user,setUser]=useState({});

    useEffect(()=>{
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
    },[]);

    const signup= async(e)=>{
        e.preventDefault();
        // console.log(user.email);
        // console.log(1);
        try{
            // console.log(2);
            const user=await createUserWithEmailAndPassword(
                auth,
                signupEmail,
                signupPassword);
            console.log(user);
        }catch(error){
            // console.log(3);
            console.log(error.message);
        }
        
    };

  return (
    <div id='signuppage'>
        {/* <Navbar/> */}
      <div id='signuppage_main'>
        <div id='signuppage_main_left'>
            <div>
                <img src={pplogo} id="logo"/>
            </div>
            <div>
                <h2>註冊</h2>
                <form>
                    <div>
                        <p>您的姓名</p>
                        <input type="text" placeholder='請輸入您的姓名'/>
                    </div>
                    <div>
                        <p>您的電子郵件地址</p>
                        <input type="text" placeholder='請輸入您的電子郵件地址' 
                               onChange={(e)=>{setSignupEmail(e.target.value)}}/>
                    </div>
                    <div id='aaa'>
                        <p>您的密碼</p>
                        <div>
                            <input type="text" placeholder='請輸入您的密碼'
                                   onChange={(e)=>{setSignupPassword(e.target.value)}}/>
                            <img/>
                        </div>
                        <p>hint // {user?user.email:"Not logged In"}</p>
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
            <img src={home}/>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage

