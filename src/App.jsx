// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import Navbar from "./components/Navbar";
import RequireAuth from "./components/RequireAuth";
import ThemeInit from "./components/ThemeInit";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Home from "./pages/Home";
import Services from "./pages/Services";
import RubricBbs from "./pages/RubricBbs";
import BbDetail from "./pages/BbDetail";
import Profile from "./pages/Profile";
import Search from "./pages/Search";

import { meThunk } from "./features/auth/authSlice";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(meThunk());
  }, [dispatch]);

  return (
    <>
      <ThemeInit />
      <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 transition-colors">
        <Navbar />

        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected */}
          <Route
            path="/app"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="/app/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="/app/services"
            element={
              <RequireAuth>
                <Services />
              </RequireAuth>
            }
          />

          {/* NEW: rubrics -> bbs */}
          <Route
            path="/app/rubrics/:id"
            element={
              <RequireAuth>
                <RubricBbs />
              </RequireAuth>
            }
          />

          {/* NEW: bbs detail */}
          <Route
            path="/app/bbs/:id"
            element={
              <RequireAuth>
                <BbDetail />
              </RequireAuth>
            }
          />

          {/* NEW: search */}
          <Route
            path="/app/search"
            element={
              <RequireAuth>
                <Search />
              </RequireAuth>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}
