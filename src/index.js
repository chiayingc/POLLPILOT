// console.log("hello webpack3");

import React from "react";
import App from "./App.js";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

const body = document.body;
const body_root = createRoot(body);
body_root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </React.StrictMode>
);