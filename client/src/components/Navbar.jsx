import { MessageSquare, User, LogOut, Settings } from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  return (
    <header className="navbar bg-base-100 shadow-md">
      <div className="navbar-start">
        <a href="/" className="btn btn-ghost text-xl">
          <MessageSquare className="text-primary" />
          <span className="font-semibold">SE Chat</span>
        </a>
      </div>
      <div className="navbar-end">
        <div className="gap-2">
          <a href="/signup" className="btn">
            <Settings className="size-4" /> Settings
          </a>
          {authUser && (
            <>
              <a href="/profile" className="btn">
                <User className="size-4" />
                Profile
              </a>
              <button className="btn">
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
