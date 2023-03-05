  import { doc } from 'firebase/firestore';
  import React, { useState } from 'react'
  
  
  // 帶入count(第幾題) 設定div id
  function Question({ allQ, remove, done, doneC }) {
    // function Question({ allQ }) {
    const [count, setCount] = useState([]);
    const [options, setOptions] = useState([]);
    // let count;
    // console.log(count);
    console.log("b");
  
    let allQuestions = [];
    let allQueC = [];
  
    const QueC = ({ options, count, id }) => {
      console.log(options);
      console.log(count);
      allQueC = [];
      if (count != undefined) {
        
        let tmpopt;
        for (let i = 0; i < count.count; i++) {
          console.log("i:", i, "id:", id);
          tmpopt = '';
          if (options[id] != undefined && options[id][i] != undefined) { tmpopt = options[id][i]; }
          let tmp = '';
          tmpopt != '' ? tmp = <input key={'coption' + i} id={'coption_' + id + '_' + i} type='text' name='option' value={tmpopt} onChange={recordOption} /> :
            tmp = <input key={'coption' + i} id={'coption_' + id + '_' + i} type='text' name='option' onChange={recordOption} />
  
          let oneQueC = (<div key={'quec' + i}>
            <input key={'cradio' + i} id={'cradio' + id} type='radio' name='quec' readOnly />
            {tmp}
          </div>);
          allQueC.push(oneQueC);
        }
      }
      return <div>{allQueC}</div>
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
          <br />
          <button onClick={() => {
            let tmp = count;
            tmp[0] = { id: 0, count: 0 };
            if (count[id] == undefined) { tmp[id] = { id: id, count: 0 }; setCount(tmp); }
            const c = count.find(q => q?.id === id);
            c.count++;
            setCount([...count]);

          }}>+</button>
          <QueC options={options} count={count[id]} id={id} />
          {/* {allQueC} */}
  
          {/* {countC.map((item, index) => <A key={index} count={item} />)} */}
  
          {/* <input type='text' onChange={handeltest}/> */}
  
          <br />
          <div className='done'>
            <button id={"Cremove" + id} className="Cremove" onClick={remove}>刪除</button>
            <button id={"Cdone" + id} className="Cdone" onClick={(e)=>{doneC(e,options[id])}}>完成</button>
          </div>
        </div>
        allQuestions.push(oneQue);
      }
  
    }
  
  
    return (
      <div id='questions'>
        {allQuestions}
      </div>
    )
  }
  
  export default Question
  