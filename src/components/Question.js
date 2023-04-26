import { doc } from 'firebase/firestore';
import React, { useState } from 'react';
import infoicon from '../assets/info.png';


// 帶入count(第幾題) 設定div id
function Question({ allQ, remove, done, doneC }) {
  // function Question({ allQ }) {
  const [count, setCount] = useState([]);
  const [options, setOptions] = useState([]);
  // let count;
  // console.log(count);
  console.log("b");

  let allQuestions = [];
  let allQueCD = [];

  const QueC = ({ options, count, id, type }) => {
    console.log(type);
    allQueCD = [];
    if (count != undefined) {
      let tmpopt;
      for (let i = 0; i < count.count; i++) {
        console.log("i:", i, "id:", id);
        tmpopt = '';
        if (options[id] != undefined && options[id][i] != undefined) { tmpopt = options[id][i]; }
        let tmp = '';
        tmpopt != '' ? tmp = <input key={type == "C" ? 'coption' + i : 'doption' + i} id={type == "C" ? 'coption_' + id + '_' + i : 'doption_' + id + '_' + i} type='text' placeholder={tmpopt} className='cd_radio_text'
          onChange={recordOption}
          onClick={() => { document.querySelector("#" + type + "done" + id).className = type + "done" }} />
          : tmp = <input key={type == "C" ? 'coption' + i : 'doption' + i} id={type == "C" ? 'coption_' + id + '_' + i : 'doption_' + id + '_' + i} type='text' className='cd_radio_text'
            onChange={recordOption}
            onClick={() => { document.querySelector("#" + type + "done" + id).className = type + "done" }} />

        let oneQueCD = (<div key={type == "C" ? 'quec' + i : 'qued' + i} className='cd_radio'>
          <input key={type == "C" ? 'cradio' + i : 'dradio' + i}
            id={type == "C" ? 'cradio' + id + "_" + i : 'dradio' + i}
            type='radio' name={type == "C" ? 'quec' + id : 'qued' + id + '_' + i}
            className='cd_radio_radio'
          />
          <label className="cd_radio_label"
            htmlFor={type == "C" ? 'cradio' + id + "_" + i : 'dradio' + i}></label>
          {tmp}
        </div>);
        allQueCD.push(oneQueCD);
      }
    }
    return <div>{allQueCD}</div>
  }

  const recordOption = (e) => {
    let type = e.target.id.substr(0, 1);
    let tmp = e.target.id.replace(type + "option_", "").split('_');
    let coptionid = tmp[1];
    let ctitleid = tmp[0];

    let thequec = options;
    console.log(thequec);
    if (thequec[ctitleid] == undefined) { thequec[ctitleid] = []; }
    if (thequec[ctitleid][coptionid] == undefined) { thequec[ctitleid][coptionid] = []; }
    thequec[ctitleid][coptionid] = e.target.value;
    setOptions(thequec);
    console.log("t:", thequec);
    console.log("o:", options);
    // console.log(e.target.value);
  }


  for (let i = 0; i < allQ.length; i++) {
    let id = i + 1;
    if (allQ[i] == "A") {
      let oneQue = <div key={id} id={"qus" + id} className="qus">
        {/* <p id={"title"+id} className="qus_titleA"> 題目標題</p> */}
        <input id={"AqueContent" + id} className="qus_titleA" type="text" placeholder='標題'
          onClick={() => { document.querySelector("#Adone" + id).className = "Adone" }} />
        <br />
        <input className="qus_title_inputA" type="text" readOnly />
        {/* <input id={"AqueContent"+id} className="qus_title_inputA" type="text"/> */}
        {/* <button id={"done"+id}>完成</button> */}
        {/* <input id={"AqueContent"+id} className="qus_titleA" type="text" onChange={recordQue} /> */}
        <br />
        <div className='done'>
          <button id={"Aremove" + id} className="Aremove" onClick={remove}>刪除</button>
          <button id={"Adone" + id} className="Adone" onClick={done}>完成</button>
        </div>
      </div>
      allQuestions.push(oneQue);
    }
    if (allQ[i] == "B") {
      let oneQue = <div key={id} id={"qus" + id} className="qus">
        <input id={"BqueContent" + id} className="qus_titleB" type="text" placeholder='標題'
          onClick={() => { document.querySelector("#Bdone" + id).className = "Bdone" }} />
        <br />
        <textarea className="qus_title_inputB" type="text" readOnly />
        <br />
        <div className='done'>
          <button id={"Bremove" + id} className="Bremove" onClick={remove}>刪除</button>
          <button id={"Bdone" + id} className="Bdone" onClick={done}>完成</button>
        </div>
      </div>
      allQuestions.push(oneQue);
    }
    if (allQ[i] == "C") {
      let oneQue = <div key={id} id={"qus" + id} className="qus">
        <input id={"CqueContent" + id} className="qus_titleC" type="text" placeholder='標題'
          onClick={() => { document.querySelector("#Cdone" + id).className = "Cdone" }} />

        <button className='btn_addradio' onClick={() => {
          let tmp = count;
          tmp[0] = { id: 0, count: 0 };
          if (count[id] == undefined) { tmp[id] = { id: id, count: 0 }; setCount(tmp); }
          const c = count.find(q => q?.id === id);
          c.count++;
          setCount([...count]);

        }}>+</button>
        <QueC options={options} count={count[id]} id={id} type={"C"} />
        {/* {allQueC} */}

        {/* {countC.map((item, index) => <A key={index} count={item} />)} */}

        {/* <input type='text' onChange={handeltest}/> */}

        <br />
        <div className='done'>
          <button id={"Cremove" + id} className="Cremove" onClick={remove}>刪除</button>
          <button id={"Cdone" + id} className="Cdone" onClick={(e) => { doneC(e, options[id]) }}>完成</button>
        </div>
      </div>
      allQuestions.push(oneQue);
    }

    if (allQ[i] == "D") {
      let oneQue = <div key={id} id={"qus" + id} className="qus">
        <input id={"DqueContent" + id} className="qus_titleD" type="text" placeholder='標題'
          onClick={() => { document.querySelector("#Ddone" + id).className = "Ddone" }} />

        <button className='btn_addradio' onClick={() => {
          let tmp = count;
          tmp[0] = { id: 0, count: 0 };
          if (count[id] == undefined) { tmp[id] = { id: id, count: 0 }; setCount(tmp); }
          const c = count.find(q => q?.id === id);
          c.count++;
          setCount([...count]);

        }}>+</button>
        <QueC options={options} count={count[id]} id={id} type={"D"} />
        {/* {allQueC} */}

        {/* {countC.map((item, index) => <A key={index} count={item} />)} */}

        {/* <input type='text' onChange={handeltest}/> */}

        <br />
        <div className='done'>
          <button id={"Dremove" + id} className="Dremove" onClick={remove}>刪除</button>
          <button id={"Ddone" + id} className="Ddone" onClick={(e) => { doneC(e, options[id]) }}>完成</button>
        </div>
      </div>
      allQuestions.push(oneQue);
    }


    //F 數字題
    if (allQ[i] == "F") {
      let oneQue = <div key={id} id={"qus" + id} className="qus">
        <input id={"FqueContent" + id} className="qus_titleF" type="text" placeholder='標題'
          onClick={() => { document.querySelector("#Fdone" + id).className = "Fdone" }} />
        <br />
        <input className="qus_title_inputF" type="number" readOnly />
        <br />
        <div className='done'>
          <button id={"Fremove" + id} className="Fremove" onClick={remove}>刪除</button>
          <button id={"Fdone" + id} className="Fdone" onClick={done}>完成</button>
        </div>
      </div>
      allQuestions.push(oneQue);
    }


    //G 數字滑桿題
    if (allQ[i] == "G") {
      let oneQue = <div key={id} id={"qus" + id} className="qus">
        <input id={"GqueContent" + id} className="qus_titleG" type="text" placeholder='標題'
          onClick={() => { document.querySelector("#Gdone" + id).className = "Gdone" }} />

        <p className='rangeG' onClick={() => { console.log("改區間!") }}>
          <img src={infoicon} className='infoicon'/>
          數字區間0-100
        </p>
        <input type='range' min='0' max='100' step='10' />
        <br />
        <div className='done'>
          <button id={"Gremove" + id} className="Gremove" onClick={remove}>刪除</button>
          <button id={"Gdone" + id} className="Gdone" onClick={done}>完成</button>
        </div>
      </div>
      allQuestions.push(oneQue);
    }


    //H 引言
    if (allQ[i] == "H") {
      let oneQue = <div key={id} id={"qus" + id} className="introH">
        <input id={"HqueContent" + id} className="qus_titleH" type="text" placeholder='引言'
          onClick={() => { document.querySelector("#Hdone" + id).className = "Hdone" }} />
        <br />
        <div className='done'>
          <button id={"Hremove" + id} className="Hremove" onClick={remove}>刪除</button>
          <button id={"Hdone" + id} className="Hdone" onClick={done}>完成</button>
        </div>
      </div>
      allQuestions.push(oneQue);
    }

    //I 分類標題
    if (allQ[i] == "I") {
      let oneQue = <div key={id} id={"qus" + id} className="categoryI">
        {/* //是否有題號?? */}
        {/* <p className="要跟著放大,因為是標題">{id}</p> */}
        <input id={"IqueContent" + id} className="qus_titleI" type="text" placeholder='分類標題'
          onClick={() => { document.querySelector("#Idone" + id).className = "Idone" }} />
        <br />
        <div className='done'>
          <button id={"Iremove" + id} className="Iremove" onClick={remove}>刪除</button>
          <button id={"Idone" + id} className="Idone" onClick={done}>完成</button>
        </div>
      </div>
      allQuestions.push(oneQue);
    }


    //J 日期題
      // 要加入可以選起訖
    if (allQ[i] == "J") {
      let oneQue = <div key={id} id={"qus" + id} className="qus">
        <input id={"JqueContent" + id} className="qus_titleJ" type="text" placeholder='標題'
          onClick={() => { document.querySelector("#Jdone" + id).className = "Jdone" }} />
        <br />
        <input className="qus_title_inputJ" type="date" readOnly />
        <br />
        <div className='done'>
          <button id={"Jremove" + id} className="Jremove" onClick={remove}>刪除</button>
          <button id={"Jdone" + id} className="Jdone" onClick={done}>完成</button>
        </div>
      </div>
      allQuestions.push(oneQue);
    }



// /分隔線 矩陣題 星級題

  }


  return (
    <div id='questions'>
      {allQuestions}
    </div>
  )
}

export default Question
