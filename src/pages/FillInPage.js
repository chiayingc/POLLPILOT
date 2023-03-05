import React, { useState, useEffect, useContext } from 'react'
import '../styles/FillInPage.css'
import { useLocation } from 'react-router-dom'
import { db } from '../../firebase-config.js'
import { doc, collection, setDoc, getDoc, query, where, onSnapshot } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'


function FillInPage() {

  const [selectedValue, setSelectedValue] = useState({});
  const [checkedList, setCheckedList] = useState({});

  const handleOptionChange = (event) => {
    // console.log("handleOptionChange");
    // console.log(event.target.name);
    // console.log(checkedList);
    let id = event.target.name.substr(4, 1);
    let val = event.target.value;

    const newArr = [...selectedValue[id]]; // 先複製一份陣列
    const newCheck = [...checkedList[id]];

    if (selectedValue[id].includes(val)) {
      let tmp = newArr.filter(ele => ele != val);
      console.log(tmp);
      setSelectedValue(prevState => ({ ...prevState, [id]: tmp }));
      
      if (!newCheck[val]) { newCheck[val] = false; }
      newCheck[val] = false;
      setCheckedList(prevState => ({ ...prevState, [id]: newCheck }));
    }

    else {
      newArr.push(val);
      console.log(newArr);
      setSelectedValue(prevState => ({ ...prevState, [id]: newArr }));
      
      if (!newCheck[val]) { newCheck[val] = false; }
      newCheck[val] = true;
      setCheckedList(prevState => ({ ...prevState, [id]: newCheck }));
    }

  };


  const navigate = useNavigate();
  const location = useLocation();
  let tmpAry = location.pathname.split("/");
  let serial = tmpAry[tmpAry.length - 1];
  let newAllAns = {};
  const [surveyQues, setSurveyQues] = useState([]);  //記錄所有題目內容
  const [surveySettings, setSurveySettings] = useState([]);


  useEffect(() => {

    const getSetting = doc(db, "surveys", serial);
    getDoc(getSetting)
      .then(async (data) => {
        let version = data.data().version;
        let surveySetting = [version, data.data().Settings];
        const getQues = doc(db, "surveys", serial, "questions", "version" + version);
        await getDoc(getQues)
          .then((data) => {
            setSurveySettings(surveySetting);
            setSurveyQues(data.data().questions);
          });
      });
  }, []);


  function Options(props) {
    let id = props.id;

    // let option =
    //   <div>
    //     <div className='cd_radio'>
    //       <input id={props.type == "C" ? 'cradio' + props.id + "_" + props.index : 'dradio' + props.index}
    //         type='radio'
    //         name={props.type == "C" ? 'quec' + props.id : 'qued' + props.id + '_' + props.index}
    //         className='cd_radio_radio'
    //         value={props.index}
    //         checked={checkedList[id] && checkedList[id][props.index] !== undefined ? checkedList[id][props.index] : false}  //判斷原本有沒有在裡面 沒有的話才checked
    //         onChange={()=>{}}
    //         onClick={(e)=>{handleOptionChange(e)}}
    //       />
    //       <label className="cd_radio_label" htmlFor={props.type == "C" ? 'cradio' + props.id + "_" + props.index : 'dradio' + props.index}></label>
    //       {props.option}
    //     </div>
    //   </div>

    // let tmp=props.type == "C" ? 'quec' + props.id : 'qued' + props.id + '_' + props.index;
    // let tmp=props.type == "C" ? 'cradio' + props.id + "_" + props.index : 'dradio' + props.index;

    let option =
      <div>
        <div >
          <input id={props.type == "C" ? 'cradio' + props.id + "_" + props.index : 'dradio' + props.index}
            type='radio'
            name={props.type == "C" ? 'quec' + props.id : 'qued' + props.id + '_' + props.index}
            // className='cd_radio_radio'
            value={props.index}
            checked={checkedList[id] && checkedList[id][props.index] !== undefined ? checkedList[id][props.index] : false}  //判斷原本有沒有在裡面 沒有的話才checked
            onChange={()=>{
              // console.log(selectedValue);
            }}
            onClick={(e)=>{handleOptionChange(e);
              
            // let v=  document.querySelector('[name="'+tmp+'"]').value;
            // let v=  document.querySelector("#"+tmp).value;
            // console.log(v);
            }}
          />
          <label htmlFor={props.type == "C" ? 'cradio' + props.id + "_" + props.index : 'dradio' + props.index}></label>
          {props.option}
        </div>
      </div>
    return <div>
      {option}
    </div>
  }

  function AQue(props) {
    let queData = props.quedata;
    let formcontents = [];
    if (queData.type == "A") {
      let aque =
        <div key={queData.queSerial} className='fillin_aque'>
          <div className='fillin_que'>{queData.content}</div>
          <input type="text" className='fillin_ans' id={"ans" + queData.queSerial} placeholder={queData.serial} onChange={recordAns} />
        </div>
      // return aque;
      formcontents.push(aque);
    }

    if (queData.type == "B") {
      let bque =
        <div key={queData.queSerial}>
          <div>{queData.content}</div>
          <input type="text" className='fillin_ans' id={"ans" + queData.queSerial} placeholder={queData.serial} onChange={recordAns} />
        </div>
      formcontents.push(bque);
    }

    if (queData.type == "C" || queData.type=="D") {
      // setSelectedValue((prevValue)=>(...prevValue,{queData.id:}))

      useEffect(() => {
        if (!selectedValue[queData.id]) {
          setSelectedValue(prevState => ({ ...prevState, [queData.id]: [] }));
        }
        if (!checkedList[queData.id]) {
          setCheckedList(prevState => ({ ...prevState, [queData.id]: [] }));
        }
      }, [queData.id, selectedValue, checkedList]);

      let cque =
        <div key={queData.id}>
          <div>{queData.content}</div>
          {queData.options.map((item, index) => <Options key={index} option={item} id={queData.id} serial={queData.queSerial} index={index} />)}
        </div>
      formcontents.push(cque);
    }

    return formcontents
  }



  const recordAns = (e) => {
    let ansSerial = e.target.id.replace("ans", "");
    // console.log(id);

    // newAllAns = allAns;
    // // newAllAns[id] = [id, e.target.value];
    //這邊要增加條件 看有沒有是必填題
    //沒填答案的話要不要給空值

    // newAllAns[ansSerial] = {
    //   queSerial: ansSerial,
    //   value: e.target.value
    // };
    newAllAns[ansSerial] = {
      [ansSerial]: e.target.value
    };

    // newAllAns[ansSerial] = [e.target.value];
    // newAllAns[ansSerial] = e.target.value;

    // setAllAns(newAllAns);
    // // console.log(allAns);
  }

  const fillin = async () => {
    let serials = [];
    // let tmpAllAns=[];
    let tmpAllAns = {};
    for (let i = 0; i < surveyQues.length; i++) {
      serials.push(surveyQues[i].queSerial);
      let tmp = tmpAllAns;
      tmpAllAns = {
        ...tmp,
        ...newAllAns[serials[i]]
      }
      // tmpAllAns.push(newAllAns[serials[i]]);
    }

    let answerSerial = Math.random().toString(36).slice(2, 8) + Date.now().toString(36); //答案編號
    // const setAnswer=doc(db, "surveys", serial, "answers", answerSerial);
    const setAnswer = doc(db, "answers", answerSerial);
    await setDoc(setAnswer,
      {
        surveySerial: serial,
        answer: tmpAllAns
      }
      , { merge: true })
      .then(() => {
        console.log("success");
        navigate("/thanks/" + serial);
      }).catch(() => { console.log("fail") });
  }

  return (
    <div id='fillinpage'>
      <Navbar type={4} />
      <div className='fillin_questions'>
        {surveyQues.map((que, index) => <AQue key={index} quedata={que} />)}
      </div>
      <button onClick={fillin} id='btn_fillin'>送出問卷</button>

      {/* <div>{surveySetting.welcomeText}</div>
      <div id='fillinpage_questions'>
        {surveyData.map((que, index) => <AQue key={index} id={que.id} type={que.type} content={que.content} showNum={surveySetting.showNum} />)}
      </div>
      <button onClick={fillin} id='btn_fillin'>送出問卷</button> */}
    </div>
  )
}

export default FillInPage
