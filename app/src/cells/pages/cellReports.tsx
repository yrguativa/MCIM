import React, { useEffect, useMemo } from 'react';
import { FileText } from 'lucide-react';

import TableComponent from '@/src/app/components/TableComponent';
import { getReportColumns, CellReportRow } from '../components/reportColumnsTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useCellStore } from '../store/cell.store';
import { useDiscipleStore } from '@/src/disciples/store/disciple.store';
import { useMinistryStore } from '@/src/ministries/store/ministries.store';
import { useTranslation } from 'react-i18next';

const CellReports: React.FC = () => {
  const { t } = useTranslation();
  const cellsState = useCellStore(state => state.Cells);
  const getCells = useCellStore(state => state.getCells);
  const disciplesState = useDiscipleStore(state => state.Disciples);
  const getDisciples = useDiscipleStore(state => state.getDisciples);
  const ministries = useMinistryStore(state => state.ministries);
  const getMinistries = useMinistryStore(state => state.getMinistries);

  useEffect(() => {
    getCells();
    if (disciplesState.length === 0) getDisciples();
    if (ministries.length === 0) getMinistries();
  }, []);

  const reportRows: CellReportRow[] = useMemo(() => {
    const rows: CellReportRow[] = [];
    for (const cell of cellsState) {
      for (const record of (cell.records || [])) {
        rows.push({
          cellId: cell.id,
          cellLeader: cell.leader,
          cellDay: cell.day || '',
          cellTime: cell.time || '',
          cellAddress: cell.address || '',
          recordTopic: record.topic,
          recordDate: record.date,
          recordMode: record.mode || 'presencial',
          recordLocation: record.location || '',
          recordLeader: record.leader || cell.leader,
          assistantsCount: (record.assistants || []).length,
        });
      }
    }
    return rows.sort((a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime());
  }, [cellsState]);

  const totalRegistros = reportRows.length;
  const totalAsistentes = reportRows.reduce((sum, r) => sum + r.assistantsCount, 0);
  const presenciales = reportRows.filter(r => r.recordMode === 'presencial').length;
  const virtuales = reportRows.filter(r => r.recordMode === 'virtual').length;

  return (
    <>
      <div className="flex items-center mb-4">
        <h1 className="text-lg font-semibold md:text-2xl">{t('cells.report.title')}</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('cells.report.totalRecords')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalRegistros}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('cells.report.totalAttendees')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalAsistentes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('cells.report.presencial')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{presenciales}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('cells.report.virtual')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{virtuales}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-center text-start rounded-lg border border-dashed p-4 shadow-sm">
        <TableComponent
          data={reportRows}
          columns={getReportColumns(t)}
          getRowId={(row) => `${row.cellId}-${row.recordDate}`}
        />
      </div>
    </>
  );
};

export default CellReports;
