import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  CheckCircle,
  Globe,
  Loader2,
  Lock,
  OctagonX,
  Smartphone,
  Share,
  Download,
  User,
  IdCard,
  Fingerprint,
  Phone,
  Mail,
  Building2,
  Check,
} from "lucide-react";

import { useAuthStore } from "@/src/app/stores";
import { usePWAInstall } from "@/src/app/hooks/usePWAInstall";
import { useMinistryStore } from "@/src/ministries/store/ministries.store";
import { DisciplesService } from "@/src/disciples/services/disciples.services";
import { useDiscipleStore } from "@/src/disciples/store/disciple.store";
import type { DiscipleFull } from "@/src/disciples/models/disciple";

const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "La contraseña actual es obligatoria"),
    newPassword: z
      .string()
      .min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(1, "Debe confirmar la contraseña"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const { user: userState } = useAuthStore();
  const pwa = usePWAInstall();
  const { ministries, getMinistries } = useMinistryStore();
  const { updateDiscipleFull, isSaving } = useDiscipleStore();

  const [activeTab, setActiveTab] = useState("general");
  const [discipleFull, setDiscipleFull] = useState<DiscipleFull | null>(null);
  const [loadingDisciple, setLoadingDisciple] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const providerLabel =
    userState?.authProvider === "google"
      ? "Google"
      : userState?.authProvider === "apple"
        ? "Apple"
        : "Email";

  useEffect(() => {
    if (!isOpen) return;
    if (ministries.length === 0) getMinistries();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !userState?.discipleId || activeTab !== "profile") return;
    const load = async () => {
      setLoadingDisciple(true);
      const full = await DisciplesService.getDiscipleFull(
        userState.discipleId!,
      );
      setDiscipleFull(full);
      setLoadingDisciple(false);
    };
    load();
  }, [isOpen, activeTab, userState?.discipleId]);

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(ChangePasswordSchema as any),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleChangePassword = async (data: ChangePasswordFormData) => {
    if (!userState?.id) return;
    setSavingPassword(true);
    try {
      const { AuthService } = await import(
        "@/src/public/services/auth.services"
      );
      const service = new AuthService();
      await service.changePassword(
        userState.id,
        data.currentPassword,
        data.newPassword,
      );
      toast(t("settings.passwordUpdated"), {
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      });
      passwordForm.reset();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error";
      toast(message || t("settings.passwordError"), {
        icon: <OctagonX className="h-4 w-4 text-red-500" />,
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!discipleFull?.disciple || !userState?.discipleId) return;
    const d = discipleFull.disciple;
    const success = await updateDiscipleFull(
      userState.discipleId,
      {
        ...d,
        updatedUser: userState.id,
        updatedDate: new Date(),
      } as unknown as Record<string, unknown>,
      {},
    );
    if (success) {
      toast(t("settings.profileUpdated"), {
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      });
    } else {
      toast(t("settings.profileError"), {
        icon: <OctagonX className="h-4 w-4 text-red-500" />,
      });
    }
  };

  const SectionIcon = ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div
      className={
        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 " +
        (className || "bg-primary/10 text-primary")
      }
    >
      {children}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[640px] max-h-[85vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl">{t("settings.title")}</DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general" className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4" /> {t("settings.general")}
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" /> {t("settings.profile")}
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2 text-sm">
                <Lock className="h-4 w-4" /> {t("settings.security")}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* General */}
          <TabsContent value="general" className="px-6 pb-6 pt-4 space-y-6">
            <div className="flex items-start gap-4">
              <SectionIcon>
                <Globe className="h-5 w-5" />
              </SectionIcon>
              <div className="flex-1 space-y-3">
                <div>
                  <p className="font-medium text-sm">{t("settings.language")}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={i18n.language === "es" ? "default" : "outline"}
                    className="flex items-center gap-2 justify-start h-11"
                    onClick={() => i18n.changeLanguage("es")}
                  >
                    <span className="text-base">🇪🇸</span>
                    <span className="flex-1 text-left">{t("settings.spanish")}</span>
                    {i18n.language === "es" && (
                      <Check className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant={i18n.language === "en" ? "default" : "outline"}
                    className="flex items-center gap-2 justify-start h-11"
                    onClick={() => i18n.changeLanguage("en")}
                  >
                    <span className="text-base">🇬🇧</span>
                    <span className="flex-1 text-left">{t("settings.english")}</span>
                    {i18n.language === "en" && (
                      <Check className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="border-t" />

            <div className="flex items-start gap-4">
              <SectionIcon className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
                <Smartphone className="h-5 w-5" />
              </SectionIcon>
              <div className="flex-1 space-y-3">
                <div>
                  <p className="font-medium text-sm">{t("settings.installApp")}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {t("settings.installDescription")}
                  </p>
                </div>

                {pwa.isInstalled ? (
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    {t("settings.installed")}
                  </div>
                ) : pwa.platform === "ios" ? (
                  <div className="rounded-lg border bg-muted/40 p-4 space-y-3">
                    <ol className="flex flex-col gap-2.5 text-sm">
                      <li className="flex items-start gap-2.5">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary font-medium text-xs shrink-0 mt-0.5">
                          1
                        </span>
                        <span>
                          Toca el botón <strong>Compartir</strong>{" "}
                          <Share className="inline w-3.5 h-3.5 -mt-0.5" /> en
                          la barra inferior de Safari
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary font-medium text-xs shrink-0 mt-0.5">
                          2
                        </span>
                        <span>
                          Desplázate y toca{" "}
                          <strong>Agregar a la pantalla de inicio</strong>
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary font-medium text-xs shrink-0 mt-0.5">
                          3
                        </span>
                        <span>
                          Toca <strong>Agregar</strong> en la esquina superior
                          derecha
                        </span>
                      </li>
                    </ol>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs w-full text-muted-foreground"
                      onClick={pwa.resetDismiss}
                    >
                      Mostrar recordatorio al inicio
                    </Button>
                  </div>
                ) : pwa.platform === "android" ? (
                  <Button
                    onClick={() => {
                      pwa.resetDismiss();
                      pwa.install();
                    }}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    {t("settings.installButton")}
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Abre esta página en tu dispositivo móvil para instalar la
                    aplicación.
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Perfil */}
          <TabsContent value="profile" className="px-6 pb-6 pt-4">
            {loadingDisciple ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : discipleFull?.disciple ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <SectionIcon className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                    <IdCard className="h-5 w-5" />
                  </SectionIcon>
                  <div>
                    <p className="font-medium text-sm">
                      {discipleFull.disciple.name}{" "}
                      {discipleFull.disciple.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {discipleFull.disciple.email}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <IdCard className="h-3 w-3" />
                      {t("disciples.fields.identificationType")}
                    </p>
                    <Select
                      value={
                        discipleFull.disciple.identificationType || "CC"
                      }
                      onValueChange={(val) =>
                        setDiscipleFull((prev) =>
                          prev
                            ? {
                                ...prev,
                                disciple: {
                                  ...prev.disciple,
                                  identificationType: val,
                                },
                              }
                            : prev,
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CC">CC</SelectItem>
                        <SelectItem value="TI">TI</SelectItem>
                        <SelectItem value="CE">CE</SelectItem>
                        <SelectItem value="PPT">PPT</SelectItem>
                        <SelectItem value="PASSPORT">Pasaporte</SelectItem>
                        <SelectItem value="OTHER">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Fingerprint className="h-3 w-3" />
                      {t("disciples.identification")}
                    </p>
                    <Input
                      value={discipleFull.disciple.identification || ""}
                      onChange={(e) =>
                        setDiscipleFull((prev) =>
                          prev
                            ? {
                                ...prev,
                                disciple: {
                                  ...prev.disciple,
                                  identification: e.target.value,
                                },
                              }
                            : prev,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {t("disciples.names")}
                    </p>
                    <Input
                      value={discipleFull.disciple.name || ""}
                      onChange={(e) =>
                        setDiscipleFull((prev) =>
                          prev
                            ? {
                                ...prev,
                                disciple: {
                                  ...prev.disciple,
                                  name: e.target.value,
                                },
                              }
                            : prev,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {t("disciples.lastName")}
                    </p>
                    <Input
                      value={discipleFull.disciple.lastName || ""}
                      onChange={(e) =>
                        setDiscipleFull((prev) =>
                          prev
                            ? {
                                ...prev,
                                disciple: {
                                  ...prev.disciple,
                                  lastName: e.target.value,
                                },
                              }
                            : prev,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {t("disciples.phone")}
                    </p>
                    <Input
                      value={discipleFull.disciple.phone || ""}
                      onChange={(e) =>
                        setDiscipleFull((prev) =>
                          prev
                            ? {
                                ...prev,
                                disciple: {
                                  ...prev.disciple,
                                  phone: e.target.value,
                                },
                              }
                            : prev,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {t("disciples.email")}
                    </p>
                    <Input
                      value={discipleFull.disciple.email || ""}
                      onChange={(e) =>
                        setDiscipleFull((prev) =>
                          prev
                            ? {
                                ...prev,
                                disciple: {
                                  ...prev.disciple,
                                  email: e.target.value,
                                },
                              }
                            : prev,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {t("disciples.fields.ministry")}
                    </p>
                    <Select
                      value={discipleFull.disciple.ministryId}
                      onValueChange={(val) =>
                        setDiscipleFull((prev) =>
                          prev
                            ? {
                                ...prev,
                                disciple: {
                                  ...prev.disciple,
                                  ministryId: val,
                                },
                              }
                            : prev,
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("auth.selectMinistry")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {ministries.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="w-full h-10"
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      {t("common.save")}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
                <User className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  {t("common.noData")}
                </p>
              </div>
            )}
          </TabsContent>

          {/* Seguridad */}
          <TabsContent value="security" className="px-6 pb-6 pt-4">
            <div className="flex items-start gap-4 mb-4">
              <SectionIcon className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                <Lock className="h-5 w-5" />
              </SectionIcon>
              <div>
                <p className="font-medium text-sm">
                  {userState?.authProvider === "email"
                    ? t("settings.changePassword")
                    : t("settings.accountInfo")}
                </p>
              </div>
            </div>

            {userState?.authProvider === "email" ? (
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(handleChangePassword)}
                  className="space-y-4"
                >
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5">
                          <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                          {t("settings.currentPassword")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5">
                          <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                          {t("settings.newPassword")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5">
                          <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                          {t("auth.confirmPassword")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={savingPassword}
                    className="w-full"
                  >
                    {savingPassword ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {t("settings.changePassword")}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="text-center py-8 space-y-3 rounded-lg border bg-muted/30">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-muted">
                  <Lock className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  {t("settings.noPasswordAccount", {
                    provider: providerLabel,
                  })}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
