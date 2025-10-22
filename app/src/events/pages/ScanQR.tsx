import React from 'react';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useTranslation } from 'react-i18next';
import { useRegisterEventHook } from '../hooks/registerEventHook';
import { EventRegisterConfirmModal } from '../components/EventRegisterConfirmModal';
import { PersonNotFoundEvent } from '../components/PersonNotFoundEvent';

import { useMinistryStore } from '@/src/ministries/store/ministries.store';

const ScanQR: React.FC = () => {
  const { t } = useTranslation();
  const { ministries } = useMinistryStore();

  const { error, scanData, form, onSubmit } = useRegisterEventHook();

  return (
    <div className="container mx-auto p-4">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">{t('events.registerInEvent')}</h1>

        <div className="mb-6">
          <div id="qr-reader" className="w-full max-w-sm mx-auto"></div>
        </div>

        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}

        {scanData && (
          <div className="mb-4 p-4 bg-muted rounded-lg">
            <h3 className="font-bold text-lg mb-2">{t('events.scanEvent')}:</h3>
            <p><strong>{t('disciples.name')}:</strong> {scanData.event}</p>
            <p><strong>{t('events.dateStart')}:</strong> {new Date(scanData.date).toLocaleString()}</p>
            <p><strong>{t('events.location')}:</strong> {scanData.location}</p>
          </div>
        )}

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

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('disciples.names')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('validation.enter') + t('validation.masculinePronoun').toLocaleLowerCase() + ' ' + t('disciples.name').toLowerCase()} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('disciples.lastName')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('validation.enter') + t('validation.neuterPronoun').toLocaleLowerCase() + ' ' + t('disciples.lastName').toLowerCase()} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ministryId"
              render={({ field }) => (
                <FormItem >
                  <FormLabel>{t('ministries.ministry')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={field.value ? ministries.find((m) => m.id === field.value)?.name : t('events.selectMinistry')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {
                        Array.isArray(ministries) && ministries.length > 0 && (
                          ministries.map((ministry) => (
                            <SelectItem value={ministry.id} key={ministry.id}> {ministry.name}</SelectItem>
                          ))
                        )
                      }
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('disciples.phone')}</FormLabel>
                  <FormControl>
                    <Input placeholder="3243432434" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!form.formState.isValid && !scanData && (
              <div className="text-red-500 mb-4">{t('events.messageScanQR')}</div>
            )}

            <Button
              type="submit"
              disabled={!scanData || !form.formState.isValid}
              className="w-full"
            >
              {t('events.registerAttendance')}
            </Button>
          </form>
        </Form>
      </Card>

      <EventRegisterConfirmModal/>
      <PersonNotFoundEvent/>
    </div>
  );
};

export default ScanQR;