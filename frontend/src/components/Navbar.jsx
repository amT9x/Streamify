import useAuthUser from "../hooks/useAuthUser";
import { Link, useLocation } from "react-router";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

const NavBar = () => {
    const { authUser } = useAuthUser();
    const location = useLocation();
    const isChatPage = location.pathname?.startsWith("/chat");

    const {logoutMutation} = useLogout();

    return (
        <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-end w-full">
                    {/* Logo - only in chat page */}
                    {isChatPage && (
                        <div className="pl-5">
                            <Link to="/" className="flex items-center gap-2.5">
                                <ShipWheelIcon className="size-9 text-primary" />
                                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wide">Streamify</span>
                            </Link>
                        </div>
                    )}

                    {/* Notification */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Link to="/notifications">
                            <button className="btn btn-ghost btn-circle">
                                <BellIcon className="size-5 text-base-content opacity-70" />
                            </button>
                        </Link>
                    </div>

                    {/* Theme */}
                    <ThemeSelector />

                    {/* User Avatar */}
                    <div className="avatar">
                        <div className="w-9 rounded-full">
                            <img src={authUser?.profilePicture} alt="User Avatar" />
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button onClick={logoutMutation} className="btn btn-ghost btn-circle">
                        <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
                    </button>

                </div>
            </div>
        </nav>
    )
}

export default NavBar