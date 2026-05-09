import React from "react";
import { useTranslation } from "react-i18next";
import { Search, Loader2, UserCheck, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useInitialInformationStore } from "../store/initialInformation.store";

const AssistantSearch: React.FC = () => {
  const { t } = useTranslation();
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{t("initialInformation.search.title")}</CardTitle>
        <CardDescription>{t("initialInformation.search.helpText")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder={t("initialInformation.search.placeholder")}
              value={searchIdentification}
              onChange={(e) => setSearchIdentification(e.target.value)}
              disabled={isSearching}
            />
          </div>
          <Button type="submit" disabled={isSearching}>
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
          <Alert variant="destructive">
            <AlertTitle>{t("common.error")}</AlertTitle>
            <AlertDescription>{searchError}</AlertDescription>
          </Alert>
        )}

        {!isSearching && mode === "update" && foundAssistant && (
          <Alert variant="default" className="border-green-500">
            <UserCheck className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-700">
              {t("initialInformation.search.found")}
            </AlertTitle>
            <AlertDescription>
              {foundAssistant.assistant.names} {foundAssistant.assistant.lastNames}
            </AlertDescription>
          </Alert>
        )}

        {!isSearching && mode === "create" && !foundAssistant && (
          <Alert>
            <UserPlus className="h-4 w-4" />
            <AlertTitle>{t("initialInformation.search.newRecord")}</AlertTitle>
            <AlertDescription>
              {t("initialInformation.search.notFound")}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default AssistantSearch;
