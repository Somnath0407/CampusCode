import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LogOut, ShieldCheck } from "lucide-react";
import { logoutUser } from "../store/authSlice";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const result = await dispatch(logoutUser());
        if (!result.error) {
            toast.success("Logged out");
            navigate("/login");
        } else {
            toast.error("Logout failed");
        }
    };

    const initials = user ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() : "";

    return (
        <div className="navbar sticky top-0 z-30 bg-base-200/90 backdrop-blur border-b border-base-300 px-4 lg:px-8 shadow-sm">
            <div className="flex-1">
                <Link
                    to={user?.role === "admin" ? "/admin" : "/problems"}
                    className="text-xl font-extrabold flex items-center gap-2 tracking-tight"
                >
                    <Logo size={34} className="shadow-md shadow-primary/20 rounded-xl" />
                    <span className="brand-gradient">CampusCode</span>
                </Link>
            </div>
            <div className="flex-none flex items-center gap-3">
                <ThemeToggle />
                {user && user.role === "admin" && (
                    <span className="badge badge-primary badge-outline gap-1 capitalize hidden sm:inline-flex font-medium">
                        <ShieldCheck size={13} /> Admin
                    </span>
                )}
                {user && (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-sm normal-case gap-2 pl-1.5 pr-3">
                            {user.avatar ? (
                                <span className="avatar">
                                    <span className="rounded-full w-7 h-7">
                                        <img src={user.avatar} alt={user.firstName} referrerPolicy="no-referrer" />
                                    </span>
                                </span>
                            ) : (
                                <span className="avatar placeholder">
                                    <span className="bg-linear-to-br from-accent to-primary text-primary-content rounded-full w-7 h-7 grid place-items-center text-xs font-bold">
                                        {initials || "U"}
                                    </span>
                                </span>
                            )}
                            {user.firstName}
                        </div>
                        <div tabIndex={0} className="dropdown-content flex flex-col gap-1 bg-base-200 border border-base-300 rounded-box z-10 mt-3 w-56 p-2 shadow-xl">
                            <div className="flex items-center gap-2 px-3 py-2 text-xs text-base-content/60">
                                <LogOut size={15} className="shrink-0 invisible" />
                                <span className="truncate">{user.email}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-3 py-2 rounded-field text-error text-sm hover:bg-base-300"
                            >
                                <LogOut size={15} className="shrink-0" /> Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
