import PlayerCard from "../components/PlayerCard";
import RadarChart from "../components/RadarChart";
import SystemPanel from "../components/SystemPanel";
import TopNav from "../components/TopNav";
import { motion } from "framer-motion";

function Dashboard() {
  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-5 py-4 sm:py-5 md:py-6 md:transform md:scale-[0.96] lg:scale-[0.94] md:origin-top">
        <div className="relative mb-6 sm:mb-8 md:mb-10 mt-1 sm:mt-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-6 xl:gap-7">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full"
            >
              <div className="mb-3 mt-1 text-center">
                <h2 className="font-display text-2xl sm:text-3xl md:text-[2.4rem] font-bold tracking-wider bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  PLAYER
                </h2>
              </div>
              <PlayerCard />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full"
            >
              <div className="mb-3 mt-1 text-center">
                <h2 className="font-display text-2xl sm:text-3xl md:text-[2.4rem] font-bold tracking-wider bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  STATISTICS
                </h2>
                <p className="mt-1 text-[10px] text-gray-500 tracking-widest uppercase">
                  "THE SYSTEM USES ME, AND I USE THE SYSTEM"
                </p>
              </div>
              <RadarChart />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full"
            >
              <div className="mb-3 mt-1 text-center">
                <h2 className="font-display text-2xl sm:text-3xl md:text-[2.4rem] font-bold tracking-wider bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  SYSTEM
                </h2>
              </div>
              <SystemPanel />
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
