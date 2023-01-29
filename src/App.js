import React from "react";
// import ListPage from "./components/ListPage.js";
// import HomePage from "./components/HomePage.js";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import DashBoardPage from "./pages/DashBoardPage";
import AddNewPage from "./pages/AddNewPage";


function App() {
    return (
        <div>
            {/* <Navbar/> */}
            
            <Routes>
            
                {/* 要改成個別uid的路徑 */}
                <Route path="/dashboard" element={ <DashBoardPage/> } />  
                <Route path="/addnew" element={ <AddNewPage/> } />
                <Route path="/" element={ <HomePage/> } />
                <Route path="/signup" element={ <SignUpPage/> } />
                <Route path="/signin" element={ <SignInPage/> } />

                {/* <Route path="/list" element={ <ListPage/> }/> */}
            </Routes>
        </div>
    );
}

export default App ;