import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chat from "./Pages/Chat";

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  </Router>,
  document.getElementById("root")
);
