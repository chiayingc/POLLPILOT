import React,{useState} from "react";
// import ListPage from "./components/ListPage.js";
// import HomePage from "./components/HomePage.js";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import DashBoardPage from "./pages/DashBoardPage";
import AddNewPage from "./pages/AddNewPage";
import AddQuesPage from "./pages/AddQuesPage";
import ReleasePage from "./pages/ReleasePage";
import FillInPage from "./pages/FillInPage";
import ThanksPage from "./pages/ThanksPage";
import ResultPage from "./pages/ResultPage";
import { UserContext } from "./helper/Context";

import Test from './pages/Test';


function App() {

    const [user, setUser] = useState({});

    return (
        <div>
            {/* <Navbar/> */}
            <UserContext.Provider value={{ user, setUser }}>
                <Routes>

                    {/* 要改成個別uid的路徑 */}
                    <Route path="/dashboard" element={<DashBoardPage />} />
                    {/* 要加問卷號碼path   */}
                    <Route path="/addnew" element={<AddNewPage />} />
                    <Route path="/addques" element={<AddQuesPage />} />
                    <Route path="/release" element={<ReleasePage />} />
                    <Route path="/release/:survey" element={<ReleasePage />} />

                    <Route path="/fillin" element={<FillInPage />} />
                    <Route path="/fillin/:fillin/:fillin" element={<FillInPage />} />

                    <Route path="/thanks" element={<ThanksPage />} />
                    <Route path="/thanks/:thanks/:thanks" element={<ThanksPage />} />

                    <Route path="/result/:result" element={<ResultPage />} />

                    <Route path="/" element={<HomePage />} />
                    {/* <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/signin" element={<SignInPage />} /> */}
                    <Route path="/signup" element={<Test sign={"signup"}/>} />
                    <Route path="/signin" element={<Test sign={"signin"}/>} />
                    <Route path="/test" element={<Test />} />

                    {/* <Route path="/list" element={ <ListPage/> }/> */}
                </Routes>
            </UserContext.Provider>
        </div>
    );
}

export default App;