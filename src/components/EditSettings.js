import React from 'react'
import '../styles/AddNewPage.css'
import ColoredLine from '../components/ColoredLine.js'
import { db } from '../../firebase-config.js'
import { doc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

function EditSettings({oldSettings}) {
    let surveyTitle = oldSettings.name?oldSettings.name:"", surveyWelcomeText = oldSettings.welcomeText?oldSettings.welcomeText:"", surveyThanksText =oldSettings.thanksText?oldSettings.thanksText:"", surveyKey =oldSettings.key?oldSettings.key:"", surveySerial =oldSettings.serial?oldSettings.serial:"", creator;
    let surveyStatus =oldSettings.status?oldSettings.status:0, surveyTitleAlign =oldSettings.titleAlign?oldSettings.titleAlign:0;
    let surveyShowNum = oldSettings.showNum?oldSettings.showNum:true;

    if(oldSettings!={}){
        changeTitleAlign(oldSettings.titleAlign);
        let select=document.querySelector("#status");
        if(select){
            select.value=oldSettings.status;
            if(oldSettings.status==1){
                document.querySelector("#setKey").style.display="block";
            }
            changeShowNum(oldSettings.showNum);
        }
    }
    const navigate = useNavigate();

    function changeTitleAlign(align){
        if(align!=undefined){
            surveyTitleAlign = align;
            document.querySelector("#align_btn_0").className='align_btn';
            document.querySelector("#align_btn_1").className='align_btn';
            document.querySelector("#align_btn_2").className='align_btn';
            document.querySelector("#align_btn_"+align).className='align_btn_c';
        }
    }

    function changeShowNum(showornot){
        surveyShowNum = showornot;
        if(showornot){
            surveyShowNum = true; 
            document.querySelector("#num_btn_t").className='num_btn_c';
            document.querySelector("#num_btn_f").className='num_btn';
        }
        else{
            document.querySelector("#num_btn_f").className='num_btn_c';
            document.querySelector("#num_btn_t").className='num_btn';
        }
    }

    const saveSurveySettings = async () => {
        const addSurvey = doc(db, "surveys", surveySerial);
        let Settings = {
            name: surveyTitle,
            serial: surveySerial,
            titleAlign: surveyTitleAlign,
            showNum: surveyShowNum,
            welcomeText: surveyWelcomeText,
            thanksText: surveyThanksText,
            status: parseInt(surveyStatus),
            key: surveyKey
        }

        await setDoc(addSurvey, {
            Settings: Settings,
        }, { merge: true })
            .then(() => {
                console.log("testsettings::",Settings);
                console.log("set success");
                navigate("/edit/"+surveySerial, {
                    state: {step:1}
                });
            })
            .catch(() => {
                //
            });
    }

    return (
        <div id='addnewpage'>
            <div id='addnewpage_main'>
                <div id='survey_setting'>
                    <h3>問卷頁面設定</h3>
                    <ColoredLine color="#FCE6C0" />
                    <div id='addnewpage_addtitle'>
                        <h4>問卷名稱</h4>
                        <input type="text" placeholder="無標題問卷" defaultValue={surveyTitle}
                            onChange={(e) => { if (e.target.value == ""){surveyTitle="未命名問卷"}else { surveyTitle = e.target.value; } }} />
                    </div>
                    <div id='title_style'>
                        <h4>問卷標題設定</h4>
                        <div id='title_align'>
                            <button id='align_btn_0' className='align_btn' 
                                    onClick={(e) => { changeTitleAlign(0); }}>
                                <svg  viewBox="0 0 35 44" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M2 0.5C1.17157 0.5 0.5 1.17158 0.5 2V41.6087C0.5 42.4371 1.17157 43.1087 2 43.1087H33C33.8284 43.1087 34.5 42.4371 34.5 41.6087V2C34.5 1.17157 33.8284 0.5 33 0.5H2ZM1.5 2C1.5 1.72386 1.72386 1.5 2 1.5H33C33.2761 1.5 33.5 1.72386 33.5 2V41.6087C33.5 41.8848 33.2761 42.1087 33 42.1087H30.2403V17.4371C30.2403 16.6087 29.5687 15.9371 28.7403 15.9371H6C5.17157 15.9371 4.5 16.6087 4.5 17.4371V42.1087H2C1.72386 42.1087 1.5 41.8848 1.5 41.6087V2ZM5 7C4.72386 7 4.5 7.22386 4.5 7.5C4.5 7.77614 4.72386 8 5 8H29.7403C30.0164 8 30.2403 7.77614 30.2403 7.5C30.2403 7.22386 30.0164 7 29.7403 7H5ZM5.5 17.4371C5.5 17.161 5.72386 16.9371 6 16.9371H28.7403C29.0164 16.9371 29.2403 17.161 29.2403 17.4371V41.9371H5.5V17.4371ZM4.5 11.5C4.5 11.2239 4.72386 11 5 11H17.37C17.6461 11 17.87 11.2239 17.87 11.5C17.87 11.7761 17.6461 12 17.37 12H5C4.72386 12 4.5 11.7761 4.5 11.5Z" fill="#6B6B6B"></path></svg>
                                <p>靠左對齊</p>
                            </button>
                            <button id='align_btn_1' className='align_btn' 
                                    onClick={(e) => { changeTitleAlign(1); }}>
                                <svg viewBox="0 0 35 44" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M2 0.5C1.17157 0.5 0.5 1.17158 0.5 2V41.6087C0.5 42.4371 1.17157 43.1087 2 43.1087L4.5 43.1087H30.2403L33 43.1087C33.8284 43.1087 34.5 42.4371 34.5 41.6087V2C34.5 1.17157 33.8284 0.5 33 0.5H2ZM30.2403 42.1087H33C33.2761 42.1087 33.5 41.8848 33.5 41.6087V2C33.5 1.72386 33.2761 1.5 33 1.5H2C1.72386 1.5 1.5 1.72386 1.5 2V41.6087C1.5 41.8848 1.72386 42.1087 2 42.1087H4.5V17.6956C4.5 16.8672 5.17157 16.1956 6 16.1956H28.7403C29.5687 16.1956 30.2403 16.8672 30.2403 17.6956V42.1087ZM5.5 42.1087H29.2403V17.6956C29.2403 17.4195 29.0164 17.1956 28.7403 17.1956H6C5.72386 17.1956 5.5 17.4195 5.5 17.6956V42.1087ZM5 6.69565C4.72386 6.69565 4.5 6.91951 4.5 7.19565C4.5 7.47179 4.72386 7.69565 5 7.69565H29.7403C30.0164 7.69565 30.2403 7.47179 30.2403 7.19565C30.2403 6.91951 30.0164 6.69565 29.7403 6.69565H5ZM10.5 11.1956C10.5 10.9195 10.7239 10.6956 11 10.6956H23.37C23.6461 10.6956 23.87 10.9195 23.87 11.1956C23.87 11.4718 23.6461 11.6956 23.37 11.6956H11C10.7239 11.6956 10.5 11.4718 10.5 11.1956Z" fill="#6B6B6B"></path></svg>
                                <p>置中對齊</p>
                            </button>
                            <button id='align_btn_2' className='align_btn' 
                                    onClick={(e) => { changeTitleAlign(2); }}>
                                <svg viewBox="0 0 35 44" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M2 0.5C1.17157 0.5 0.5 1.17158 0.5 2V41.6087C0.5 42.4371 1.17157 43.1087 2 43.1087L4.5 43.1087H30.2403L33 43.1087C33.8284 43.1087 34.5 42.4371 34.5 41.6087V2C34.5 1.17157 33.8284 0.5 33 0.5H2ZM30.2403 42.1087H33C33.2761 42.1087 33.5 41.8848 33.5 41.6087V2C33.5 1.72386 33.2761 1.5 33 1.5H2C1.72386 1.5 1.5 1.72386 1.5 2V41.6087C1.5 41.8848 1.72386 42.1087 2 42.1087H4.5V17.6956C4.5 16.8672 5.17157 16.1956 6 16.1956H28.7403C29.5687 16.1956 30.2403 16.8672 30.2403 17.6956V42.1087ZM5.5 42.1087H29.2403V17.6956C29.2403 17.4195 29.0164 17.1956 28.7403 17.1956H6C5.72386 17.1956 5.5 17.4195 5.5 17.6956V42.1087ZM5 6.69565C4.72386 6.69565 4.5 6.91951 4.5 7.19565C4.5 7.47179 4.72386 7.69565 5 7.69565H29.7403C30.0164 7.69565 30.2403 7.47179 30.2403 7.19565C30.2403 6.91951 30.0164 6.69565 29.7403 6.69565H5ZM16.5 11.1956C16.5 10.9195 16.7239 10.6956 17 10.6956H29.37C29.6461 10.6956 29.87 10.9195 29.87 11.1956C29.87 11.4718 29.6461 11.6956 29.37 11.6956H17C16.7239 11.6956 16.5 11.4718 16.5 11.1956Z" fill="#6B6B6B"></path></svg>
                                <p>靠右對齊</p>
                            </button>
                        </div>
                    </div>

                    <div id='welcome_text'>
                        <h4>歡迎文字</h4>
                        <textarea onChange={(e) => { surveyWelcomeText = e.target.value; }} defaultValue={surveyWelcomeText}></textarea>
                    </div>

                    <div id='thanks_text'>
                        <h4>感謝文字</h4>
                        <textarea onChange={(e) => { surveyThanksText = e.target.value; }} defaultValue={surveyThanksText}></textarea>
                    </div>
                </div>

                <div id='general_setting'>
                    <h3>一般設定</h3>
                    <ColoredLine color="#FCE6C0" />
                    <div id='survey_status'>
                        <h4>問卷狀態</h4>
                        <select id='status' onChange={(e) => {
                            let status = 0;
                            status=e.target.value;
                            if(status==0){document.querySelector("#setKey").style.display="none"; surveyKey="";}
                            if(status==1){document.querySelector("#setKey").style.display="block"; }
                            if(status==2){document.querySelector("#setKey").style.display="none"; surveyKey="";}
                            surveyStatus = status;
                        }} defaultValue={surveyStatus}>
                            <option value={0}>公開</option>
                            <option value={1}>密碼保護</option>
                            <option value={2}>關閉</option>
                        </select>
                        <div>
                            <input type='text' id='setKey' placeholder='密碼' onChange={(e)=>{surveyKey=e.target.value;}} defaultValue={surveyKey}/>
                        </div>
                    </div>
                    <div id='num_desplay'>
                        <h4>題號顯示</h4>
                        <div id='num_button'>
                            <button id='num_btn_t' className='num_btn' 
                                    onClick={() => { 
                                        changeShowNum(true)}}>
                                顯示
                            </button>
                            <button id='num_btn_f' className='num_btn' 
                                    onClick={() => { 
                                    changeShowNum(false)}}>
                                不顯示
                            </button>
                        </div>
                    </div>
                </div>
                <div id='next_btn' onClick={saveSurveySettings}>
                    <button>儲存，下一步：修改題目</button>
                </div>

            </div>

        </div>
    )
}

export default EditSettings
