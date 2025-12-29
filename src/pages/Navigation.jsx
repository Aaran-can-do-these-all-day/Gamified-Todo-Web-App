import NavigationCards from "../components/Navigation";
import TopNav from "../components/TopNav";
import { motion } from "framer-motion";

function Navigation() {
  return (
    <div className="relative min-h-screen bg-[#05030c] overflow-hidden">
      <div className="relative z-30">
        <TopNav />
      </div>

      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[680px] -translate-x-1/2 rounded-[999px] bg-gradient-to-r from-cyan-500/25 via-purple-500/25 to-pink-500/25 blur-[140px]" />
        <div className="absolute bottom-[-120px] left-0 h-[360px] w-[360px] rounded-full bg-cyan-500/15 blur-[160px]" />
        <div className="absolute bottom-[-140px] right-0 h-[400px] w-[480px] rounded-full bg-purple-500/20 blur-[170px]" />
        <div className="absolute bottom-[-180px] left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-[999px] bg-gradient-to-r from-amber-500/18 via-fuchsia-500/18 to-cyan-500/18 blur-[180px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.2),rgba(5,3,12,0))]" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold tracking-[0.6em] text-white/35">
            SYSTEM DIRECTIVES
          </p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-black tracking-[0.35em] bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_14px_50px_rgba(168,85,247,0.35)]">
            NAVIGATION
          </h1>
          <p className="mt-4 text-sm uppercase tracking-[0.5em] text-white/60">
            ナビゲーション
          </p>
        </motion.div>

        <NavigationCards />
      </div>
    </div>
  );
}

export default Navigation;
