import React, { useState } from "react";
// import ListPage from "./components/ListPage.js";
// import HomePage from "./components/HomePage.js";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import DashBoardPage from "./pages/DashBoardPage";
import AddNewPage from "./pages/AddNewPage";
import AddQuesPage from "./pages/AddQuesPage";
import ReleasePage from "./pages/ReleasePage";
import FillInPage from "./pages/FillInPage";
import ThanksPage from "./pages/ThanksPage";
import ResultPage from "./pages/ResultPage";
// import { UserContext } from "./helper/Context";

import Signpage from './pages/Signpage';
import TestDB from "./pages/TestDB";
import Quiz from "./pages/Quiz";
import ClosePage from "./pages/ClosePage";


function App() {

    const [user, setUser] = useState({});

    return (
        <div>
            {/* <Navbar/> */}
            {/* <UserContext.Provider value={{ user, setUser }}> */}
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/dashboard" element={<DashBoardPage />} />
                    <Route path="/addnew" element={<AddNewPage />} />
                    <Route path="/addques" element={<AddQuesPage />} />
                    <Route path="/release/:release" element={<ReleasePage />} />
                    <Route path="/fillin/:fillin" element={<FillInPage />} />
                    <Route path="/thanks/:thanks" element={<ThanksPage />} />
                    <Route path="/result/:result" element={<ResultPage />} />
                    <Route path="/signup" element={<Signpage sign={"signup"} />} />
                    <Route path="/signin" element={<Signpage sign={"signin"} />} />
                    <Route path="/close" element={<ClosePage />} />
                    {/* <Route path="/test" element={<Signpage />} /> */}
                    {/* 測試資料庫 */}
                    {/* <Route path="/testDB" element={<TestDB />} /> */}
                    <Route path="/test" element={<Quiz />} />
                </Routes>
            {/* </UserContext.Provider> */}
        </div>
    );
}

export default App;