import { NavLink } from "react-router-dom";
import Router from "./router/router";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100">
      <nav className="flex gap-4 justify-center py-8">
        <NavLink
          to="/ethereum"
          className={({ isActive }) =>
            [
              "px-6 py-2 rounded-xl font-semibold transition-all duration-200",
              "bg-white/80 shadow hover:bg-gradient-to-r hover:from-indigo-200 hover:to-purple-200 hover:text-indigo-700",
              isActive
                ? "bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 text-white shadow-lg scale-105"
                : "text-indigo-700"
            ].join(" ")
          }
        >
          Ethereum
        </NavLink>
        <NavLink
          to="/ethers"
          className={({ isActive }) =>
            [
              "px-6 py-2 rounded-xl font-semibold transition-all duration-200",
              "bg-white/80 shadow hover:bg-gradient-to-r hover:from-indigo-200 hover:to-purple-200 hover:text-indigo-700",
              isActive
                ? "bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 text-white shadow-lg scale-105"
                : "text-indigo-700"
            ].join(" ")
          }
        >
          Ethers
        </NavLink>
      </nav>
      <Router />
    </div>
  );
}

export default App;