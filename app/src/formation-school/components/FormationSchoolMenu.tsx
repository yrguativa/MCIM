import React from "react";
import {
  BarChart3,
  CalendarDays,
  CalendarClock,
  Building2,
  BookOpen,
  ClipboardList,
  Users,
  GraduationCap,
  QrCode,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  to?: string;
  children?: MenuItem[];
}

const FormationSchoolMenu: React.FC = () => {
  const { t } = useTranslation();

  const menuItems: MenuItem[] = [
    {
      label: t('menu.dashboard') || "Dashboard",
      icon: <BarChart3 className="h-4 w-4" />,
      to: "/formation-school/dashboard",
    },
    {
      label: "Administración",
      icon: <ClipboardList className="h-4 w-4" />,
      children: [
        {
          label: "Ciclos",
          icon: <CalendarDays className="h-4 w-4" />,
          to: "/formation-school/admin/cycles",
        },
        {
          label: "Niveles",
          icon: <GraduationCap className="h-4 w-4" />,
          to: "/formation-school/admin/levels",
        },
        {
          label: "Salones",
          icon: <Building2 className="h-4 w-4" />,
          to: "/formation-school/admin/classrooms",
        },
        {
          label: "Horarios",
          icon: <CalendarClock className="h-4 w-4" />,
          to: "/formation-school/admin/schedules",
        },
        {
          label: "Cursos",
          icon: <BookOpen className="h-4 w-4" />,
          to: "/formation-school/admin/courses",
        },
      ],
    },
    {
      label: "Inscripciones",
      icon: <Users className="h-4 w-4" />,
      children: [
        {
          label: "Inscribir Maestro",
          icon: <GraduationCap className="h-4 w-4" />,
          to: "/formation-school/enrollment/teacher",
        },
        {
          label: "Inscribir Estudiante",
          icon: <Users className="h-4 w-4" />,
          to: "/formation-school/enrollment/student",
        },
      ],
    },
    {
      label: "Maestros",
      icon: <GraduationCap className="h-4 w-4" />,
      children: [
        {
          label: "Mis Cursos",
          icon: <BookOpen className="h-4 w-4" />,
          to: "/formation-school/teacher/my-courses",
        },
        {
          label: "Registro de Asistencia",
          icon: <ClipboardList className="h-4 w-4" />,
          to: "/formation-school/teacher/attendance",
        },
        {
          label: "Generar QR",
          icon: <QrCode className="h-4 w-4" />,
          to: "/formation-school/teacher/qr",
        },
      ],
    },
    {
      label: "Estudiantes",
      icon: <Users className="h-4 w-4" />,
      children: [
        {
          label: "Mi Progreso",
          icon: <TrendingUp className="h-4 w-4" />,
          to: "/formation-school/student/progress",
        },
        {
          label: "Mis Cursos",
          icon: <BookOpen className="h-4 w-4" />,
          to: "/formation-school/student/my-courses",
        },
      ],
    },
  ];

  const renderMenuItem = (item: MenuItem, index: number) => {
    if (item.children) {
      return (
        <DropdownMenuSub key={index}>
          <DropdownMenuSubTrigger className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted transition-all">
            {item.icon}
            <span className="flex-1">{item.label}</span>
            <ChevronRight className="h-4 w-4 ml-auto" />
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-56">
            {item.children.map((child, childIndex) => (
              <DropdownMenuItem key={childIndex} asChild>
                <NavLink
                  to={child.to || "#"}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted transition-all cursor-pointer"
                >
                  {child.icon}
                  <span>{child.label}</span>
                </NavLink>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      );
    }

    return (
      <DropdownMenuItem key={index} asChild>
        <NavLink
          to={item.to || "#"}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted transition-all cursor-pointer"
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      </DropdownMenuItem>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted transition-all w-full justify-start"
        >
          <GraduationCap className="h-4 w-4" />
          <span className="flex-1 text-left">{t('formation-school.title')}</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            {renderMenuItem(item, index)}
            {index === 0 && <DropdownMenuSeparator />}
            {index === 1 && <DropdownMenuSeparator />}
            {index === 3 && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FormationSchoolMenu;
