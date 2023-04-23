import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CheckAuth from "./components/CheckAuth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TrackAdding from "./pages/TrackAdding";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/track-add" element={<TrackAdding />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<CheckAuth />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
