import React from "react";
import { GalleryVerticalEnd, CalendarDays, Home, LineChart, Package, Package2, ShoppingCart, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FormationSchoolMenu from "@/src/formation-school/components/FormationSchoolMenu";

const MenuMovil: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="hidden border-r bg-muted/40 md:block sticky top-0 h-screen">
      <div className="flex h-full flex-col gap-2">
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <span className="font-semibold text-lg">{t("AppTitle")}</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <NavLink
              to="/"
              className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-primary ${isActive ? 'bg-muted ' : ''}`}
            >
              <Home className="h-4 w-4" />
              {t('menu.dashboard')}
            </NavLink>
            <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
              <ShoppingCart className="h-4 w-4" />
              Reuniones Asistencia
              <Badge className="ml-auto flex shrink-0 items-center justify-center rounded-full">
                Comming soon
              </Badge>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <LineChart className="h-4 w-4" />
              EF MCIM
              <Badge className="ml-auto flex shrink-0 items-center justify-center rounded-full">
                Comming soon
              </Badge>
            </a>
            <FormationSchoolMenu />
            <NavLink to="/cells" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-primary ${isActive ? 'bg-muted ' : ''}`}>
              <Package className="h-4 w-4" />
              {t('menu.cells')}
            </NavLink>
            <NavLink to="/events" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isActive ? 'bg-muted ' : ''}`}>
              <CalendarDays className="h-4 w-4" />
              {t('menu.events')}
            </NavLink>
            <NavLink to="/disciples" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isActive ? 'bg-muted ' : ''}`}>
              <Users className="h-4 w-4" />
              {t('menu.disciples')}
            </NavLink>

            <NavLink to="/ministries" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isActive ? 'bg-muted ' : ''}`}>
              <Package2 className="h-4 w-4" />
              {t('menu.ministries')}
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default MenuMovil;