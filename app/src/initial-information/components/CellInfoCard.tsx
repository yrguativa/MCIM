import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import { MapPin, Clock, Calendar, Users, User, Home, Network, X, Plus } from 'lucide-react';
import {
  FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription,
} from '@/components/ui/form';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Neighborhood } from '@/src/cells/schemas/neighborhood.enum';
import { AddAttendeeModal } from '@/src/cells/components/AddAttendeeModal';

export const NETWORK_MAP: Record<string, number> = {
  WOMEN: 1,
  MEN: 2,
  PRE: 3,
  YOUTH: 5,
  ROCAS: 7,
};

const DAYS_OF_WEEK = [
  { value: 'Lunes', label: 'Lunes' },
  { value: 'Martes', label: 'Martes' },
  { value: 'Miércoles', label: 'Miércoles' },
  { value: 'Jueves', label: 'Jueves' },
  { value: 'Viernes', label: 'Viernes' },
  { value: 'Sábado', label: 'Sábado' },
  { value: 'Domingo', label: 'Domingo' },
];

interface CellInfoCardProps {
  assistants: { id: string; name: string; lastName: string }[];
  onAddAssistant: (a: { id: string; name: string; lastName: string }) => void;
  onRemoveAssistant: (id: string) => void;
}

const CellInfoCard: React.FC<CellInfoCardProps> = ({ assistants, onAddAssistant, onRemoveAssistant }) => {
  const { t } = useTranslation();
  const { control, setValue } = useFormContext();

  const network = useWatch({ control, name: 'network' }) as string | undefined;
  const directLeaderId = useWatch({ control, name: 'directLeaderId' }) as string | undefined;

  const [modalOpen, setModalOpen] = useState(false);

  const networkLabel = network
    ? t(`initialInformation.network.${network}`)
    : '';

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            {t("initialInformation.cellInfo.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="cellDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  {t("initialInformation.cellInfo.day")}
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("initialInformation.cellInfo.dayPlaceholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DAYS_OF_WEEK.map(d => (
                      <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="cellTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  {t("initialInformation.cellInfo.time")}
                </FormLabel>
                <FormControl>
                  <Input type="time" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium flex items-center gap-1.5">
              <Network className="h-3.5 w-3.5 text-muted-foreground" />
              {t("initialInformation.cellInfo.network")}
            </span>
            <div className="h-10 px-3 rounded-md border border-input bg-muted flex items-center text-sm text-muted-foreground">
              {networkLabel || '—'}
            </div>
          </div>

          <FormField
            control={control}
            name="cellAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  {t("initialInformation.cellInfo.address")}
                </FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="cellNeighborhood"
            render={({ field }) => {
              const selectedLabel = field.value
                ? Neighborhood.find(n => n.value === field.value)?.label
                : undefined;
              return (
                <FormItem className="flex flex-col">
                  <FormLabel className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    {t("initialInformation.cellInfo.neighborhood")}
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {selectedLabel || t("initialInformation.cellInfo.neighborhoodPlaceholder")}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandInput placeholder={t("initialInformation.cellInfo.neighborhoodSearch")} />
                        <CommandList>
                          <CommandEmpty>
                            {t("initialInformation.cellInfo.neighborhoodEmpty")}
                          </CommandEmpty>
                          <CommandGroup className="max-h-64 overflow-auto">
                            {Neighborhood.map(n => (
                              <CommandItem
                                key={n.value}
                                value={n.label}
                                onSelect={() => {
                                  setValue('cellNeighborhood', n.value, { shouldValidate: true });
                                }}
                              >
                                {n.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                {t("initialInformation.cellInfo.assistantsTitle")}
              </span>
              <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                {t("initialInformation.cellInfo.addAssistant")}
              </Button>
            </div>

            {assistants.length === 0 ? (
              <p className="text-sm text-muted-foreground py-3 text-center border rounded-md">
                {t("initialInformation.cellInfo.noAssistants")}
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("initialInformation.cellInfo.assistantName")}</TableHead>
                    <TableHead className="w-20">{t("initialInformation.cellInfo.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assistants.map(a => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{a.name} {a.lastName}</TableCell>
                      <TableCell>
                        <Button type="button" variant="ghost" size="sm" onClick={() => onRemoveAssistant(a.id)}>
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          <FormField
            control={control}
            name="cellHost"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  {t("initialInformation.cellInfo.host")}
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("initialInformation.cellInfo.hostPlaceholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {assistants.map(a => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name} {a.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  {t("initialInformation.cellInfo.hostFromAssistants")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="cellTimoteo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  {t("initialInformation.cellInfo.timoteo")}
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("initialInformation.cellInfo.timoteoPlaceholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {assistants.map(a => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name} {a.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  {t("initialInformation.cellInfo.timoteoFromAssistants")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <AddAttendeeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={onAddAssistant}
        cellLeaderId={directLeaderId || ''}
      />
    </>
  );
};

export default CellInfoCard;
