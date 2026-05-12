import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="border-b border-white/8 bg-ink bg-opacity-40 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex min-w-0 items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-white/12 bg-gradient-to-br from-[#e1bf79] via-gold to-[#a17b2f] text-ink shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset,0_12px_28px_rgba(214,181,109,0.16)] transition-all duration-300 group-hover:scale-[1.04] group-hover:border-gold group-hover:border-opacity-50 group-hover:shadow-[0_0_0_1px_rgba(255,255,255,0.14)_inset,0_16px_34px_rgba(214,181,109,0.24)]">
            <Sparkles size={18} />
          </div>
          <span className="truncate font-display text-[1.35rem] font-semibold tracking-[0.02em] text-[#f7f2e8] transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-[#fff8ed] group-hover:via-gold group-hover:to-[#fff8ed] group-hover:bg-clip-text group-hover:text-transparent">
            Populens
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to={user ? "/dashboard" : "/login"}
            className="inline-flex h-10 items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 text-sm text-cream opacity-85 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-cream"
          >
            {user ? "Dashboard" : "Login"}
          </Link>
          <Link
            to={user ? "/dashboard" : "/register"}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-gold px-4 text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(214,181,109,0.22)] hover:brightness-105"
          >
            {user ? "Open Platform" : "Get Started"}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
