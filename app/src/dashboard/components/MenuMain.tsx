import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import * as Avatar from "@radix-ui/react-avatar";
import { NavLink } from "react-router-dom";
import { CalendarDays, Home, Languages, LineChart, Menu, Package, Package2, Search, Users } from "lucide-react";
import { useAuthStore } from "@/src/app/stores";
import { useTranslation } from "react-i18next";

const getInitials = (name: string | null | undefined): string => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

const getColorFromName = (name: string | null | undefined): string => {
    if (!name) return "#6366f1";
    const colors = [
        "#ef4444", "#f97316", "#f59e0b", "#84cc16", "#22c55e",
        "#14b8a6", "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6",
        "#a855f7", "#d946ef", "#ec4899", "#f43f5e"
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

const MenuMain: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { user :userState, logout} = useAuthStore();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'es' : 'en';
        i18n.changeLanguage(newLang);
    };
    return (
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col gap-2 p-4">
                    <div className="flex h-14 items-center -mx-2 px-2 lg:h-[60px]">
                        <a href="/" className="flex items-center gap-2 font-semibold">
                            <Package2 className="h-6 w-6" />
                            <span>App Administración</span>
                        </a>
                    </div>
                    <nav className="grid items-start text-sm font-medium">
                        <NavLink
                            to="/"
                            className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${isActive ? 'bg-muted text-primary' : 'text-muted-foreground hover:text-primary'}`}
                        >
                            <Home className="h-4 w-4" />
                            {t('menu.dashboard')}
                        </NavLink>
                        <NavLink
                            to="/cells"
                            className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${isActive ? 'bg-muted text-primary' : 'text-muted-foreground hover:text-primary'}`}
                        >
                            <Package className="h-4 w-4" />
                            {t('menu.cells')}
                        </NavLink>
                        <NavLink
                            to="/cells/reports"
                            className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${isActive ? 'bg-muted text-primary' : 'text-muted-foreground hover:text-primary'}`}
                        >
                            <LineChart className="h-4 w-4" />
                            {t('menu.cellReports')}
                        </NavLink>
                        <NavLink
                            to="/events"
                            className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${isActive ? 'bg-muted text-primary' : 'text-muted-foreground hover:text-primary'}`}
                        >
                            <CalendarDays className="h-4 w-4" />
                            {t('menu.events')}
                            <Badge className="ml-auto flex shrink-0 items-center justify-center rounded-full">Proximamente</Badge>
                        </NavLink>
                        <NavLink
                            to="/disciples"
                            className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${isActive ? 'bg-muted text-primary' : 'text-muted-foreground hover:text-primary'}`}
                        >
                            <Users className="h-4 w-4" />
                            {t('menu.disciples')}
                        </NavLink>
                        <NavLink
                            to="/ministries"
                            className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${isActive ? 'bg-muted text-primary' : 'text-muted-foreground hover:text-primary'}`}
                        >
                            <Package2 className="h-4 w-4" />
                            {t('menu.ministries')}
                        </NavLink>
                    </nav>
                </SheetContent>
            </Sheet>
            <div className="w-full flex-1">
                <form>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search products..."
                            className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                        />
                    </div>
                </form>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full">
                        {userState?.photoURL ? (
                            <Avatar.Root className="flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
                                <Avatar.Image
                                    src={userState.photoURL}
                                    alt={userState?.displayName || "User Avatar"}
                                    className="h-full w-full object-cover"
                                />
                                <Avatar.Fallback
                                    className="flex h-full w-full items-center justify-center rounded-full text-white text-sm font-medium"
                                    style={{ backgroundColor: getColorFromName(userState?.displayName) }}
                                >
                                    {getInitials(userState?.displayName)}
                                </Avatar.Fallback>
                            </Avatar.Root>
                        ) :
                            (
                                <Avatar.Root className="flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
                                    <Avatar.Fallback
                                        className="flex h-full w-full items-center justify-center rounded-full text-white text-sm font-medium"
                                        style={{ backgroundColor: getColorFromName(userState?.displayName) }}
                                    >
                                        {getInitials(userState?.displayName)}
                                    </Avatar.Fallback>
                                </Avatar.Root>
                            )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Mi cuenta {userState?.displayName}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Configuraciones</DropdownMenuItem>
                    <DropdownMenuItem>Support</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={toggleLanguage} className="flex items-center gap-2">
                        <Languages className="h-4 w-4" />
                        {i18n.language === 'en' ? '🇪🇸 Español' : '🇬🇧 English'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>{t('menu.logout')}</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}

export default MenuMain;