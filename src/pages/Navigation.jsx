import NavigationCards from "../components/Navigation";
import TopNav from "../components/TopNav";
import { motion } from "framer-motion";

function Navigation() {
  return (
    <div className="min-h-screen">
      <TopNav />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
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