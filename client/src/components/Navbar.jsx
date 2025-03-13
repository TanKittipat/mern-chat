import { MessageSquare, User, LogOut, Settings } from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  return (
    <header className="navbar bg-base-100 shadow-md fixed top-0">
      <div className="navbar-start">
        <a href="/" className="btn btn-ghost text-xl">
          <MessageSquare className="text-primary" />
          <span className="font-semibold">SE Chat</span>
        </a>
      </div>
      <div className="navbar-end">
        <div className="space-x-1.5">
          <a href="/settings" className="btn">
            <Settings className="size-4" /> Settings
          </a>
          {authUser && (
            <>
              <a href="/profile" className="btn">
                <User className="size-4" />
                Profile
              </a>
              <button className="btn" onClick={() => logout()}>
                <LogOut className="size-4" />
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
