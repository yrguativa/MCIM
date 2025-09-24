import React from "react";
import { Bell, CalendarDays, Home, LineChart, Package, Package2, ShoppingCart, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MenuMovil: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <a href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span >App Administración</span>
          </a>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
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
              <Badge className="ml-auto flex  shrink-0 items-center justify-center rounded-full">
                Comming soon
              </Badge>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <LineChart className="h-4 w-4" />
              EF MCIM
              <Badge className="ml-auto flex  shrink-0 items-center justify-center rounded-full">
                Comming soon
              </Badge>
            </a>
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
        <div className="mt-auto p-4">
          <Card x-chunk="dashboard-02-chunk-0">
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle>Upgrade to Pro</CardTitle>
              <CardDescription>
                Unlock all features and get unlimited access to our support
                team.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
              <Button size="sm" className="w-full">
                Upgrade
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>)
}

export default MenuMovil;