import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, Users, Package, Package2, LineChart } from "lucide-react";

const links = [
  { to: "/", icon: Home, labelKey: "menu.dashboard" },
  { to: "/disciples", icon: Users, labelKey: "menu.disciples" },
  { to: "/cells", icon: Package, labelKey: "menu.cells" },
  { to: "/cells/reports", icon: LineChart, labelKey: "menu.cellReports" },
  { to: "/ministries", icon: Package2, labelKey: "menu.ministries" },
];

const MobileNavBar = React.forwardRef<HTMLDivElement>((_, ref) => {
  const { t } = useTranslation();

  return (
    <div
      ref={ref}
      data-config={JSON.stringify({
        blurAmount: 0.4,
        refraction: 0.25,
        chromAberration: 0.02,
        edgeHighlight: 0.08,
        specular: 0.12,
        fresnel: 0.7,
        distortion: 0.01,
        cornerRadius: 32,
        zRadius: 22,
        opacity: 0.95,
        saturation: -0.15,
        tintStrength: 0.15,
        brightness: 0.03,
        shadowOpacity: 0.35,
        shadowSpread: 20,
        shadowOffsetY: 4,
        floating: false,
        button: false,
        bevelMode: 0,
      })}
      className="fixed bottom-6 left-4 right-4 z-50 mx-auto max-w-[500px] rounded-[32px] md:hidden overflow-hidden bg-background/40"
    >
      <div className="relative z-10 flex items-center justify-around h-16 px-2 pb-1">
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
                <div className={`rounded-full p-1.5 transition-colors ${isActive ? "bg-primary/15" : ""}`}>
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
    </div>
  );
});

MobileNavBar.displayName = "MobileNavBar";

export default MobileNavBar;
