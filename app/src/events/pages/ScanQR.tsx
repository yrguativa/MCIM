import React from 'react';
import { useTranslation } from 'react-i18next';

import { useRegisterEventHook } from '../hooks/registerEventHook';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BadgeAlert, CalendarDays, CalendarSearch, Contact, MapPinCheckInside, Search, Users } from 'lucide-react';

import { EventRegisterConfirmModal } from '../components/EventRegisterConfirmModal';
import { PersonNotFoundEvent } from '../components/PersonNotFoundEvent';

import './ScanQR.css';

const ScanQR: React.FC = () => {
  const { t } = useTranslation();

  const { error, scanData, form, onSubmit, discipleSelected, ministryOfDisciple } = useRegisterEventHook();

  return (
    <div className="container mx-auto p-4">
      <Card className="p-4">
        <h1 className="text-2xl font-bold mb-2">{t('events.registerInEvent')}</h1>

        <p className="mb-3">{t('events.eventRegisterInstructions')}</p>

        <Card className={"p-3 mb-6" + (scanData ? " border-green-500" : "")}>
          <p className="text-sm mb-4 flex text-justify">
            <span className={"p-1 mr-1 border-3 rounded-full text-lg flex items-center justify-center font-bold w-20 max-h-20" + (scanData ? " border-green-500 text-green-500" : "border-slate-400 text-slate-400")}>1</span>
            {t('events.eventRegisterStep1')}
          </p>

          <div>
            <div id="qr-reader" className="w-full max-w-sm mx-auto"></div>
          </div>

          {error && (
            <div className="text-red-500 mb-4">{error}</div>
          )}

          {scanData && (
            <div className="p-3 bg-muted rounded-lg">
              <h3 className="font-bold text-lg mb-2">{t('events.scanEvent')}:</h3>
              <p className="grid grid-cols-[minmax(100px,_2fr)_3fr] gap-1 text-sm text-start">
                <strong>
                  <CalendarSearch className="inline mr-1" />
                  {t('disciples.name')}:
                </strong>
                <span>
                  {scanData.event}
                </span>
                <strong>
                  <CalendarDays className="inline mr-1" />
                  {t('events.date')}:
                </strong>
                <span>
                  {new Date(scanData.date).toLocaleString()}
                </span>
                <strong>
                  <MapPinCheckInside className="inline mr-1" />
                  {t('events.location')}:
                </strong>
                <span>
                  {scanData.location}
                </span>
              </p>
            </div>
          )}
        </Card>

        <Card className={"p-3" + (scanData != null && form.formState.isValid ? " border-green-500" : "")}>
          <p className="text-sm mb-4 flex text-justify">
            <span className={"p-1 mr-1 border-3 rounded-full text-lg flex items-center justify-center font-bold w-20 max-h-20" + (scanData && form.formState.isValid ? " border-green-500 text-green-500" : "border-slate-400 text-slate-400")}>2</span>
            {t('events.eventRegisterStep2')}
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="identification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('disciples.identification')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('validation.enter') + t('validation.femininePronoun').toLocaleLowerCase() + ' ' + t('disciples.identification').toLowerCase()} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!discipleSelected && (
                <Button
                  type="submit"
                  disabled={!form.formState.isValid}
                  className="w-full"
                >
                  <Search /> {t('common.search')}
                </Button>
              )}

              {discipleSelected && discipleSelected.identification && (
                <div className="p-3 bg-muted rounded-lg">
                  <h3 className="font-bold text-lg mb-2">{t('events.regiterEvent.discipleFound')}:</h3>
                  <p className="grid grid-cols-[minmax(100px,_2fr)_3fr] gap-1 text-sm text-start">
                    <strong>
                      <Contact className="inline mr-1" />
                      {t('events.regiterEvent.name')}:
                    </strong>
                    <span>
                      {discipleSelected.name} {discipleSelected.lastName}
                    </span>

                    <strong>
                      <Users className="inline mr-1" />
                      {t('events.regiterEvent.ministerio')}:
                    </strong>
                    <span>
                      {ministryOfDisciple}
                    </span>
                  </p>
                </div>
              )}

              {discipleSelected && (!scanData || scanData == null) && (
                <Alert variant="destructive" className="bg-red-500 text-white">
                  <AlertDescription>
                    <BadgeAlert className='inline' width={18} /> {t('events.messageScanQR')}
                  </AlertDescription>
                </Alert>
              )}
            </form>
          </Form>
        </Card>

        {scanData && form.formState.isValid && (
          <Button
            type="submit"
            disabled={!scanData || !form.formState.isValid}
            className="w-full mt-4"
          >

            {t('events.registerAttendance')}
          </Button>
        )}
      </Card>

      <EventRegisterConfirmModal />
      <PersonNotFoundEvent />
    </div >
  );
};

export default ScanQR;