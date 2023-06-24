import React, { useState, useEffect, useContext} from 'react'
import '../styles/FillInPage.css'
import { useLocation } from 'react-router-dom'
import { db } from '../../firebase-config.js'
import { doc, collection, setDoc, getDoc, query, where, onSnapshot } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { render } from 'react-dom'
import ColoredLine from '../components/ColoredLine'
import Swal from 'sweetalert2'
import ClosePage from './ClosePage'


function FillInPage() {

  const [selectedValue, setSelectedValue] = useState({});
  const [checkedList, setCheckedList] = useState({});
  const [version, setVersion]=useState(1);

  const handleOptionChange = (serial, index) => {
    // let tmp=selectedValue;
    // Object.assign(tmp,newAllAns);

    const newArr = [...selectedValue[serial]]; // 先複製一份陣列
    const newCheck = [...checkedList[serial]];

    if (selectedValue[serial][0] != index) {
      let tmp = [index]
      setSelectedValue(prevState => ({ ...prevState, [serial]: tmp }));

      newCheck.fill(false);
      newCheck[index] = true;
      setCheckedList(prevState => ({ ...prevState, [serial]: newCheck }));
    }



  };


  //////////////////這邊還沒改//////////////////////////////////////////////  
  const handleDOptionChange = (serial, index) => {
    // let tmpp=selectedValue;
    // Object.assign(tmpp,newAllAns);
    // setSelectedValue(tmpp);

    const newArr = [...selectedValue[serial]]; // 先複製一份陣列
    const newCheck = [...checkedList[serial]];

    if (selectedValue[serial].includes(index)) {
      let tmp = newArr.filter(ele => ele != index);
      console.log(serial, ":", tmp);
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
  let tmpSetting=[];
  tmpSetting[1]={status:3};
  const [surveySettings, setSurveySettings] = useState(tmpSetting);
  const [checkPassword, setCheckPassword] = useState(false);


  useEffect(() => {

    const getSetting = doc(db, "surveys", serial);
    getDoc(getSetting)
      .then(async (data) => {
        let version = data.data().version;
        setVersion(version);
        let surveySetting = [version, data.data().Settings];
        const getQues = doc(db, "surveys", serial, "questions", "version" + version);
        await getDoc(getQues)
          .then((data) => {
            setSurveySettings(surveySetting);
            // setSurveyQues(data.data().questions);
            console.log(surveySetting[1]);

            if (surveySetting[1].status != 2) {
              // console.log("問卷關閉中");
              // navigate("/close");
            // }
            // else{
              setSurveyQues(data.data().questions);
            }
            if (surveySetting[1].status == 1) {
              setCheckPassword(true);
            }
          });
      });

  }, []);


  function Options(props) {
    let id = props.id;
    // console.log(props);
    let serial = props.serial;
    let index = props.index;

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
      <div className='anoption' >
        {/* <div> */}

        {/* 這個寫法是多選題的~~~~ 要改成type D */}
        <input id={props.type == "C" ? 'cradio' + props.id + "_" + props.index : 'dradio' + props.index}
          type='radio'
          name={props.type == "C" ? 'quec' + props.id : 'qued' + props.id + '_' + props.index}
          // className='cd_radio_radio'
          value={props.index}
          checked={
            checkedList[serial] && checkedList[serial][index] !== undefined ? checkedList[serial][index] : false}  //判斷原本有沒有在裡面 沒有的話才checked
          onChange={() => {
            // console.log(selectedValue);
          }}
          onClick={(e) => {
            props.type == "C" ? handleOptionChange(serial, index) : handleDOptionChange(serial, index);

            // let v=  document.querySelector('[name="'+tmp+'"]').value;
            // let v=  document.querySelector("#"+tmp).value;
            // console.log(v);
          }}
        />
        <label htmlFor={props.type == "C" ? 'cradio' + props.id + "_" + props.index : 'dradio' + props.index}></label>
        <p className='fillin_option'>{props.option}</p>
        {/* </div> */}
      </div>
    return <div>
      {option}
    </div>
  }

  function AQue(props) {
    let queData = props.quedata;
    let formcontents = [];
    let queNum = props.queNum;



    if (queData.type == "A") {
      let aque =
        <div key={queData.queSerial} className='fillin_aque'>
          <div className='fillin_que'>{surveySettings[1].showNum ? <span className='quenum'>{queNum}.</span> : ""}{queData.content}</div>
          <input type="text" className='fillin_ans' id={"ans" + queData.queSerial} onChange={recordAns} defaultValue={selectedValue[queData.queSerial]} />
        </div>
      // return aque;
      formcontents.push(aque);
    }

    if (queData.type == "B") {
      let bque =
        <div key={queData.queSerial} className='fillin_aque'>
          <div className='fillin_que'>{surveySettings[1].showNum ? <span className='quenum'>{queNum}.</span> : ""}{queData.content}</div>
          {/* className要改 */}
          <textarea type="text" className='qus_title_inputB' id={"ans" + queData.queSerial} onChange={recordAns} defaultValue={selectedValue[queData.queSerial]} />
        </div>
      formcontents.push(bque);
    }

    if (queData.type == "C" || queData.type == "D") {
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
          <div className='fillin_que'>{surveySettings[1].showNum ? <span className='quenum'>{queNum}.</span> : ""}{queData.content}</div>
          {queData.options.map((item, index) => <Options key={index} option={item} id={queData.id} serial={queData.queSerial} index={index} type={queData.type} />)}
        </div>
      formcontents.push(cque);
    }

    //F 數字題
    if (queData.type == "F") {
      let aque =
        <div key={queData.queSerial} className='fillin_aque'>
          <div className='fillin_que'>{surveySettings[1].showNum ? <span className='quenum'>{queNum}.</span> : ""}{queData.content}</div>
          <input type="number" className='fillin_ans_num' id={"ans" + queData.queSerial} placeholder="請輸入數字" onChange={recordAns} defaultValue={selectedValue[queData.queSerial]} />
        </div>
      // return aque;
      formcontents.push(aque);
    }

    //G range題
    if (queData.type == "G") {
      let aque =
        <div key={queData.queSerial} className='fillin_aque'>
          <div className='fillin_que'>{surveySettings[1].showNum ? <span className='quenum'>{queNum}.</span> : ""}{queData.content}</div>
          {/* 這裡要加入range大小(資料來源)跟間隔顯示、range樣式 */}
          <div className='rangebar'>
            <span>{queData.options[0]}</span>
            <input className='fillin_ans_range' type='range' min={queData.options[0]} max={queData.options[1]} step={queData.options[2]} id={"ans" + queData.queSerial} onChange={recordAns} defaultValue={queData.options[0]} />
            <span>{queData.options[1]}</span>
          </div>
        </div>
      // return aque;
      formcontents.push(aque);
    }

    //H 引言
    if (queData.type == "H") {
      let aque =
        <div key={queData.queSerial} className='fillin_aque'>
          {/* 如果有題號不要加題號 */}
          <div className='fillin_intro'>{queData.content}</div>
        </div>
      // return aque;
      formcontents.push(aque);
    }


    //I 分類標題
    if (queData.type == "I") {
      let aque =
        <div key={queData.queSerial} className='fillin_aque'>
          {/* 如果有題號 要不要加題號?? */}
          <div className='fillin_category'>{queData.content}</div>
        </div>
      // return aque;
      formcontents.push(aque);
    }

    //J 日期
    if (queData.type == "J") {
      let aque =
        <div key={queData.queSerial} className='fillin_aque'>

          <div className='fillin_que'>{surveySettings[1].showNum ? <span className='quenum'>{queNum}.</span> : ""}{queData.content}</div>
          {/* 這邊要補預設日期 */}
          <input type="date" className='fillin_ans_date' id={"ans" + queData.queSerial} onChange={recordAns} defaultValue="" />
        </div>
      // return aque;
      formcontents.push(aque);
    }

    //K 分隔線
    if (queData.type == "K") {
      let aque =
        <div key={queData.queSerial} className='fillin_aque'>
          <ColoredLine color={'#666'} />
        </div>
      // return aque;
      formcontents.push(aque);
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
    newAllAns[ansSerial] = e.target.value;
    let tmpp = selectedValue;
    Object.assign(tmpp, newAllAns);
    setSelectedValue(tmpp);

    // console.log(selectedValue);
    // setSelectedValue[]

    // newAllAns[ansSerial] = [e.target.value];
    // newAllAns[ansSerial] = e.target.value;

    // setAllAns(newAllAns);
    // // console.log(allAns);
  }

  const fillin = async () => {
    console.log(selectedValue);
    console.log(version);
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
        surveySerial: serial+version,
        answer: selectedValue
      }
      , { merge: true })
      .then(() => {
        console.log("success");
        navigate("/thanks/" + serial);
      }).catch(() => { console.log("fail") });
  }

  const passwordCheck = () => {
    console.log(document.querySelector("#input_password").value);
    console.log(surveySettings[1].key);
    if (document.querySelector("#input_password").value == surveySettings[1].key) {
      setCheckPassword(false);
    }
    else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: '密碼錯誤',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }

  let talign = ['left', 'center', 'right'];

  function CountNum() {
    let questionCount = 0;
    return (
      <div>
        {surveyQues.map((que, index) => {
          if (que.type === 'A' || que.type === 'B' || que.type === 'C' || que.type === 'D'
          || que.type === 'F' || que.type === 'G' || que.type === 'J') {
            questionCount += 1;
            return <AQue key={index} quedata={que} queNum={questionCount} />;
          } else {
            return <AQue key={index} quedata={que} queNum={null} />;
          }
        })}
      </div>
    );
  }

  return (
    <div id='fillinpage'>
      <Navbar type={4} />
      {
      surveySettings[1].status==3?
        <div></div>
      :
      surveySettings[1].status==2?
      (<ClosePage/>)
      :
        checkPassword ?
          <div className='fillin_questions'>
            <div className='fillin_askkey'>
              此問卷需要密碼才能填寫, 請輸入問卷密碼
            </div>
            <input type='password' id='input_password' />
            <button onClick={passwordCheck} id='btn_fillin'>確認</button>
          </div>
          :
          <div className='fillin_questions'>
            <div className='title'>
              <h3 className={'survey_title_' + talign[surveySettings[1] ? surveySettings[1].titleAlign : 0]}>{surveySettings[1] ? surveySettings[1].name : ''}</h3>
            </div>
            <div className='welcomeText'>
              {surveySettings[1] ? surveySettings[1].welcomeText : ''}
            </div>
            {/* <div> */}
            {/* {surveyQues.map((que, index) => <AQue key={index} quedata={que} />)} */}
            <div className='quecontent'>
            {<CountNum/>}
            </div>
            {/* </div> */}
            <button onClick={fillin} id='btn_fillin'>送出問卷</button>
          </div>}


      {/* <div>{surveySetting.welcomeText}</div>
      <div id='fillinpage_questions'>
        {surveyData.map((que, index) => <AQue key={index} id={que.id} type={que.type} content={que.content} showNum={surveySetting.showNum} />)}
      </div>
      <button onClick={fillin} id='btn_fillin'>送出問卷</button> */}
    </div>
  )
}

export default FillInPage



