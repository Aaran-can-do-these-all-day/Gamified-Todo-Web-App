import { NavLink } from "react-router-dom";
import { Home, Compass, Gift } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  {
    path: "/",
    label: "Dashboard",
    icon: Home,
    activeClass: "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50",
    inactiveClass: "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10",
  },
  {
    path: "/navigation",
    label: "Navigation",
    icon: Compass,
    activeClass: "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/50",
    inactiveClass: "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10",
  },
  {
    path: "/rewards",
    label: "Rewards",
    icon: Gift,
    activeClass: "bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-lg shadow-amber-500/50",
    inactiveClass: "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10",
  },
];

function TopNav() {
  return (
    <div className="sticky top-0 z-40 bg-dark-900/95 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center gap-3 h-14">
          {navItems.map((item, index) => (
            <NavLink key={item.path} to={item.path} className="relative outline-none">
              {({ isActive }) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 17,
                    delay: index * 0.1 
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-xs uppercase tracking-[0.2em] transition-colors duration-300 ${
                    isActive ? item.activeClass : item.inactiveClass
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </motion.div>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TopNav;
