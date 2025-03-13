import { MessageSquare } from "lucide-react";

const Navbar = () => {
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
            Sign Up
          </a>
          <a href="/signin" className="btn">
            Sign In
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
