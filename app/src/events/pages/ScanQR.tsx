import React from 'react';
import { useTranslation } from 'react-i18next';

import { useRegisterEventHook } from '../hooks/registerEventHook';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BadgeAlert, CalendarDays, CalendarSearch, Contact, LoaderCircle, MapPinCheckInside, NotebookPen, Search, Users } from 'lucide-react';

import { EventRegisterConfirmModal } from '../components/EventRegisterConfirmModal';
import { PersonNotFoundEvent } from '../components/PersonNotFoundEvent';

import './ScanQR.css';

const ScanQR: React.FC = () => {
  const { t } = useTranslation();
  const { 
    scanError, scanData,
    form, onSearchDisciple, isLoadingSearch, attandance,
    onRegisterEvent, isLoadingRegister, isOpenModalRegister, onCloseConfirmModal
  } = useRegisterEventHook();

  return (
    <div className="container mx-auto p-4">
      <Card className="p-4">
        <h1 className="text-2xl font-bold mb-2">{t('events.registerInEvent')}</h1>
        <p className="mb-3">{t('events.eventRegisterInstructions')}</p>

        <div className="flex flex-col md:flex-row justify-between gap-4">
          <Card className={"p-3 mb-6 md:min-h-full md:mb-0" + (scanData ? " border-green-500" : "")}>
            <p className="text-sm mb-4 flex text-justify">
              <span className={"p-1 mr-1 border-3 rounded-full text-lg flex items-center justify-center font-bold w-20 max-h-20" + (scanData ? " border-green-500 text-green-500" : "border-slate-400 text-slate-400")}>1</span>
              {t('events.eventRegisterStep1')}
            </p>

            <div>
              <div id="qr-reader" className="w-full max-w-sm mx-auto"></div>
            </div>

            {scanError && (
              <div className="text-red-500 mb-4">{scanError}</div>
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

            {attandance && (!scanData || scanData == null) && (
              <Alert variant="destructive" className="bg-red-500 text-white mt-2">
                <AlertDescription>
                  <BadgeAlert className='inline' width={18} /> {t('events.messageScanQR')}
                </AlertDescription>
              </Alert>
            )}
          </Card>

          <Card className={"p-3 md:min-h-full" + (attandance ? " border-green-500" : "")}>
            <p className="text-sm mb-4 flex text-justify">
              <span className={"p-1 mr-1 border-3 rounded-full text-lg flex items-center justify-center font-bold w-20 max-h-20" + (attandance ? " border-green-500 text-green-500" : "border-slate-400 text-slate-400")}>2</span>
              {t('events.eventRegisterStep2')}
            </p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSearchDisciple)} className="space-y-4">
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
                {!attandance && (
                  <Button
                    type="submit"
                    disabled={!form.formState.isValid || isLoadingSearch}
                    className="w-full"
                  >
                    {isLoadingSearch ? <LoaderCircle className="animate-spin" /> : <Search />}
                    {t('common.search')}
                  </Button>
                )}

                {attandance && (
                  <div className="p-3 bg-muted rounded-lg">
                    <h3 className="font-bold text-lg mb-2">{t('events.regiterEvent.discipleFound')}:</h3>
                    <p className="grid grid-cols-[minmax(100px,_2fr)_3fr] gap-1 text-sm text-start">
                      <strong>
                        <Contact className="inline mr-1" />
                        {t('events.regiterEvent.name')}:
                      </strong>
                      <span>
                        {attandance.name} {attandance.lastName}
                      </span>

                      <strong>
                        <Users className="inline mr-1" />
                        {t('events.regiterEvent.ministerio')}:
                      </strong>
                      <span>
                        {attandance.ministry}
                      </span>
                    </p>
                  </div>
                )}
              </form>
            </Form>
          </Card>
        </div>

        {scanData && attandance && (
          <Button
            type="button"
            disabled={scanData == null || !attandance || isLoadingRegister}
            className="w-full mt-4 bg-green-500 hover:bg-green-600 focus:bg-green-700"
            onClick={onRegisterEvent}
          >
            {isLoadingRegister ? <LoaderCircle className="animate-spin" /> : <NotebookPen />}
            {t('events.registerAttendance')}
          </Button>
        )}
      </Card>
      <PersonNotFoundEvent />
      <EventRegisterConfirmModal isOpenModal={isOpenModalRegister} onModalClose={onCloseConfirmModal} fullName={attandance?.name + ' ' + attandance?.lastName} />
    </div >
  );
};

export default ScanQR;