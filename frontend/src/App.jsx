import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { checkAuth } from "./store/authSlice";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import ProblemSolve from "./pages/ProblemSolve";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCreateProblem from "./pages/AdminCreateProblem";
import AdminUpdateProblem from "./pages/AdminUpdateProblem";
import AdminCreateAdmin from "./pages/AdminCreateAdmin";

const Root = () => {
    const { isAuthenticated, authChecked, user } = useSelector((state) => state.auth);
    if (!authChecked) {
        return (
            <div className="flex h-screen items-center justify-center bg-base-100">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }
    if (isAuthenticated) {
        return <Navigate to={user?.role === "admin" ? "/admin" : "/problems"} replace />;
    }
    return <Landing />;
};

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    return (
        <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/problems" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path="/problem/:id" element={<ProtectedRoute><ProblemSolve /></ProtectedRoute>} />

            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/create" element={<AdminRoute><AdminCreateProblem /></AdminRoute>} />
            <Route path="/admin/update/:id" element={<AdminRoute><AdminUpdateProblem /></AdminRoute>} />
            <Route path="/admin/create-admin" element={<AdminRoute><AdminCreateAdmin /></AdminRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
