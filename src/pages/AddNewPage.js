import React, { useState, useEffect, useContext } from 'react'
import '../styles/AddNewPage.css'
import Navbar from '../components/Navbar.js'
import ColoredLine from '../components/ColoredLine.js'
import { UserContext  } from '../helper/Context'
import { auth, db } from '../../firebase-config.js'
import { doc, collection, addDoc , setDoc, getDoc, QuerySnapshot } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

function AddNewPage() {
    const navigate = useNavigate();
    const {user, setUser}=useContext(UserContext);
    const [survey, setSurvey]=useState(1); //紀錄第幾張問卷
    const [surveyTitle, setSurveyTitle]=useState(""); //紀錄問卷名稱
    const [surveyTitleAlign, setSurveyTitleAlign]=useState(0); //紀錄問卷標題對齊方式
    const [surveyWelcomeText, setSurveyWelcomeText]=useState(""); //紀錄歡迎文字
    const [surveyThanksText, setSurveyThanksText]=useState(""); //紀錄感謝文字
    const [surveyStatus, setSurveyStatus]=useState(0); //紀錄問卷是否公開(資料庫publicornot欄位,欄位要改名)
    const [surveyShowNum, setSurveyShowNum]=useState(true); //紀錄問卷是否要標示題號
    const [surveyKey, setSurveyKey]=useState(""); //紀錄問卷密碼

    useEffect(()=>{
        onAuthStateChanged(auth, async(currentUser) => {
            setUser(currentUser);
            const userData=doc(db,"allUsers","user_"+currentUser.uid);
            const data=await getDoc(userData);
            console.log(currentUser);
            // console.log(data.data());
            setSurvey(data.data().surveyCount+1);
        });
    },[]);


    const saveSurveySettings=async()=>{

          //let date=new Date()
          //生成不重複代碼的方法 1.用時間產生,永不重複 Date.now().toString(36)  2.隨機 Math.random().toString(36).slice(2,8)
          // let date=new Date();
          let serial=Date.now().toString(36).slice(2,8);
          //把代碼放進問卷資料裡面

        const userSurveys=doc(db,"allUsers","user_"+user.uid,"userSurveys",serial+"survey"+survey);
        await setDoc(userSurveys, {
            id:survey,
            name:surveyTitle,
            titleAlign:surveyTitleAlign,
            welcomeText:surveyWelcomeText,
            thanksText:surveyThanksText,
            status:surveyStatus,
            key:surveyKey,
            showNum:surveyShowNum,
            serial:serial
         }, { merge: true })
        .then(async()=>{
            console.log("success"); 
            //更改紀錄user的問卷張數 
            const userData=doc(db,"allUsers","user_"+user.uid);
            await setDoc(userData,
                {
                    surveyCount:survey
                },
                { merge:true })
                .then(()=>{
                    console.log("update successed!")
                    // 跳轉頁面
                    navigate("/addques",{
                        state:[serial,survey]
                    });
                })
                .catch(()=>{console.log("update fail")});
        })
        .catch(()=>{
            console.log("fail");    
        });
    }

    return (
        <div id='addnewpage'>
            <Navbar />
            <div id='addnewpage_main'>
                <div id='survey_setting'>
                    <h3>問卷頁面設定</h3>
                    <ColoredLine color="#FCE6C0" />
                    <div id='addnewpage_addtitle'>
                        <h4>問卷名稱</h4>
                        <input type="text" placeholder="無標題問卷" 
                               onChange={(e)=>{setSurveyTitle(e.target.value);}} />
                    </div>
                    <div id='title_style'>
                        <h4>問卷標題設定</h4>
                        <div id='title_align'>
                            <button onClick={()=>{setSurveyTitleAlign(0);}}>
                                <svg width="35" height="44" viewBox="0 0 35 44" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M2 0.5C1.17157 0.5 0.5 1.17158 0.5 2V41.6087C0.5 42.4371 1.17157 43.1087 2 43.1087H33C33.8284 43.1087 34.5 42.4371 34.5 41.6087V2C34.5 1.17157 33.8284 0.5 33 0.5H2ZM1.5 2C1.5 1.72386 1.72386 1.5 2 1.5H33C33.2761 1.5 33.5 1.72386 33.5 2V41.6087C33.5 41.8848 33.2761 42.1087 33 42.1087H30.2403V17.4371C30.2403 16.6087 29.5687 15.9371 28.7403 15.9371H6C5.17157 15.9371 4.5 16.6087 4.5 17.4371V42.1087H2C1.72386 42.1087 1.5 41.8848 1.5 41.6087V2ZM5 7C4.72386 7 4.5 7.22386 4.5 7.5C4.5 7.77614 4.72386 8 5 8H29.7403C30.0164 8 30.2403 7.77614 30.2403 7.5C30.2403 7.22386 30.0164 7 29.7403 7H5ZM5.5 17.4371C5.5 17.161 5.72386 16.9371 6 16.9371H28.7403C29.0164 16.9371 29.2403 17.161 29.2403 17.4371V41.9371H5.5V17.4371ZM4.5 11.5C4.5 11.2239 4.72386 11 5 11H17.37C17.6461 11 17.87 11.2239 17.87 11.5C17.87 11.7761 17.6461 12 17.37 12H5C4.72386 12 4.5 11.7761 4.5 11.5Z" fill="#6B6B6B"></path></svg>
                                <p>靠左對齊</p>
                            </button>
                            <button onClick={()=>{setSurveyTitleAlign(1);}}>
                                <svg width="35" height="44" viewBox="0 0 35 44" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M2 0.5C1.17157 0.5 0.5 1.17158 0.5 2V41.6087C0.5 42.4371 1.17157 43.1087 2 43.1087L4.5 43.1087H30.2403L33 43.1087C33.8284 43.1087 34.5 42.4371 34.5 41.6087V2C34.5 1.17157 33.8284 0.5 33 0.5H2ZM30.2403 42.1087H33C33.2761 42.1087 33.5 41.8848 33.5 41.6087V2C33.5 1.72386 33.2761 1.5 33 1.5H2C1.72386 1.5 1.5 1.72386 1.5 2V41.6087C1.5 41.8848 1.72386 42.1087 2 42.1087H4.5V17.6956C4.5 16.8672 5.17157 16.1956 6 16.1956H28.7403C29.5687 16.1956 30.2403 16.8672 30.2403 17.6956V42.1087ZM5.5 42.1087H29.2403V17.6956C29.2403 17.4195 29.0164 17.1956 28.7403 17.1956H6C5.72386 17.1956 5.5 17.4195 5.5 17.6956V42.1087ZM5 6.69565C4.72386 6.69565 4.5 6.91951 4.5 7.19565C4.5 7.47179 4.72386 7.69565 5 7.69565H29.7403C30.0164 7.69565 30.2403 7.47179 30.2403 7.19565C30.2403 6.91951 30.0164 6.69565 29.7403 6.69565H5ZM10.5 11.1956C10.5 10.9195 10.7239 10.6956 11 10.6956H23.37C23.6461 10.6956 23.87 10.9195 23.87 11.1956C23.87 11.4718 23.6461 11.6956 23.37 11.6956H11C10.7239 11.6956 10.5 11.4718 10.5 11.1956Z" fill="#6B6B6B"></path></svg>
                                <p>置中對齊</p>
                            </button>
                            <button onClick={()=>{setSurveyTitleAlign(2);}}>
                                <svg width="35" height="44" viewBox="0 0 35 44" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M2 0.5C1.17157 0.5 0.5 1.17158 0.5 2V41.6087C0.5 42.4371 1.17157 43.1087 2 43.1087L4.5 43.1087H30.2403L33 43.1087C33.8284 43.1087 34.5 42.4371 34.5 41.6087V2C34.5 1.17157 33.8284 0.5 33 0.5H2ZM30.2403 42.1087H33C33.2761 42.1087 33.5 41.8848 33.5 41.6087V2C33.5 1.72386 33.2761 1.5 33 1.5H2C1.72386 1.5 1.5 1.72386 1.5 2V41.6087C1.5 41.8848 1.72386 42.1087 2 42.1087H4.5V17.6956C4.5 16.8672 5.17157 16.1956 6 16.1956H28.7403C29.5687 16.1956 30.2403 16.8672 30.2403 17.6956V42.1087ZM5.5 42.1087H29.2403V17.6956C29.2403 17.4195 29.0164 17.1956 28.7403 17.1956H6C5.72386 17.1956 5.5 17.4195 5.5 17.6956V42.1087ZM5 6.69565C4.72386 6.69565 4.5 6.91951 4.5 7.19565C4.5 7.47179 4.72386 7.69565 5 7.69565H29.7403C30.0164 7.69565 30.2403 7.47179 30.2403 7.19565C30.2403 6.91951 30.0164 6.69565 29.7403 6.69565H5ZM16.5 11.1956C16.5 10.9195 16.7239 10.6956 17 10.6956H29.37C29.6461 10.6956 29.87 10.9195 29.87 11.1956C29.87 11.4718 29.6461 11.6956 29.37 11.6956H17C16.7239 11.6956 16.5 11.4718 16.5 11.1956Z" fill="#6B6B6B"></path></svg>
                                <p>靠右對齊</p>
                            </button>
                        </div>
                    </div>

                    <div id='welcome_text'>
                        <h4>歡迎文字</h4>
                        <textarea onChange={(e)=>{setSurveyWelcomeText(e.target.value);}}></textarea>
                    </div>

                    <div id='thanks_text'>
                        <h4>感謝文字</h4>
                        <textarea onChange={(e)=>{setSurveyThanksText(e.target.value);}}></textarea>
                    </div>
                </div>


                {/* <div>
                <h3><label for="bg-color">選擇背景顏色</label></h3>
                <input type="color" id="bg-color" name="bg-color"
                    value="#F7E2E5">    ///要改React 顏色選擇套件
            </div> */}

                {/* <div id='title_style'>
                <h3>設定歡迎Banner</h3>
                <textarea></textarea>
            </div>

            <div id='title_style'>
                <h3>設定感謝Banner</h3>
                <textarea></textarea>
            </div> */}


                {/* <div id='add_questions'>
                <h3>建立題目</h3>
                <button> + </button>
                <div id='all_questions'>
                    <Question/>
                </div>
            </div> */}

                <div id='general_setting'>
                    <h3>一般設定</h3>
                    <ColoredLine color="#FCE6C0" />
                    <div id='survey_status'>
                        <h4>問卷狀態</h4>
                        <select onChange={(e)=>{
                                                let status=0;
                                                if(e.target.value=="公開"){status=0};
                                                if(e.target.value=="密碼保護"){status=1};
                                                if(e.target.value=="關閉"){status=2};
                                                setSurveyStatus(status);
                                                }}>
                            <option>公開</option>
                            <option>密碼保護</option>
                            <option>關閉</option>
                        </select>
                    </div>
                    <div id='num_desplay'>
                        <h4>題號顯示</h4>
                        <div id='num_button'>
                            <button onClick={()=>{setSurveyShowNum(true);}}>
                                顯示
                            </button>
                            <button onClick={()=>{setSurveyShowNum(false);}}>
                                不顯示
                            </button>
                        </div>
                    </div>
                    {/* <div id='survey_rate'>
                    <h4>問卷頁面進度條</h4>
                    <div>OFF</div>
                    </div> */}
                </div>
                <div id='next_btn' onClick={saveSurveySettings}>
                    <button>下一步：建立題目(設定問卷內容)</button>
                </div>

            </div>

        </div>
    )
}
import '../styles/AddNewPage.css'

export default AddNewPage
