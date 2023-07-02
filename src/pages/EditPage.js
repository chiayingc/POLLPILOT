import React, { useState, useEffect, useContext } from 'react'
import Navbar from '../components/Navbar'
import '../styles/AddQuesPage.css'
import '../styles/EditPage.css'
import '../styles/Question.css'
import { UserContext } from '../helper/Context'
import { auth, db } from '../../firebase-config.js'
import { doc, collection, addDoc, setDoc, getDoc, arrayUnion, query, where, onSnapshot } from 'firebase/firestore'
import { useLocation, useNavigate } from 'react-router-dom'
import {
    onAuthStateChanged
} from 'firebase/auth'
import menu from '../assets/add-to-queue.png'
import Swal from 'sweetalert2'
import EditQuestion from '../components/EditQuestion'
import EditSettings from '../components/EditSettings'

function EditPage() {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const state = useLocation();
    const serial = state.pathname.replace("/edit/", "");
    const [mobile, setMobile] = useState(false);
    const [queCount, setQueCount] = useState(0); 
    const [allQues, setAllQues] = useState([]);
    const [allQuestions, setAllQuestions] = useState([]);  
    const [step, setStep] = useState(0);

    if (state.state) {
        if (step != state.state) {
            setStep(state.state);
        }
    }

    let oldVersion;
    let currentVersion;
    const [newVersion, setNewVersion] = useState();
    const [surveySettings, setSurveySettings] = useState({});

    useEffect(() => {

        onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                if (window.innerWidth < 600) { setMobile(true); }

                const getVersion = doc(db, "surveys", serial);
                await getDoc(getVersion)
                    .then(async (data) => {
                        const users = collection(db, "users");
                        const getUsermark = query(users,
                            where("usermark", "==", data.data().creator));
                        const queryUsermark = onSnapshot(
                            getUsermark, (snapshot) => {
                                snapshot.forEach(async (user) => {
                                    if (user.data().uid != currentUser.uid) {
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Oops...',
                                            text: '您似乎不是此問卷的作者',
                                            timer: 1200,
                                            timerProgressBar: true,
                                        }).then(() => {
                                            navigate("/dashboard");
                                        });
                                    }
                                    else {
                                        setSurveySettings(data.data().Settings);
                                        oldVersion = data.data().version;
                                        currentVersion = parseInt(oldVersion) + 1;
                                        setNewVersion(currentVersion);
                                        const getQues = doc(db, "surveys", serial, "questions", "version" + oldVersion);
                                        
                                        await getDoc(getQues)
                                            .then((data) => {
                                                if (data.data()) {
                                                    if (data.data().questions) {
                                                        setAllQuestions(data.data().questions);
                                                        setQueCount(data.data().questions.length);
                                                    }
                                                    if (data.data().questionsType) {
                                                        let questionsType = data.data().questionsType;
                                                        setAllQues(Object.values(questionsType));
                                                    }
                                                }
                                            });
                                    }
                                })
                            });
                    });
            } else {
                navigate("/signin");
            }
        });
    }, []);

    const done = async (e) => {
        e.preventDefault();
        let queSerial = Date.now().toString(36).slice(2, 8);
        let type = e.target.id.substr(0, 1);
        let id = e.target.id.replace(type + "done", "");

        if (type == "K") {
            let theQue = { id: id, type: type, queSerial: queSerial };   //這邊要改成obj 不要用array
            if (theQue.id == "" || theQue.type == "" || theQue.queSerial == "") {
                return;
            }
            let newAllQues = allQuestions;
            newAllQues[id] = theQue;
            setAllQuestions(newAllQues);
            e.target.className = "noshow";
            return;
        }

        let content = document.querySelector("#" + type + "queContent" + id).value;
        if (content != '') {
            let theQue = { id: id, type: type, queSerial: queSerial, content: content };   //這邊要改成obj 不要用array
            if (theQue.id == "" || theQue.type == "" || theQue.queSerial == "" || theQue.content == "") {
                return;
            }
            let newAllQues = allQuestions;
            newAllQues[id] = theQue;
            setAllQuestions(newAllQues);
        }
        e.target.className = "noshow";
    };

    const doneC = async (e, options) => {
        e.preventDefault();
        if (options) { 
            let queSerial = Date.now().toString(36).slice(2, 8);
            let type = e.target.id.substr(0, 1);
            let id = e.target.id.replace(type + "done", "");
            let content = document.querySelector("#" + type + "queContent" + id).value;
            let option;
            if (type != "G") { option = options.filter(ele => ele.trim() !== ''); }
            if (type == "G") { option = Object.values(options);; }
            let theQue = { id: id, type: type, queSerial: queSerial, content: content, options: option };
            if (theQue.id == "" || theQue.type == "" || theQue.queSerial == "" || theQue.content == "" || theQue.options == "") {
                //
                return;
            }
            let newAllQues = allQuestions;
            newAllQues[id] = theQue;
            setAllQuestions(newAllQues);
            e.target.className = "noshow";
        }
    };

    const remove = async (e) => {
        e.preventDefault();
        let type = e.target.id.substr(0, 1);
        let eid = e.target.id.replace(type + "remove", "");
        let tmp = allQuestions;
        tmp[eid] = '';

        Swal.fire({
            title: '確定要刪除題目嗎?',
            text: "此動作無法復原",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#E6CAD7',
            cancelButtonColor: '#E9E5E1',
            confirmButtonText: '確定',
            cancelButtonText: '取消'
        }).then((result) => {
            if (result.isConfirmed) {
                document.querySelector("#qus" + eid).className = 'noshow';
                setAllQuestions(tmp);
            }
        })
    }

    const saveQues = async () => {
        const newAllQ = allQuestions.filter(ele => ele).map((ele, index) => ({ ...ele, id: index + 1 }));
        let newQuesType = {}

        for (let i = 0; i < newAllQ.length; i++) {
            let queSerial = Date.now().toString(36).slice(2, 8);
            newAllQ[i].queSerial = queSerial + i;
            newQuesType[newAllQ[i].queSerial] = newAllQ[i].type;
        }

        const setQues = doc(db, "surveys", serial, "questions", "version" + newVersion);
        await setDoc(setQues, {
            questions: newAllQ,
            questionsType: newQuesType
        }, { merge: true })
            .then(async () => {
                const setVersion = doc(db, "surveys", serial);
                await setDoc(setVersion, {
                    version: newVersion  
                }, { merge: true }).then(() => {
                    navigate("/release/" + serial);
                }).catch(() => { console.log("fail") });
            })
            .catch(() => {
                //
            });
    }

    const addQue = (e) => {
        let queAry = allQues;
        queAry[queCount] = e.target.value;
        setAllQues(queAry);
        setQueCount(queCount + 1);
    }

    const handelMenu = (e) => {
        document.querySelector("#addquespage_main_right").className = "noshow";
        document.querySelector("#questype_menu").className = 'questype_menu';
    }

    return (
        <div id='addquespage'>
            <Navbar type={1} />
            {step == 0 ?
                <EditSettings oldSettings={surveySettings} />
                :
                <div id='addquespage_main'>
                    <div id='addquespage_main_left'>
                        <EditQuestion allQ={allQues} done={done} doneC={doneC} remove={remove} allQuestion={allQuestions} />
                    </div>
                    {mobile ?
                        <div id='questype_menu' className='questype_menu'
                            onClick={() => {
                                document.querySelector("#questype_menu").className = "noshow";
                                document.querySelector("#addquespage_main_left").addEventListener('click', handelMenu);
                                document.querySelector("#addquespage_main_right").className = 'addquespage_main_right';

                            }}>
                            <img src={menu} />
                            <p className='addhint'>新增題目</p>
                        </div>
                        : ''}
                    <div id='addquespage_main_right' className={mobile ? 'noshow' : 'addquespage_main_right'}>
                        <h5>選擇題型</h5>
                        <div id='ques_type'>
                            <button onClick={addQue} value={"A"}>單行文字</button>
                            <button onClick={addQue} value={"B"}>多行文字</button>
                            <button onClick={addQue} value={"C"}>單選題</button>
                            <button onClick={addQue} value={"D"}>多選題</button>
                            {/* <button onClick={addQue} value={"E"}>矩陣題</button> */}
                            <button onClick={addQue} value={"F"}>數字題</button>
                            <button onClick={addQue} value={"G"}>數字滑桿</button>
                            <button onClick={addQue} value={"H"}>引言</button>
                            <button onClick={addQue} value={"I"}>分類標題</button>
                            <button onClick={addQue} value={"J"}>日期</button>
                            <button onClick={addQue} value={"K"}>分隔線</button>
                        </div>
                        {/* <div id='step_btn'> */}
                        {/* <button>＜問卷設定</button> */}
                        {/* <button onClick={saveQues}>外觀設定＞</button> */}
                        {/* <button onClick={saveQues}>發布問卷</button> */}
                        {/* </div> */}
                    </div>
                    <div id='step_btn'>
                        <button onClick={saveQues}>發布問卷</button>
                    </div>
                </div>
            }
        </div>
    )
}

export default EditPage
