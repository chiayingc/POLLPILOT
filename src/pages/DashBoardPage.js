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


function DashBoardPage() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  // const [surveyList, setSurveyList]=useState([]);
  let surveyList = [];
  let useruid = "";
  let shortUid = "";
  let userData = [];
  // const [shortUid, setShortUid]=useState("");

  // const [user, setUser] = useState({});

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      // console.log(currentUser);
      if (currentUser) {
        useruid = currentUser.uid;

        const getUser = doc(db, "users", useruid);
        await getDoc(getUser)
          .then((data) => {
            // console.log("userData:", data.data()); 
            // console.log(data.data().uid);
            // console.log(data.data().registTime);
            userData = []
            userData.push(data.data().uid,
              data.data().name,
              data.data().email,
              data.data().usermark);
          });
        // console.log(userData);

        const surveys = collection(db, "surveys");
        const userSurveys = query(surveys, where("creater", "==", userData[3]));
        // console.log(userSurveys);
        const test = onSnapshot(
        userSurveys, (snapshot) => {
          snapshot.forEach((doc) => {
            console.log(doc.data()); //doc.data()  ->所有問卷內容 ;   doc.id ->所有問卷名稱
            //         surveyList.push({ ...doc.data(),id:doc.data().id, name: doc.data().name, serial: doc.data().serial });
          });
        });
        return test
          // const surveysData=await getDocs(userSurveys);
          // surveysData.forEach(async (doc) => {
          //   console.log(doc.id);
          // });


          // shortUid=
          // setShortUid(currentUser.uid.substring(0,4));
          //   // console.log("HERE");

          //   const showSurvey = onSnapshot(
          //     collection(db, "allUsers", "user_" + currentUser.uid.substring(0,4), "userSurveys"), (snapshot) => {
          //       snapshot.forEach((doc) => {
          //         // console.log(doc.data());
          //         surveyList.push({ ...doc.data(),id:doc.data().id, name: doc.data().name, serial: doc.data().serial });
          //       });
          //       // setSurveyList(surveyList);
          //     });
          //   return showSurvey;

        } else {
          navigate("/signin");
        }
      });
  }, []);


  function Survey(props) {

    let thesur =
      <div id={'userSurvey' + props.id}
        onClick={() => { navigate("/result/" + props.serial + "survey" + props.id) }}>
        <p>{props.name}</p>
        {/* <p>{props.serial}</p> */}
      </div>
    return thesur;

  }


  return (
    <div id='dashboardpage'>
      <Navbar type={2} />
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
            <div onClick={() => {
              navigate("/addnew", {
                state: userData
              });
            }}>
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
            {surveyList.map((sur, index) => <Survey key={index} id={sur.id} name={sur.name} serial={sur.serial} />)}
          </div>


        </div>
      </div>

    </div>
  )
}

export default DashBoardPage
