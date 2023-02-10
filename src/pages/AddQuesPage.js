import React, { useState, useEffect, useContext } from 'react'
import Navbar from '../components/Navbar'
import '../styles/AddQuesPage.css'
import Question from '../components/Question.js'
import '../styles/Question.css'
import { UserContext } from '../helper/Context'
import { auth, db } from '../../firebase-config.js'
import { doc, collection, addDoc, setDoc, getDoc, arrayUnion } from 'firebase/firestore'
import { useLocation, useNavigate } from 'react-router-dom'


function AddQuesPage(props) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const serial = state[0];  //這份問卷的編號
  const survey = state[1]; //問卷的id
  // console.log(state);

  const { user, setUser } = useContext(UserContext);
  const [queCount, setQueCount] = useState(0); //紀錄第幾題(所有題目)

  // const [allAssayQue, setAllAssayQue]=useState([1,2,3,6]); //紀錄所有單選題
  // const [allMutiQue, setAllMutiQue]=useState([4,5]); //紀錄所有多選
  const [allQues, setAllQues] = useState([]); //紀錄所有題目題型
  const [allQuestions, setAllQuestions] = useState([]);  //記錄所有題目內容
  
  const [theQue, setTheQue]=useState([]);

  const [id,setId]=useState("");
  const [type, setType]=useState("");


  const done=async (e)=> {
    e.preventDefault();

    if(theQue[0]=="" || theQue[1]=="" || theQue[2]==""){
      return;
    }
    let newAllQues =allQuestions;
    newAllQues[e.target.id.replace("done", "")]=theQue;
    setAllQuestions(newAllQues);

    
    setTheQue('');
    setId("");


};

  const recordQue = (e) => {   //記錄題目內容(單行文字問答題)
    // console.log(e.target.id);

    setId( e.target.id.replace("AqueContent", ""));
    setType (e.target.id.substr(0, 1));

    setTheQue([id,type, e.target.value]);


  }
  

  const saveQues = async () => {
    // setAllQuestions(tmpQues);
    //////////////////////
    // console.log(allQuestions);///////////////////////
    //存進資料庫

    ////

    // console.log(tmpQues);
    // console.log("Q"+0+1);
    //  要改 要先找到這張問卷的ID 才知道要寫到資料庫哪裡! ////////////////////////////////////////////

    /*這是回答時用的 不要管*/
    // const userSurveys=doc(db,"allUsers","user_"+user.uid,"userSurveys","survey"+"7","Answers","answer"+"1");  /////////要改!!! 第幾張問卷?的第幾份回答??
    /*這是答案卷時用的 不要管 */

    let size=Object.keys(allQuestions).length;
    // console.log(size);

    // console.log(allQuestions);
    // console.log(typeof(allQuestions));

    // const userSurveys=doc(db,"allUsers","user_"+user.uid,"userSurveys",serial+"survey"+survey);  /////////要改!!! 第幾張問卷?
    
    for (let i = 1; i <= size; i++) {
      console.log(allQuestions[i]);
      const userSurveys = doc(db, "allUsers", "user_" + user.uid, "userSurveys", serial + "survey" + survey, "Questions", "Que" + i );  /////////要改!!! 第幾張問卷
      await setDoc(userSurveys, {
        type: allQuestions[i][1],
        content: allQuestions[i][2]
      }, { merge: true })
        .then(async () => {
          console.log("success");
          //跳轉到發布頁面
          }).catch(()=>{console.log("fail")});


          // console.log(allQuestions);
          // console.log(user.uid);

          // await setDoc(userSurveys, {
          //   Questions:  //arrayUnion是用來直接把整個array放進去的
          //     tmpQues
          // }, { merge: true })
          //   .then(async () => {
          //     console.log("success");
          //     //跳轉到發布頁面
          //     navigate("/release", {
          //       state: state
          //     });


            // })
            // .catch(() => {
            //   console.log("fail");
            // });

          ////
        }
    }


    const addQue = (e) => {   //新增題目區塊
      let queAry = allQues;
      // console.log(e.target.value);
      if (e.target.value == "A") {  //設定題型 
        // console.log(queCount);
        queAry[queCount] = "A";
      }
      else if (e.target.value == "B") {
        // console.log(queCount);
        queAry[queCount] = "B";
      }
      setAllQues(queAry);
      // console.log(queAry);



      // let queAssay=[];
      // for( let i=0; i<allAssayQue.length; i++){
      //   queAssay.push(allAssayQue[i]);
      // }
      // queAssay.push(queCount+1);

      // setAllAssayQue(queAssay);
      // console.log(allAssayQue);  //所有單選題的題號
      // setAllQues([allAssayQue,allMutiQue]);  //所有題型的題號 把它帶入Questions.js 輸出所有題目的架構
      // console.log(allQues);

      // setAllQuestions(<Question allQ={allQues}/>);



      //   不對!! 要改成 用一個陣列紀錄每一題的題型(例如[a,m,a,a]->第一題問答第二題多選第三題問答第四題問答)
      //    再把所有題型丟過去   不然分開帶入 題號會亂掉

      setQueCount(queCount + 1);

    }

    return (
      <div id='addquespage'>
        {/* 要改成會員版nav */}
        <Navbar />
        <div id='addquespage_main'>
          <div id='addquespage_main_left'>
            <Question allQ={allQues} recordQue={recordQue} done={done} />
          </div>
          <div id='addquespage_main_right'>
            <h5>選擇題型</h5>
            <div id='ques_type'>
              <button onClick={addQue} value={"A"}>單行文字</button>
              <button onClick={addQue} value={"B"}>多行文字</button>
              <button>單選題</button>
              <button>多選題</button>
              <button>矩陣題</button>
              <button>數字題</button>
              <button>數字滑桿</button>
              <button>引言</button>
              <button>分類標題</button>
              <button>日期</button>
              <button>分隔線</button>
            </div>
            <div id='step_btn'>
              <button>＜問卷設定</button>
              <button onClick={saveQues}>外觀設定＞</button>
            </div>
          </div>
        </div>

      </div>
    )
  }

  export default AddQuesPage
