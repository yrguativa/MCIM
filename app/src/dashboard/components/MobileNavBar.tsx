import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, Package, Users, Package2, LineChart } from "lucide-react";

const links = [
  { to: "/", icon: Home, labelKey: "menu.dashboard" },
  { to: "/disciples", icon: Users, labelKey: "menu.disciples" },
  { to: "/cells", icon: Package, labelKey: "menu.cells" },
  { to: "/cells/reports", icon: LineChart, labelKey: "menu.cellReports" },
  { to: "/ministries", icon: Package2, labelKey: "menu.ministries" },
];

const MobileNavBar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-white/20 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl safe-area-bottom"
      style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.08)' }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {links.map(({ to, icon: Icon, labelKey }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 min-w-0 px-2 py-1 rounded-xl transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground/60 hover:text-muted-foreground"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`rounded-full p-1.5 transition-colors ${isActive ? "bg-primary/10" : ""}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-medium leading-none truncate max-w-full">
                  {t(labelKey)}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavBar;
