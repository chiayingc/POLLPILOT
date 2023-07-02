import React, { useState, useEffect, useContext } from 'react'
import Navbar from '../components/Navbar'
import '../styles/AddQuesPage.css'
import Question from '../components/Question.js'
import '../styles/Question.css'
import { UserContext } from '../helper/Context'
import { auth, db } from '../../firebase-config.js'
import { doc, setDoc } from 'firebase/firestore'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  onAuthStateChanged
} from 'firebase/auth'
import menu from '../assets/add-to-queue.png'
import Swal from 'sweetalert2'

function AddQuesPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const serial = state.serial;
  const [mobile, setMobile] = useState(false);
  const [queCount, setQueCount] = useState(0);
  const [allQues, setAllQues] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        if (window.innerWidth < 600) { setMobile(true); }
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
      let theQue = { id: id, type: type, queSerial: queSerial };
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
      let theQue = { id: id, type: type, queSerial: queSerial, content: content };
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
      let option = options.filter(ele => ele.trim() !== '');
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
    const newAllQ = allQuestions.filter(ele => ele).map((ele, index) => ({ ...ele, id: index + 1 }));;
    let newQuesType = {}

    for (let i = 0; i < newAllQ.length; i++) {
      newQuesType[newAllQ[i].queSerial] = newAllQ[i].type;
    }
    const setQues = doc(db, "surveys", serial, "questions", "version1");
    await setDoc(setQues, {
      questions: newAllQ
    }, { merge: true })
      .then(async () => {
        const setVersion = doc(db, "surveys", serial);
        await setDoc(setVersion, {
          version: 1
        }, { merge: true }).then(() => {
          navigate("/release/" + serial);
        }).catch(() => { 

         });

      })
      .catch(() => { 
        
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
      <div id='addquespage_main'>
        <div id='addquespage_main_left'>
          {/* <Question allQ={allQues} recordQue={recordQue} done={done} /> */}
          {/* //這邊要再加入要不要顯示題號的設定 回傳不同的html結果 */}
          <Question allQ={allQues} done={done} doneC={doneC} remove={remove} />
          {/* <Question allQ={allQues} /> */}
          {/* {allQues.map((allq, index) => <Question key={index} allQ={allq} />)} */}
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
            <button onClick={addQue} value={"F"}>數字題</button>
            <button onClick={addQue} value={"G"}>數字滑桿</button>
            <button onClick={addQue} value={"H"}>引言</button>
            <button onClick={addQue} value={"I"}>分類標題</button>
            <button onClick={addQue} value={"J"}>日期</button>
            <button onClick={addQue} value={"K"}>分隔線</button>
          </div>
        </div>
      </div>
      <div id='step_btn'>
        <button onClick={saveQues}>發布問卷</button>
      </div>
    </div>
  )
}

export default AddQuesPage
