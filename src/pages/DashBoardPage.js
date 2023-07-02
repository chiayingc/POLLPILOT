import React, { useState, useEffect, useContext } from 'react'
import Navbar from '../components/Navbar'
import '../styles/DashBoardPage.css'
import { auth, db } from '../../firebase-config.js'
import { doc, collection, setDoc, getDocs, getDoc, query, where, onSnapshot } from 'firebase/firestore'
import {
  onAuthStateChanged
} from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../helper/Context'
import share from '../assets/share.png'
import edit from '../assets/edit.png'

function DashBoardPage() {
  const navigate = useNavigate();
  const [surveyList, setSurveyList] = useState([]);
  const [userData, setuserData] = useState([]);
  const [condition, setCondition] = useState([0, 1, 2]);
  let useruid = "";
  let userdata = [];

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        useruid = currentUser.uid;
        const getUser = doc(db, "users", useruid);
        await getDoc(getUser)
          .then((data) => {
            userdata = []
            userdata.push(data.data().uid,
              data.data().name,
              data.data().email,
              data.data().usermark);
          });
        setuserData(userdata);
        const surveys = collection(db, "surveys");
        const userSurveys = query(surveys,
          where("creator", "==", userdata[3]),
          where("Settings.status", "in", condition));
        const getdata = onSnapshot(
          userSurveys, (snapshot) => {
            let surveyList = [];
            snapshot.forEach((doc) => {
              let settings = doc.data().Settings;
              surveyList.push({ ...settings, id: doc.id, name: settings.name, serial: settings.serial, showNum: settings.showNum, status: settings.status, thanksText: settings.thanksText, welcomeText: settings.welcomeText, key: settings.key });
              surveyList.filter((survey) => { condition.includes(survey.status); });
            });
            const userSurveys = document.querySelector("#user_surveys");
            if (userSurveys) {
              if (surveyList == '') {
                userSurveys.className = "user_surveys_hide";
              }
              else {
                userSurveys.className = "user_surveys";
              }
            }
            setSurveyList(surveyList);
          });
        return getdata
      } else {
        navigate("/signin");
      }
    });
  }, [condition]);

  function Survey(props) {
    let thesur =
      <div id={'userSurvey' + props.id} className='eachSurvey'>
        <p className='survey_name'><Link to={"/result/" + props.id}>{props.name}</Link></p>
        <div className='survey_btn'>
          <img src={share} className='share_icon' onClick={(e) => { e.stopPropagation(); navigate("/fillin/" + props.serial) }} />
          <img src={edit} className='edit_icon' onClick={(e) => { e.stopPropagation(); navigate("/edit/" + props.serial) }} />
        </div>
      </div>
    return thesur;

  }

  function handleSelectChanged(status) {
    switch (status) {
      case "all":
        setCondition([0, 1, 2]);
        break;
      case "open":
        setCondition([0]);
        break;
      case "key":
        setCondition([1]);
        break;
      case "close":
        setCondition([2]);
        break;
    }
  }


  return (
    <div id='dashboardpage'>
      <Navbar type={1} />
      <div id='dashboardpage_main'>
        <div id='dashboardpage_main_left'>
          <div>
          </div>
        </div>
        <div id='dashboardpage_main_right'>
          <p id='dashboard_title'>我的問卷</p>
          <div id='dashboard_arrangement'>
            <select defaultValue="all" onChange={(e) => { handleSelectChanged(e.target.value) }}>
              <option value="all" disabled>問卷狀態</option>
              <option value="all">全部</option>
              <option value="open">開放</option>
              <option value="key">密碼</option>
              <option value="close">關閉</option>
            </select>
          </div>
          <div id="dashboard_addnew" onClick={() => {
            navigate("/addnew", {
              state: userData
            });
          }}>
            <div>
              <p>建立新問卷</p>
            </div>
          </div>

          <div id='user_surveys' className='user_surveys'>
            {surveyList.map((sur, index) => <Survey key={index} id={sur.id} name={sur.name} serial={sur.serial} condition={condition} />)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashBoardPage
