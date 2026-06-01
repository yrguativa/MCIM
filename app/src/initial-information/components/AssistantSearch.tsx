import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Loader2, UserCheck, UserPlus, IdCard, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useInitialInformationStore } from "../store/initialInformation.store";

const AssistantSearch: React.FC = () => {
  const { t } = useTranslation();
  const [acceptHabeasData, setAcceptHabeasData] = useState(false);
  const {
    searchIdentification,
    setSearchIdentification,
    searchAssistant,
    isSearching,
    searchError,
    foundAssistant,
    mode,
  } = useInitialInformationStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchAssistant();
  };

  return (
    <Card className="shadow-lg border-t-4 border-t-primary transition-all hover:shadow-xl">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2 mb-1">
          <div className="bg-primary/10 p-2 rounded-full">
            <IdCard className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-lg md:text-xl">{t("initialInformation.search.title")}</CardTitle>
        </div>
        <CardDescription className="text-xs md:text-sm">
          {t("initialInformation.search.helpText")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-2 text-xs text-muted-foreground/70 w-full">
          <Shield className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <p className="text-balance leading-relaxed">
            {t("initialInformation.privacy.description")}
          </p>
        </div>

        <div className="flex items-start gap-2 rounded-lg border p-3">
          <Checkbox
            id="habeas-data"
            checked={acceptHabeasData}
            onCheckedChange={(checked) => setAcceptHabeasData(checked === true)}
            className="mt-0.5"
          />
          <Label htmlFor="habeas-data" className="text-xs leading-relaxed text-muted-foreground cursor-pointer">
            {t("initialInformation.search.habeasDataConsent")}
          </Label>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              placeholder={t("initialInformation.search.placeholder")}
              value={searchIdentification}
              onChange={(e) => setSearchIdentification(e.target.value)}
              disabled={isSearching}
              className="pl-9 h-11"
              autoFocus
            />
          </div>
          <Button type="submit" disabled={isSearching || !acceptHabeasData} size="lg" className="w-full sm:w-auto sm:min-w-[120px] transition-all active:scale-95">
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("initialInformation.search.searching")}
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                {t("initialInformation.search.button")}
              </>
            )}
          </Button>
        </form>

        {searchError && (
          <Alert variant="destructive" className="animate-in fade-in zoom-in-95 duration-200">
            <AlertTitle>{t("common.error")}</AlertTitle>
            <AlertDescription>{searchError}</AlertDescription>
          </Alert>
        )}

        {!isSearching && mode === "update" && foundAssistant && (
          <Alert variant="default" className="border-green-500 bg-green-50 dark:bg-green-950/20 animate-in fade-in zoom-in-95 duration-200">
            <UserCheck className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-700 dark:text-green-400">
              {t("initialInformation.search.found")}
            </AlertTitle>
            <AlertDescription className="text-green-600/80 dark:text-green-400/80">
              <span className="font-medium">
                {foundAssistant.disciple.name} {foundAssistant.disciple.lastName}
              </span>
              {" — "}
              {foundAssistant.disciple.identification}
            </AlertDescription>
          </Alert>
        )}

        {!isSearching && mode === "create" && !foundAssistant && (
          <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950/20 animate-in fade-in zoom-in-95 duration-200">
            <UserPlus className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-700 dark:text-blue-400">
              {t("initialInformation.search.newRecord")}
            </AlertTitle>
            <AlertDescription className="text-blue-600/80 dark:text-blue-400/80">
              {t("initialInformation.search.notFound")}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default AssistantSearch;
