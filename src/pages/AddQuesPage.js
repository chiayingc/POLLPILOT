import React, { useState, useEffect, useContext, version } from 'react'
import Navbar from '../components/Navbar'
import '../styles/AddQuesPage.css'
import Question from '../components/Question.js'
import '../styles/Question.css'
import { UserContext } from '../helper/Context'
import { auth, db } from '../../firebase-config.js'
import { doc, collection, addDoc, setDoc, getDoc, arrayUnion } from 'firebase/firestore'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  onAuthStateChanged
} from 'firebase/auth'
import menu from '../assets/add-to-queue.png'
import Swal from 'sweetalert2'


function AddQuesPage() {
  console.log("Add");
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { state } = useLocation();
  const serial = state.serial;  //這份問卷的編號

  const [mobile, setMobile] = useState(false);
  const [queCount, setQueCount] = useState(0); //紀錄第幾題(所有題目)

  const [allQues, setAllQues] = useState([]); //紀錄所有題目題型
  const [allQuestions, setAllQuestions] = useState([]);  //記錄所有題目內容

  // const [theQue, setTheQue] = useState([]);
  // let theQue=[];

  // const [id, setId] = useState("");
  // const [type, setType] = useState("");

  // let quesVersion;
  // let surveySettings;





  console.log("a");
  useEffect(() => {

    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        if (window.innerWidth < 600) { setMobile(true); }

        //取得問卷資訊、問題版本    (如果是新增,用0開始; 如果是編輯問卷題目, 從資料庫取)
        // const getVersion = doc(db, "surveys", serial);
        // await getDoc(getVersion)
        //       .then((data) => {
        //         quesVersion=data.data().version+1;
        //         surveySettings=data.data().Settings;
        //       });
      } else {
        navigate("/signin");
      }
    });
  }, []);


  const done = async (e) => {
    e.preventDefault();
    let queSerial = Date.now().toString(36).slice(2, 8);
    let type = e.target.id.substr(0, 1);
    let id = e.target.id.replace(type+"done", "");
    
    if(type=="K"){
      let theQue = { id: id, type: type, queSerial: queSerial };   //這邊要改成obj 不要用array
      if (theQue.id == "" || theQue.type == "" || theQue.queSerial == "") {
        return;
      }
      let newAllQues = allQuestions;
      console.log("R:",newAllQues);
      // newAllQues[e.target.id.replace("Adone", "")] = theQue; ////////////////
      newAllQues[id] = theQue;
      console.log("N:",newAllQues);

      setAllQuestions(newAllQues);
      e.target.className = "noshow";
      return;
    
    }
    //這邊要加入判斷type 改變content內容
    let content = document.querySelector("#" + type + "queContent" + id).value;
    // console.log("#" + type + "queContent" + id);
    if (content != '') {
      let theQue = { id: id, type: type, queSerial: queSerial, content: content };   //這邊要改成obj 不要用array
      if (theQue.id == "" || theQue.type == "" || theQue.queSerial == "" || theQue.content == "" ) {
        return;
      }
      let newAllQues = allQuestions;
      console.log("R:",newAllQues);
      // newAllQues[e.target.id.replace("Adone", "")] = theQue; ////////////////
      newAllQues[id] = theQue;
      console.log("N:",newAllQues);

      setAllQuestions(newAllQues);
      // document.querySelector("#" + type + "remove" + id).className="Aremove";

    }
    e.target.className = "noshow";
  };

  const doneC = async (e,options) => {
    console.log('doneC');
    e.preventDefault();
    if(options){  ///////////如果有選項才繼續.... 這邊要再修改
    
    let queSerial = Date.now().toString(36).slice(2, 8);
    let type = e.target.id.substr(0, 1);
    let id = e.target.id.replace(type+"done", "");
    console.log(id,type);
    // //這邊要加入判斷type 改變content內容
    let content = document.querySelector("#" + type + "queContent" + id).value;
    let option = options.filter(ele => ele.trim() !== '');
    if(type=="G"){option=Object.values(options);;}
    // // console.log("#" + type + "queContent" + id);
    // if (content != '') {
    let theQue = { id: id, type: type, queSerial: queSerial, content: content, options:option };

      if (theQue.id == "" || theQue.type == "" || theQue.queSerial == "" || theQue.content == "" || theQue.options == "") {
        console.log("empty");
        return;
      }
      let newAllQues = allQuestions;
      console.log("R:",newAllQues);
    //   // newAllQues[e.target.id.replace("Adone", "")] = theQue; ////////////////
      newAllQues[id] = theQue;
      console.log("N:",newAllQues);

      setAllQuestions(newAllQues);
    //   // document.querySelector("#" + type + "remove" + id).className="Aremove";

    // }
    e.target.className = "noshow";
    console.log(e.target.id);
  }
  };


  const remove = async (e) => {
    e.preventDefault();
    let type = e.target.id.substr(0, 1);
    let eid = e.target.id.replace(type + "remove", "");
    // let tmp = document.querySelector("#" + type + "queContent" + eid).value;
    // if (tmp == '') {
    //   document.querySelector("#qus" + eid).className = 'noshow';
    // }
    // else {


    console.log(1, allQuestions);
    let tmp = allQuestions;
    // if(type=="A" || type=="B"){tmp[eid] = '';}
    // if(type=="C"){tmp[eid]=}
    
    tmp[eid] = '';
    // let newAllQues = allQuestions.filter((ele) => ele.id != eid);
    // console.log(2,newAllQues);
    // 這邊要加入把整個題目匡拔掉



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
        console.log(3, allQuestions);
        // console.log(1,allQuestions);
        // // let tmp=allQuestions;
        // let newAllQues = allQuestions.filter((ele) => ele.id != eid);
        // // console.log(2,newAllQues);
        // // 這邊要加入把整個題目匡拔掉
        // document.querySelector("#qus" + eid).className = 'noshow';
        // setAllQuestions(newAllQues);
        // console.log(3,allQuestions);

        // Swal.fire(
        //   'Deleted!',
        //   'Your file has been deleted.',
        //   'success'
        // )
      }
    })


    // var yes = confirm('確定要刪除題目嗎？此動作無法復原');
    // if (yes) {
    //   console.log("yes");
    //   // console.log(allQuestions);
    //   let newAllQues = allQuestions.filter((ele) => ele.id != eid);
    //   // console.log(newAllQues);
    //   setAllQuestions(newAllQues);
    //   // 這邊要加入把整個題目匡拔掉
    //   document.querySelector("#qus" + eid).className = 'noshow';
    // }
    // }
  }

  const saveQues = async () => {
    // console.log(serial);

    const newAllQ = allQuestions.filter(ele => ele).map((ele, index) => ({...ele, id: index+1}));;

    console.log(newAllQ);
    let newQuesType = {}
    console.log(newAllQ);

    for (let i = 0; i < newAllQ.length; i++) {
      newQuesType[newAllQ[i].queSerial] = newAllQ[i].type;
      // console.log(newQuesType);
    }


    // //如果是編輯問卷, 這邊Version版本要改!
    const setQues = doc(db, "surveys", serial, "questions", "version1");
    await setDoc(setQues, {
      questions: newAllQ
    }, { merge: true })
      .then(async () => {
        console.log("success");
        const setVersion = doc(db, "surveys", serial);
        await setDoc(setVersion, {
          questionsType: newQuesType,
          version: 1    //如果是編輯問卷, 這邊Version版本要改!
        }, { merge: true }).then(() => {
          navigate("/release/" + serial);
        }).catch(() => { console.log("fail") });

      })
      .catch(() => { console.log("fail") });
  }

  const addQue = (e) => {   //新增題目區塊
    let queAry = allQues;
    queAry[queCount] = e.target.value;
    // console.log(queAry);
    setAllQues(queAry);
    setQueCount(queCount + 1);
  }

  const handelMenu = (e) => {
    // console.log(e);
    // console.log("hi");
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
            {/* <button>＜問卷設定</button> */}
            {/* <button onClick={saveQues}>外觀設定＞</button> */}
            <button onClick={saveQues}>發布問卷</button>
        </div>
      </div>

    </div>
  )
}

export default AddQuesPage
