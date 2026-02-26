import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Smartphone, 
  GraduationCap, 
  AlertTriangle, 
  Calendar,
  CheckCircle,
} from 'lucide-react';
import { DisciplesService } from '@/src/disciples/services/disciples.services';
import { FormationSchoolService } from '@/src/formation-school/services/formation-school.services';
import { useAuthStore } from '@/src/app/stores';
import { useTranslation } from 'react-i18next';

interface DiscipleData {
  id: string;
  name: string;
  lastName: string;
  phone?: string;
}

interface StudentData {
  id: string;
  discipleId: string;
  status: string;
}

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const userState = useAuthStore(state => state.user);
  const [disciplesData, setDisciplesData] = useState<DiscipleData[]>([]);
  const [studentsData, setStudentsData] = useState<StudentData[]>([]);
  const [activeCycle, setActiveCycle] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [disciples, studentsResult, cycleData] = await Promise.all([
        DisciplesService.getDisciples(),
        FormationSchoolService.getStudents(),
        FormationSchoolService.getActiveCycle()
      ]);
      setDisciplesData(disciples || []);
      setStudentsData(studentsResult?.students || []);
      setActiveCycle(cycleData?.activeCycle || null);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const stats = useMemo(() => {
    const totalDisciples = disciplesData.length;
    const disciplesWithPhone = disciplesData.filter(d => d.phone && d.phone.trim() !== '').length;
    const disciplesWithoutPhone = totalDisciples - disciplesWithPhone;
    const phonePercentage = totalDisciples > 0 ? Math.round((disciplesWithPhone / totalDisciples) * 100) : 0;
    
    const totalStudents = studentsData.length;
    const activeStudents = studentsData.filter(s => s.status === 'active').length;

    return {
      totalDisciples,
      disciplesWithPhone,
      disciplesWithoutPhone,
      phonePercentage,
      totalStudents,
      activeStudents
    };
  }, [disciplesData, studentsData]);

  const notifications = useMemo(() => {
    const notifs = [];
    
    if (stats.disciplesWithoutPhone > 0) {
      notifs.push({
        type: 'warning',
        title: t('dashboard.notifications.incompletePhoneRecords'),
        message: `${stats.disciplesWithoutPhone} ${t('dashboard.notifications.disciplesWithoutPhone')}`,
        icon: AlertTriangle,
        count: stats.disciplesWithoutPhone
      });
    }

    if (!activeCycle) {
      notifs.push({
        type: 'info',
        title: t('dashboard.notifications.noActiveCycle'),
        message: t('dashboard.notifications.noActiveCycleMessage'),
        icon: Calendar,
        count: 0
      });
    }

    if (notifs.length === 0) {
      notifs.push({
        type: 'success',
        title: t('dashboard.notifications.allUpToDate'),
        message: t('dashboard.notifications.allRecordsComplete'),
        icon: CheckCircle,
        count: 0
      });
    }

    return notifs;
  }, [stats, activeCycle, t]);

  const openPeepsImages = [
    'https://cdn.prod.website-files.com/5e51c674258ffe10d286d30a/5e535d68c6b2498a0c2cbf6a_peep-101.svg',
    'https://cdn.prod.website-files.com/5e51c674258ffe10d286d30a/5e53552ff5fa1a9d22f727e2_peep-35.svg',
    'https://cdn.prod.website-files.com/5e51c674258ffe10d286d30a/5e5355117488c21dec47cfba_peep-34.svg',
    'https://cdn.prod.website-files.com/5e51c674258ffe10d286d30a/5e535367f5fa1a2eedf59e1d_peep-23.svg',
    'https://cdn.prod.website-files.com/5e51c674258ffe10d286d30a/5e53523cf3aa4b6f462b2ec0_peep-17.svg',
  ];

  const getRandomPeep = () => {
    const seed = Math.floor(Math.random() * openPeepsImages.length);
    return openPeepsImages[seed];
  };

  const helloImageUrl = getRandomPeep();

  return (
    <div className="space-y-6">
      <div className="relative rounded-xl overflow-visible bg-white border-2 border-gray-100 p-6">
        <div className="flex items-end justify-between">
          <img 
            src={helloImageUrl} 
            alt="Welcome" 
            className="h-48 w-auto object-contain -mb-12 -ml-4"
          />
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {t('dashboard.hello')}, {userState?.displayName || t('dashboard.user')}!
            </h1>
            <p className="text-gray-500 text-xl">{t('dashboard.welcome')}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.stats.totalDisciples')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalDisciples}</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.stats.registeredInSystem')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.stats.phonesRegistered')}</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.disciplesWithPhone}</div>
            <p className="text-xs text-muted-foreground">{stats.phonePercentage}{t('dashboard.stats.percentageOfTotal')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.stats.studentsFormation')}</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">{stats.activeStudents} {t('dashboard.stats.active')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.stats.activeCycle')}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeCycle ? t('dashboard.stats.yes') : t('dashboard.stats.no')}</div>
            <p className="text-xs text-muted-foreground">{activeCycle?.name || t('dashboard.stats.noActiveCycle')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t('dashboard.charts.phoneDistribution')}</CardTitle>
            <CardDescription>{t('dashboard.charts.phoneDistributionDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-48">
              {stats.totalDisciples > 0 ? (
                <div className="flex items-center gap-8">
                  <div className="relative">
                    <svg width="150" height="150" viewBox="0 0 42 42" className="transform -rotate-90">
                      {(() => {
                        const percentage = stats.phonePercentage;
                        const angle = percentage * 3.6;
                        const startX = 21 + 15 * Math.cos(0);
                        const startY = 21 + 15 * Math.sin(0);
                        const endX = 21 + 15 * Math.cos((angle * Math.PI) / 180);
                        const endY = 21 + 15 * Math.sin((angle * Math.PI) / 180);
                        const largeArcFlag = angle > 180 ? 1 : 0;
                        const pathD = percentage === 100 
                          ? `M 21 6 A 15 15 0 1 1 20.99 6 Z`
                          : `M 21 21 L ${startX} ${startY} A 15 15 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
                        
                        return (
                          <>
                            <circle cx="21" cy="21" r="15" fill="transparent" stroke="#ef4444" strokeWidth="3" />
                            <path d={pathD} fill="#10b981" stroke="#fff" strokeWidth="1" />
                          </>
                        );
                      })()}
                      <circle cx="21" cy="21" r="10" fill="#fff" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-emerald-600">{stats.phonePercentage}%</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                      <span className="text-sm">{t('dashboard.charts.withPhone')}: {stats.disciplesWithPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-500"></div>
                      <span className="text-sm">{t('dashboard.charts.withoutPhone')}: {stats.disciplesWithoutPhone}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">{t('dashboard.noData')}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>{t('dashboard.charts.formationSchoolStatus')}</CardTitle>
            <CardDescription>{t('dashboard.charts.formationSchoolStatusDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-48">
              {stats.totalStudents > 0 ? (
                <div className="flex items-center gap-8">
                  <div className="relative">
                    <svg width="150" height="150" viewBox="0 0 42 42" className="transform -rotate-90">
                      {(() => {
                        const activePercentage = stats.totalStudents > 0 
                          ? Math.round((stats.activeStudents / stats.totalStudents) * 100) 
                          : 0;
                        const angle = activePercentage * 3.6;
                        const startX = 21 + 15 * Math.cos(0);
                        const startY = 21 + 15 * Math.sin(0);
                        const endX = 21 + 15 * Math.cos((angle * Math.PI) / 180);
                        const endY = 21 + 15 * Math.sin((angle * Math.PI) / 180);
                        const largeArcFlag = angle > 180 ? 1 : 0;
                        const pathD = activePercentage === 100 
                          ? `M 21 6 A 15 15 0 1 1 20.99 6 Z`
                          : `M 21 21 L ${startX} ${startY} A 15 15 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
                        
                        return (
                          <>
                            <circle cx="21" cy="21" r="15" fill="transparent" stroke="#6b7280" strokeWidth="3" />
                            <path d={pathD} fill="#3b82f6" stroke="#fff" strokeWidth="1" />
                          </>
                        );
                      })()}
                      <circle cx="21" cy="21" r="10" fill="#fff" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-blue-600">
                        {stats.totalStudents > 0 ? Math.round((stats.activeStudents / stats.totalStudents) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                      <span className="text-sm">{t('dashboard.charts.active')}: {stats.activeStudents}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                      <span className="text-sm">{t('dashboard.charts.inactive')}: {stats.totalStudents - stats.activeStudents}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">{t('dashboard.noStudentsRegistered')}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {t('dashboard.notifications.title')}
          </CardTitle>
          <CardDescription>{t('dashboard.notifications.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 p-4 rounded-lg ${
                  notification.type === 'warning' 
                    ? 'bg-amber-50 border border-amber-200' 
                    : notification.type === 'success'
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-blue-50 border border-blue-200'
                }`}
              >
                <notification.icon className={`h-5 w-5 mt-0.5 ${
                  notification.type === 'warning' 
                    ? 'text-amber-600' 
                    : notification.type === 'success'
                    ? 'text-green-600'
                    : 'text-blue-600'
                }`} />
                <div className="flex-1">
                  <h4 className={`font-medium ${
                    notification.type === 'warning' 
                      ? 'text-amber-800' 
                      : notification.type === 'success'
                      ? 'text-green-800'
                      : 'text-blue-800'
                  }`}>
                    {notification.title}
                  </h4>
                  <p className={`text-sm ${
                    notification.type === 'warning' 
                      ? 'text-amber-600' 
                      : notification.type === 'success'
                      ? 'text-green-600'
                      : 'text-blue-600'
                  }`}>
                    {notification.message}
                  </p>
                </div>
                {notification.count > 0 && (
                  <Badge variant="outline" className="bg-white">
                    {notification.count}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
