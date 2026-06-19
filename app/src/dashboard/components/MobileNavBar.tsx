import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, Users, Package, Package2, LineChart } from "lucide-react";

const links = [
  { to: "/", icon: Home, labelKey: "menu.dashboardShort" },
  { to: "/disciples", icon: Users, labelKey: "menu.disciples" },
  { to: "/cells", icon: Package, labelKey: "menu.cells" },
  { to: "/cells/reports", icon: LineChart, labelKey: "menu.cellReports" },
  { to: "/ministries", icon: Package2, labelKey: "menu.ministries" },
];

const MobileNavBar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="mx-5 mb-6">
        <div className="flex items-center justify-around h-16 rounded-[28px] border border-border/30 bg-background/10 px-3 shadow-lg backdrop-blur-[20px] supports-[backdrop-filter]:bg-background/5">
          {links.map(({ to, icon: Icon, labelKey }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-1.5 text-[10px] font-medium transition-all min-w-0 flex-1 ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute -top-1.5 left-1/2 h-1 w-6 -translate-x-1/2 rounded-full bg-primary" />
                  )}
                  <Icon className="h-5 w-5" />
                  <span className="truncate max-w-full">{t(labelKey)}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default MobileNavBar;
