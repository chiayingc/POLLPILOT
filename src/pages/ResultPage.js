import React, { useState, useEffect, useContext } from 'react'
import '../styles/ResultPage.css'
import { db } from '../../firebase-config.js'
import { doc, collection, getDoc, onSnapshot, query, where } from 'firebase/firestore'
import Navbar from '../components/Navbar'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function ResultPage() {
  let allAnswers = [];
  const [resultFinal, setResultFinal] = useState([]);
  let queSerials = [];  //紀錄所有題目編號
  let allAns = []; //紀錄整理各題所有答案
  let allQuestions = [];
  let tmpAry = location.pathname.split("/");
  let serial = tmpAry[tmpAry.length - 1];

  useEffect(() => {

    const getVersion = doc(db, "surveys", serial);
    getDoc(getVersion)
      .then((datadata) => {
        const answers = collection(db, "answers");
        const select = query(answers, where("surveySerial", "==", serial + datadata.data().version));
        onSnapshot(select, (querySnapshot) => {
          allAnswers = [];
          querySnapshot.forEach((doc) => {
            let data = doc.data();
            allAnswers.push(data.answer);
          });
          if (allAnswers[0] != undefined && allAnswers[0] != null) {
            console.log(allAnswers);
            let tmp = allAnswers.filter(object => Object.keys(object).length != 0);
            allAnswers = tmp;
            // if (Object.keys(allAnswers).length != 0) {
              queSerials = Object.keys(allAnswers[0]);
            // }
            allAns = [];
            allAnswers.forEach((obj) => {
              for (let j = 0; j < queSerials.length; j++) {
                if (allAns[queSerials[j]] == undefined) { allAns[queSerials[j]] = [] }
                allAns[queSerials[j]].push(obj[queSerials[j]]);
              }
            });
            console.log(allAns);

            const getVersion = doc(db, "surveys", serial);
            getDoc(getVersion)
              .then((data) => {
                const getQuestions = doc(db, "surveys", serial, "questions", "version" + datadata.data().version);
                getDoc(getQuestions)
                  .then((data) => {
                    // console.log(data.data());
                    // queTypes = data.data().questionsType;
                    allQuestions = data.data().questions;
                    let allContents = [];
                    let oneResult = [];
                    let key = 1;
                    let aResult = [];

                    for (let i = 0; i < allQuestions.length; i++) {
                      if (allQuestions[i].type == "A" || allQuestions[i].type == "B" || allQuestions[i].type == "F" || allQuestions[i].type == "J" || allQuestions[i].type == "G") {
                        oneResult = [];
                        if (allAns[allQuestions[i].queSerial] != undefined) {
                          for (let j = 0; j < allAns[allQuestions[i].queSerial].length; j++) { //第i題的所有回答
                            let oneAns = <p id={"q" + i + "a" + j} key={"q" + i + "a" + j} className="result_oneans_A">{allAns[allQuestions[i].queSerial][j]}</p>;    //因為是簡答題,取字串
                            oneResult.push(oneAns);
                          }
                        }
                        aResult = <div id={"q" + i} key={"q" + i} className="result_oneque_A">
                          {/* <h4>{i + 1}</h4> */}
                          <div id={"que" + i} key={"que" + i} className="result_que_A">{allQuestions[i].content}</div>
                          {oneResult}
                        </div>
                        allContents.push(aResult);
                        key += 1;
                      }
                      ////
                      if (allQuestions[i].type == "H" || allQuestions[i].type == "I") {
                        aResult = <div id={"q" + i} key={"q" + i} className="result_oneque_B">
                          <div id={"que" + i} key={"que" + i} className="result_que_B">{allQuestions[i].content}</div>
                        </div>
                        allContents.push(aResult);
                        key += 1;
                      }
                      if (allQuestions[i].type == "C" || allQuestions[i].type == "D") {
                        oneResult = [];
                        let count = new Array(allQuestions[i].options.length).fill(0);
                        for (let j = 0; j < allAns[allQuestions[i].queSerial].length; j++) {
                          for (let k = 0; k < allQuestions[i].options.length; k++) {
                            if (allAns[allQuestions[i].queSerial][j] == k) {
                              count[k] += 1;
                            }
                            if (allQuestions[i].type == "D") {
                              count = new Array(allQuestions[i].options.length).fill(0);
                              for (let j = 0; j < allAns[allQuestions[i].queSerial].length; j++) {
                                for (let l = 0; l < allAns[allQuestions[i].queSerial][j].length; l++) {
                                  if (allAns[allQuestions[i].queSerial][j][l] >= 0 && allAns[allQuestions[i].queSerial][j][l] < count.length) {
                                    count[allAns[allQuestions[i].queSerial][j][l]]++;
                                  }
                                }
                              }
                            }

                            data = {
                              labels: allQuestions[i].options,
                              datasets: [
                                {
                                  label: allQuestions[i].options[0],
                                  data: count,
                                  backgroundColor: [
                                    'rgba(255, 99, 132, 0.2)',
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(255, 206, 86, 0.2)',
                                    'rgba(75, 192, 192, 0.2)',
                                    'rgba(153, 102, 255, 0.2)',
                                    'rgba(255, 159, 64, 0.2)',
                                  ],
                                  borderColor: [
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 159, 64, 1)',
                                  ],
                                  borderWidth: 1,
                                },
                              ],
                            };
                          }
                          let oneAns = <p id={"q" + i + "a" + j} key={"q" + i + "a" + j} className="result_oneans_A">{allQuestions[i].options[allAns[allQuestions[i].queSerial][j]]}</p>;
                          oneResult.push(oneAns);
                        }
                        aResult = <div id={"q" + i} key={"q" + i} className="result_oneque_A">
                          {/* <h4>{i + 1}</h4> */}
                          <div id={"que" + i} key={"que" + i} className="result_que_A">{allQuestions[i].content}</div>
                          <div className='pie'>
                            <Pie data={data} />
                          </div>
                        </div>
                        allContents.push(aResult);
                        key += 1;
                      }
                    }
                    setResultFinal(allContents);
                  });
              })
              .catch(() => {
                //
              });
          }
        });
      });
  }, []);


  return (
    <div id='resultpage'>
      <Navbar type={1} />
      <div id='resultpage_content'>
        {resultFinal}
      </div>
    </div>
  )
}

export default ResultPage
