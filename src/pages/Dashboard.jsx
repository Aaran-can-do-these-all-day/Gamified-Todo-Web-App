import PlayerCard from "../components/PlayerCard";
import RadarChart from "../components/RadarChart";
import SystemPanel from "../components/SystemPanel";
import NavigationCards from "../components/Navigation";
import TopNav from "../components/TopNav";
import { motion } from "framer-motion";

function Dashboard() {
  return (
    <div className="min-h-screen">
      <TopNav />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="relative mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-max">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="mb-3 text-center">
                <h2 className="font-display text-3xl md:text-4xl font-bold tracking-wider bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  PLAYER
                </h2>
              </div>
              <PlayerCard />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="mb-3 text-center">
                <h2 className="font-display text-3xl md:text-4xl font-bold tracking-wider bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  STATISTICS
                </h2>
              </div>
              <RadarChart />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="mb-3 text-center">
                <h2 className="font-display text-3xl md:text-4xl font-bold tracking-wider bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  SYSTEM
                </h2>
              </div>
              <SystemPanel />
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.6em] text-white/35">
              SYSTEM DIRECTIVES
            </p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-black tracking-[0.35em] bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_14px_50px_rgba(168,85,247,0.35)]">
              NAVIGATION
            </h2>
            <p className="mt-4 text-sm uppercase tracking-[0.5em] text-white/60">
              ??
            </p>
          </div>
          <NavigationCards />
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;
