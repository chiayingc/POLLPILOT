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
  const { user, setUser } = useContext(UserContext);
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
            // console.log(data.data());
            userdata = []
            userdata.push(data.data().uid,
              data.data().name,
              data.data().email,
              data.data().usermark);
          });
        setuserData(userdata);
        console.log(userdata);

        const surveys = collection(db, "surveys");
        const userSurveys = query(surveys,
          where("creator", "==", userdata[3]),
          where("Settings.status", "in", condition));
        const getdata = onSnapshot(
          userSurveys, (snapshot) => {
            let surveyList = [];
            snapshot.forEach((doc) => {
              let settings = doc.data().Settings;
              //let version=doc.data().version; // 編輯問卷時要用版本
              // console.log(settings); //doc.data()  ->所有問卷內容 ;   doc.id ->所有問卷名稱
              surveyList.push({ ...settings, id: doc.id, name: settings.name, serial: settings.serial, showNum: settings.showNum, status: settings.status, thanksText: settings.thanksText, welcomeText: settings.welcomeText, key: settings.key });
              surveyList.filter((survey) => { condition.includes(survey.status); });
            });
            // console.log(condition);
            // console.log(surveyList);
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
            console.log(surveyList);
          });
        return getdata
      } else {
        navigate("/signin");
      }
    });
  }, [condition]);


  function Survey(props) {
    // console.log(props);

    //這邊要新增編輯問卷的選項(可以去編輯,也可以去看結果)
    let thesur =
      <div id={'userSurvey' + props.id} className='eachSurvey'>
        {/* // 這邊要調整一下路徑 看resultpage要怎麼取得data */}
        {/* onClick={() => { navigate("/result/" + props.id); }}> */}
        {/* <p className='survey_name'>{props.name}</p> */}
        <p className='survey_name'><Link to={"/result/" + props.id}>{props.name}</Link></p>
        <div className='survey_btn'>
          <img src={share} className='share_icon' onClick={(e) => { e.stopPropagation(); navigate("/fillin/" + props.serial) }} />
          <img src={edit} className='edit_icon' onClick={(e) => { e.stopPropagation(); navigate("/edit/" + props.serial) }} />
        </div>
        {/* <p>{props.serial}</p> */}
      </div>
    return thesur;

  }

  function handleSelectChanged(status) {
    // console.log("e:",e);
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
    // console.log(condition);
  }


  return (
    <div id='dashboardpage'>
      <Navbar type={2} />
      <div id='dashboardpage_main'>
        <div id='dashboardpage_main_left'>
          {/* <input type="text" placeholder="搜尋問卷標題" /> */}
          {/* <label>
                <img src='https://cdn-icons-png.flaticon.com/512/8915/8915520.png'/>
            </label> */}
          <div>
            {/* <p>問卷群組</p> */}
            {/* <img />+ */}
          </div>

          {/* <button>我的問卷</button> */}
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
            {/* <select>
              <option>
                最新建立日期
              </option>
            </select> */}
          </div>
          <div id="dashboard_addnew" onClick={() => {
            navigate("/addnew", {
              state: userData
            });
          }}>
            {/* <div onClick={() => {
              navigate("/addnew", {
                state: userData
              });
            }}> */}
            <div>
              {/* <img/> */}+
              {/* <p><Link to={user ? "/addnew" : "/signin"}>建立新問卷</Link></p> */}
              <p>建立新問卷</p>
            </div>

            {/* <div>
                    空白問卷
                </div>
                <div>
                    精選範本
                </div> */}
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
