import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CheckAuth from "./components/CheckAuth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TrackAdding from "./pages/TrackAdding";

function App() {
  const userData = useSelector((store) => store.auth.data);
  return (
    <BrowserRouter>
      <Routes>
        {userData?.isAdmin && (
          <>
            <Route path="/track-add" element={<TrackAdding edit={false} />} />
            <Route path="/edit/:id" element={<TrackAdding edit={true} />} />
          </>
        )}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<CheckAuth />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
