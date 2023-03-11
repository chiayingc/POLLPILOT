import React, { useState, useEffect, useContext } from 'react'
import '../styles/FillInPage.css'
import { useLocation } from 'react-router-dom'
import { db } from '../../firebase-config.js'
import { doc, collection, setDoc, getDoc, query, where, onSnapshot } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { render } from 'react-dom'


function FillInPage() {

  const [selectedValue, setSelectedValue] = useState({});
  const [checkedList, setCheckedList] = useState({});
  console.log(selectedValue);
  console.log(checkedList);
  console.log("render");

  const handleOptionChange = (serial,index) => {
    // let tmp=selectedValue;
    // Object.assign(tmp,newAllAns);

    const newArr = [...selectedValue[serial]]; // 先複製一份陣列
    const newCheck = [...checkedList[serial]];

    if (selectedValue[serial][0]!=index) {
      let tmp = [index]
      setSelectedValue(prevState => ({ ...prevState, [serial]: tmp }));
      
      newCheck.fill(false);
      newCheck[index] = true;
      setCheckedList(prevState => ({ ...prevState, [serial]: newCheck }));
    }

  

  };


//////////////////這邊還沒改//////////////////////////////////////////////  
  const handleDOptionChange = (serial,index) => {
    // let tmpp=selectedValue;
    // Object.assign(tmpp,newAllAns);
    // setSelectedValue(tmpp);

    const newArr = [...selectedValue[serial]]; // 先複製一份陣列
    const newCheck = [...checkedList[serial]];

    if (selectedValue[serial].includes(index)) {
      let tmp = newArr.filter(ele => ele != index);
      console.log(serial,":",tmp);
      setSelectedValue(prevState => ({ ...prevState, [serial]: tmp }));
      
      // if (!newCheck[val]) { newCheck[val] = false; }
      newCheck[index] = false;
      setCheckedList(prevState => ({ ...prevState, [serial]: newCheck }));
    }

    else {
      newArr.push(index);
      console.log(newArr);
      setSelectedValue(prevState => ({ ...prevState, [serial]: newArr }));
      
      if (!newCheck[index]) { newCheck[index] = false; }
      newCheck[index] = true;
      setCheckedList(prevState => ({ ...prevState, [serial]: newCheck }));
    }
  };
  
//////////////////這邊還沒改//////////////////////////////////////////////


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
    // console.log(props);
    let serial=props.serial;
    let index=props.index;

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

          {/* 這個寫法是多選題的~~~~ 要改成type D */}
          <input id={props.type == "C" ? 'cradio' + props.id + "_" + props.index : 'dradio' + props.index}
            type='radio'
            name={props.type == "C" ? 'quec' + props.id : 'qued' + props.id + '_' + props.index}
            // className='cd_radio_radio'
            value={props.index}
            checked={
              
              checkedList[serial] && checkedList[serial][index] !== undefined ? checkedList[serial][index] : false}  //判斷原本有沒有在裡面 沒有的話才checked
            onChange={()=>{
              // console.log(selectedValue);
            }}
            onClick={(e)=>{props.type == "C" ?handleOptionChange(serial,index):handleDOptionChange(serial,index);
              
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
          <input type="text" className='fillin_ans' id={"ans" + queData.queSerial} placeholder={queData.serial} onChange={recordAns} defaultValue={selectedValue[queData.queSerial]} />
        </div>
      // return aque;
      formcontents.push(aque);
    }

    if (queData.type == "B") {
      let bque =
        <div key={queData.queSerial} className='fillin_aque'>
          <div className='fillin_que'>{queData.content}</div>
          {/* className要改 */}
          <textarea type="text" className='qus_title_inputB' id={"ans" + queData.queSerial} placeholder={queData.serial} onChange={recordAns} defaultValue={selectedValue[queData.queSerial]} />
        </div>
      formcontents.push(bque);
    }

    if (queData.type == "C" || queData.type=="D") {
      useEffect(() => {
        if (!selectedValue[queData.queSerial]) {
          setSelectedValue(prevState => ({ ...prevState, [queData.queSerial]: [] }));
        }
        if (!checkedList[queData.queSerial]) {
          setCheckedList(prevState => ({ ...prevState, [queData.queSerial]: [] }));
        }
      }, [queData.queSerial, selectedValue, checkedList]);
      // setSelectedValue((prevValue)=>(...prevValue,{queData.id:}))

      let cque =
        <div key={queData.id} className='fillin_aque'>
          <div className='fillin_que'>{queData.content}</div>
          {queData.options.map((item, index) => <Options key={index} option={item} id={queData.id} serial={queData.queSerial} index={index} type={queData.type} />)}
        </div>
      formcontents.push(cque);
    }
    

    return formcontents
  }



  const recordAns = (e) => {
    let ansSerial = e.target.id.replace("ans", "");

    // newAllAns = allAns;
    // // newAllAns[id] = [id, e.target.value];
    //這邊要增加條件 看有沒有是必填題
    //沒填答案的話要不要給空值

    // newAllAns[ansSerial] = {
    //   queSerial: ansSerial,
    //   value: e.target.value
    // };
    newAllAns[ansSerial] =e.target.value  ;
    let tmpp=selectedValue;
    Object.assign(tmpp,newAllAns);
    setSelectedValue(tmpp);

    // setSelectedValue[]

    // newAllAns[ansSerial] = [e.target.value];
    // newAllAns[ansSerial] = e.target.value;

    // setAllAns(newAllAns);
    // // console.log(allAns);
  }

  const fillin = async () => {
    console.log(selectedValue);
    // let serials = [];
    // // let tmpAllAns=[];
    // let tmpAllAns = {};
    // for (let i = 0; i < surveyQues.length; i++) {
    //   serials.push(surveyQues[i].queSerial);
    //   let tmp = tmpAllAns;
    //   tmpAllAns = {
    //     ...tmp,
    //     ...newAllAns[serials[i]]
    //   }
    //   // tmpAllAns.push(newAllAns[serials[i]]);
    // }

    let answerSerial = Math.random().toString(36).slice(2, 8) + Date.now().toString(36); //答案編號
    // const setAnswer=doc(db, "surveys", serial, "answers", answerSerial);
    const setAnswer = doc(db, "answers", answerSerial);
    await setDoc(setAnswer,
      {
        surveySerial: serial,
        answer: selectedValue
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

