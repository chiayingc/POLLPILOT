import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import '../styles/DashBoardPage.css'
import { auth } from '../../firebase-config.js'
import {
  onAuthStateChanged
} from 'firebase/auth'
import { Link } from 'react-router-dom'

function DashBoardPage() {
  const [user, setUser] = useState({});
  const [url, setUrl] = useState("/signin");

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
       if (currentUser) {
        setUrl("/addnew");
      } else {
        setUrl("/signin");
      }
    });
  }, []);

  return (
    <div id='dashboardpage'>
      <Navbar/>
      <div id='dashboardpage_main'>
        <div id='dashboardpage_main_left'>
            <input type="text" placeholder="搜尋問卷標題"/>
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
                    <p><Link to={url}>建立新問卷</Link></p>
                </div>
                
                {/* <div>
                    空白問卷
                </div>
                <div>
                    精選範本
                </div> */}
            </div>
            

        </div>
      </div>
        
    </div>
  )
}

export default DashBoardPage
