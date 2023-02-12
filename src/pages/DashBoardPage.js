import React, { useState, useEffect, useContext } from 'react'
import Navbar from '../components/Navbar'
import '../styles/DashBoardPage.css'
import { auth, db } from '../../firebase-config.js'
import { doc, collection, setDoc, getDocs, query, where, onSnapshot } from 'firebase/firestore'
import {
  onAuthStateChanged
} from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../helper/Context'


function DashBoardPage() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [surveyList, setSurveyList]=useState([]);
  // console.log(user);

  // const [user, setUser] = useState({});

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // console.log("HERE");
        let surveyList = [];
        const showSurvey = onSnapshot(
          collection(db, "allUsers", "user_" + currentUser.uid, "userSurveys"), (snapshot) => {
            snapshot.forEach((doc) => {
              // console.log(doc.data().name);
              surveyList.push({ ...doc.data(),id:doc.data().id, name: doc.data().name, serial: doc.data().serial });
            });
            setSurveyList(surveyList);
            console.log(surveyList);
          });
        return showSurvey;

      } else {
        navigate("/signin");
        // setLoggedIn(false);
      }
    });
  }, []);


  function Survey(props) {

      let thesur =
        <div id={'userSurvey'+props.id} 
                onClick={()=>{navigate("/result/"+props.serial)}}>
          <p>{props.name}</p>
          {/* <p>{props.serial}</p> */}
        </div>
      return thesur;
    
  }


  return (
    <div id='dashboardpage'>
      <Navbar />
      <div id='dashboardpage_main'>
        <div id='dashboardpage_main_left'>
          <input type="text" placeholder="搜尋問卷標題" />
          {/* <label>
                <img src='https://cdn-icons-png.flaticon.com/512/8915/8915520.png'/>
            </label> */}
          <div>
            <p>問卷群組</p>
            {/* <img /> */}+
          </div>
          <button>我的問卷</button>
        </div>
        <div id='dashboardpage_main_right'>
          <p id='dashboard_title'>我的問卷</p>
          <div id='dashboard_arrangement'>
            <select>
              <option>
                全部狀態
              </option>
            </select>
            <select>
              <option>
                最新建立日期
              </option>
            </select>
          </div>
          <div id="dashboard_addnew">
            <div>
              {/* <img/> */}+
              <p><Link to={user ? "/addnew" : "/signin"}>建立新問卷</Link></p>
            </div>

            {/* <div>
                    空白問卷
                </div>
                <div>
                    精選範本
                </div> */}
          </div>
          
          <div id='user_surveys' className='user_surveys'>
            {surveyList.map((sur, index) => <Survey key={index} id={sur.id} name={sur.name} serial={sur.serial} />)}
          </div>


        </div>
      </div>

    </div>
  )
}

export default DashBoardPage
