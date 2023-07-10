import React, { useState, useEffect} from 'react'
import '../styles/FillInPage.css'
import { useLocation } from 'react-router-dom'
import { db } from '../../firebase-config.js'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ColoredLine from '../components/ColoredLine'
import Swal from 'sweetalert2'
import ClosePage from './ClosePage'


function FillInPage() {

  const [selectedValue, setSelectedValue] = useState({});
  const [checkedList, setCheckedList] = useState({});
  const [version, setVersion]=useState(1);

  const handleOptionChange = (serial, index) => {
    const newArr = [...selectedValue[serial]];
    const newCheck = [...checkedList[serial]];

    if (selectedValue[serial][0] != index) {
      let tmp = [index]
      setSelectedValue(prevState => ({ ...prevState, [serial]: tmp }));

      newCheck.fill(false);
      newCheck[index] = true;
      setCheckedList(prevState => ({ ...prevState, [serial]: newCheck }));
    }
  };
 
  const handleDOptionChange = (serial, index) => {
    const newArr = [...selectedValue[serial]];
    const newCheck = [...checkedList[serial]];

    if (selectedValue[serial].includes(index)) {
      let tmp = newArr.filter(ele => ele != index);
      setSelectedValue(prevState => ({ ...prevState, [serial]: tmp }));
      newCheck[index] = false;
      setCheckedList(prevState => ({ ...prevState, [serial]: newCheck }));
    }

    else {
      newArr.push(index);
      setSelectedValue(prevState => ({ ...prevState, [serial]: newArr }));

      if (!newCheck[index]) { newCheck[index] = false; }
      newCheck[index] = true;
      setCheckedList(prevState => ({ ...prevState, [serial]: newCheck }));
    }
  };

  const navigate = useNavigate();
  const location = useLocation();
  let tmpAry = location.pathname.split("/");
  let serial = tmpAry[tmpAry.length - 1];
  let newAllAns = {};
  const [surveyQues, setSurveyQues] = useState([]);
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
            if (surveySetting[1].status != 2) {
              if(data.data() && data.data().questions){
                setSurveyQues(data.data().questions);
              }else{
                Swal.fire({
                  icon: 'warning',
                  title: '此問卷目前沒有題目！',
                  timer: 2000,
                  timerProgressBar: true,
              }).then(
                ()=>{navigate("/");}
              );
              
              }
            }
            if (surveySetting[1].status == 1) {
              setCheckPassword(true);
            }
          });
      });

  }, []);


  function Options(props) {
    let serial = props.serial;
    let index = props.index;
    let option =
      <div className='anoption' >
        <input id={props.type == "C" ? 'cradio' + props.id + "_" + props.index : 'dradio' + props.index}
          type='radio'
          name={props.type == "C" ? 'quec' + props.id : 'qued' + props.id + '_' + props.index}
          value={props.index}
          checked={
            checkedList[serial] && checkedList[serial][index] !== undefined ? checkedList[serial][index] : false}  
          onChange={() => {
            //
          }}
          onClick={(e) => {
            props.type == "C" ? handleOptionChange(serial, index) : handleDOptionChange(serial, index);
          }}
        />
        <label htmlFor={props.type == "C" ? 'cradio' + props.id + "_" + props.index : 'dradio' + props.index}></label>
        <p className='fillin_option'>{props.option}</p>
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
      formcontents.push(aque);
    }

    if (queData.type == "B") {
      let bque =
        <div key={queData.queSerial} className='fillin_aque'>
          <div className='fillin_que'>{surveySettings[1].showNum ? <span className='quenum'>{queNum}.</span> : ""}{queData.content}</div>
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
            {/* <input className='fillin_ans_range' type='range' min={queData.options[0]} max={queData.options[1]} step={queData.options[2]} id={"ans" + queData.queSerial} onChange={recordAns} defaultValue={queData.options[0]} /> */}
            <input className='fillin_ans_range' type='range' min={queData.options[0]} max={queData.options[1]} step={queData.options[2]} id={"ans" + queData.queSerial} onChange={recordAns} defaultValue={selectedValue[queData.queSerial]} />
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
          <div className='fillin_intro'>{queData.content}</div>
        </div>
      formcontents.push(aque);
    }

    //I 分類標題
    if (queData.type == "I") {
      let aque =
        <div key={queData.queSerial} className='fillin_aque'>
          <div className='fillin_category'>{queData.content}</div>
        </div>
      formcontents.push(aque);
    }

    //J 日期
    if (queData.type == "J") {
      let aque =
        <div key={queData.queSerial} className='fillin_aque'>

          <div className='fillin_que'>{surveySettings[1].showNum ? <span className='quenum'>{queNum}.</span> : ""}{queData.content}</div>
          <input type="date" className='fillin_ans_date' id={"ans" + queData.queSerial} onChange={recordAns} defaultValue="" />
        </div>
      formcontents.push(aque);
    }

    //K 分隔線
    if (queData.type == "K") {
      let aque =
        <div key={queData.queSerial} className='fillin_aque'>
          <ColoredLine color={'#666'} />
        </div>
      formcontents.push(aque);
    }
    return formcontents
  }



  const recordAns = (e) => {
    let ansSerial = e.target.id.replace("ans", "");
    newAllAns[ansSerial] = e.target.value;
    let tmpp = selectedValue;
    Object.assign(tmpp, newAllAns);
    setSelectedValue(tmpp);
  }

  const fillin = async () => {
    let answerSerial = Math.random().toString(36).slice(2, 8) + Date.now().toString(36);
    const setAnswer = doc(db, "answers", answerSerial);
    await setDoc(setAnswer,
      {
        surveySerial: serial+version,
        answer: selectedValue
      }
      , { merge: true })
      .then(() => {
        navigate("/thanks/" + serial);
      }).catch(() => {

      });
  }

  const passwordCheck = () => {
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
            <div className='quecontent'>
            {<CountNum/>}
            </div>
            <button onClick={fillin} id='btn_fillin'>送出問卷</button>
          </div>}
    </div>
  )
}

export default FillInPage



