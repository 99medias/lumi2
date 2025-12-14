import { useState, useEffect } from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle, Loader, Play } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { supabase } from '../../lib/supabase';

interface ScheduleSettings {
  enabled: boolean;
  check_frequency: string;
  generate_frequency: string;
  generate_time: string;
  generate_days: string[];
  max_articles_per_day: number;
  min_relevance: number;
  auto_publish: boolean;
  sources_priority: string;
  notify_email: string;
  notify_on_publish: boolean;
  notify_on_error: boolean;
  start_date: string | null;
  end_date: string | null;
}

interface ScheduleLog {
  id: string;
  status: string;
  sources_checked: number;
  items_detected: number;
  articles_generated: number;
  errors: string[];
  created_at: string;
}

export default function AdminSchedule() {
  const [schedule, setSchedule] = useState<ScheduleSettings>({
    enabled: false,
    check_frequency: '30',
    generate_frequency: 'daily',
    generate_time: '09:00',
    generate_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    max_articles_per_day: 3,
    min_relevance: 0.7,
    auto_publish: false,
    sources_priority: 'high',
    notify_email: '',
    notify_on_publish: true,
    notify_on_error: true,
    start_date: null,
    end_date: null
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRunningNow, setIsRunningNow] = useState(false);
  const [runStatus, setRunStatus] = useState<string>('');
  const [nextRun, setNextRun] = useState<string>('');
  const [upcomingRuns, setUpcomingRuns] = useState<string[]>([]);
  const [recentRuns, setRecentRuns] = useState<ScheduleLog[]>([]);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [runNowMessage, setRunNowMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [minDateTime, setMinDateTime] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    loadSchedule();
    loadRecentRuns();
    setMinDateTime(getCurrentLocalDateTimeString());

    const minDateInterval = setInterval(() => {
      setMinDateTime(getCurrentLocalDateTimeString());
    }, 60000);

    return () => {
      clearInterval(minDateInterval);
    };
  }, []);

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const tzOffset = -now.getTimezoneOffset() / 60;
      const tzString = `GMT${tzOffset >= 0 ? '+' : ''}${tzOffset}`;
      setCurrentTime(now.toLocaleString('fr-BE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }) + ` (${tzString})`);
    };

    updateCurrentTime();
    calculateNextRun();

    const nextRunInterval = setInterval(() => {
      updateCurrentTime();
      calculateNextRun();
    }, 60000);

    return () => clearInterval(nextRunInterval);
  }, [schedule]);

  const loadSchedule = async () => {
    try {
      const { data } = await supabase
        .from('ai_settings')
        .select('*')
        .eq('id', 'default')
        .single();

      if (data) {
        setSchedule({
          enabled: data.schedule_enabled || false,
          check_frequency: data.schedule_check_frequency || '30',
          generate_frequency: data.schedule_generate_frequency || 'daily',
          generate_time: data.schedule_time || '09:00',
          generate_days: data.schedule_days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          max_articles_per_day: data.schedule_max_articles || 3,
          min_relevance: data.schedule_min_relevance || 0.7,
          auto_publish: data.schedule_auto_publish || false,
          sources_priority: data.schedule_sources_priority || 'high',
          notify_email: data.notification_email || '',
          notify_on_publish: data.notify_on_publish ?? true,
          notify_on_error: data.notify_on_error ?? true,
          start_date: data.schedule_start_date || null,
          end_date: data.schedule_end_date || null
        });
      }
    } catch (error: unknown) {
      console.error('Error loading schedule:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecentRuns = async () => {
    try {
      const { data } = await supabase
        .from('schedule_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      setRecentRuns(data || []);
    } catch (error: unknown) {
      console.error('Error loading recent runs:', error);
    }
  };

  const getExecutionTimesForFrequency = (frequency: string, baseTime: string): string[] => {
    const [baseHours, baseMinutes] = baseTime.split(':').map(Number);

    switch (frequency) {
      case 'hourly':
        return Array.from({ length: 24 }, (_, i) => {
          const hour = i.toString().padStart(2, '0');
          return `${hour}:${baseMinutes.toString().padStart(2, '0')}`;
        });

      case 'twice_daily':
        return [
          baseTime,
          `${(baseHours + 6).toString().padStart(2, '0')}:${baseMinutes.toString().padStart(2, '0')}`
        ];

      case 'three_times_daily':
        return [
          baseTime,
          `${(baseHours + 4).toString().padStart(2, '0')}:${baseMinutes.toString().padStart(2, '0')}`,
          `${(baseHours + 8).toString().padStart(2, '0')}:${baseMinutes.toString().padStart(2, '0')}`
        ];

      case 'four_times_daily':
        return [
          baseTime,
          `${(baseHours + 3).toString().padStart(2, '0')}:${baseMinutes.toString().padStart(2, '0')}`,
          `${(baseHours + 6).toString().padStart(2, '0')}:${baseMinutes.toString().padStart(2, '0')}`,
          `${(baseHours + 9).toString().padStart(2, '0')}:${baseMinutes.toString().padStart(2, '0')}`
        ];

      case 'five_times_daily':
        return [
          baseTime,
          `${(baseHours + 2).toString().padStart(2, '0')}:${baseMinutes.toString().padStart(2, '0')}`,
          `${(baseHours + 4).toString().padStart(2, '0')}:${baseMinutes.toString().padStart(2, '0')}`,
          `${(baseHours + 6).toString().padStart(2, '0')}:${baseMinutes.toString().padStart(2, '0')}`,
          `${(baseHours + 8).toString().padStart(2, '0')}:${baseMinutes.toString().padStart(2, '0')}`
        ];

      case 'daily':
      case 'weekly':
      default:
        return [baseTime];
    }
  };

  const findNextValidDay = (date: Date, validDays: string[]): Date => {
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const result = new Date(date);
    let attempts = 0;
    const maxAttempts = 7;

    while (!validDays.includes(dayNames[result.getDay()]) && attempts < maxAttempts) {
      result.setDate(result.getDate() + 1);
      attempts++;
    }

    if (attempts >= maxAttempts) {
      throw new Error('Aucun jour valide sélectionné');
    }

    return result;
  };

  const calculateNextRun = () => {
    if (!schedule.enabled) {
      setNextRun('Planification désactivée');
      setUpcomingRuns([]);
      return;
    }

    if (schedule.generate_days.length === 0) {
      setNextRun('Aucun jour sélectionné');
      setUpcomingRuns([]);
      return;
    }

    const now = new Date();
    const startDate = schedule.start_date ? new Date(schedule.start_date) : now;

    console.log('Current time:', now.toISOString());
    console.log('Start date:', startDate.toISOString());
    console.log('Valid days:', schedule.generate_days);
    console.log('Time:', schedule.generate_time);

    if (startDate > now) {
      const tzOffset = -now.getTimezoneOffset() / 60;
      const tzString = `GMT${tzOffset >= 0 ? '+' : ''}${tzOffset}`;
      setNextRun(`Démarrage prévu le ${startDate.toLocaleString('fr-BE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })} (${tzString})`);
      setUpcomingRuns([]);
      return;
    }

    if (schedule.end_date) {
      const endDate = new Date(schedule.end_date);
      if (now > endDate) {
        setNextRun('Planification terminée (date de fin dépassée)');
        setUpcomingRuns([]);
        return;
      }
    }

    try {
      const executionTimes = getExecutionTimesForFrequency(
        schedule.generate_frequency,
        schedule.generate_time
      );

      const allUpcoming: Date[] = [];
      let foundNext = false;
      let nextExecution: Date | null = null;

      const currentDate = new Date(Math.max(now.getTime(), startDate.getTime()));

      for (let dayOffset = 0; dayOffset < 8 && allUpcoming.length < 5; dayOffset++) {
        const checkDate = new Date(currentDate);
        checkDate.setDate(checkDate.getDate() + dayOffset);

        console.log(`Checking dayOffset=${dayOffset}, checkDate=${checkDate.toISOString()}`);

        try {
          const validDate = findNextValidDay(checkDate, schedule.generate_days);
          console.log(`  validDate=${validDate.toISOString()}, checkDate=${checkDate.toISOString()}`);

          if (dayOffset === 0 || validDate.toDateString() === checkDate.toDateString()) {
            for (const time of executionTimes) {
              const [hours, minutes] = time.split(':').map(Number);
              const execTime = new Date(validDate);
              execTime.setHours(hours, minutes, 0, 0);

              console.log(`    Checking time ${time}: execTime=${execTime.toISOString()}, now=${now.toISOString()}, execTime > now = ${execTime > now}`);

              if (schedule.end_date && execTime > new Date(schedule.end_date)) {
                continue;
              }

              if (execTime > now) {
                allUpcoming.push(execTime);

                if (!foundNext) {
                  nextExecution = execTime;
                  foundNext = true;
                }
              }
            }
          } else if (validDate > checkDate) {
            console.log(`  validDate > checkDate, adjusting`);
            checkDate.setTime(validDate.getTime());
            dayOffset--;
          }
        } catch (error) {
          break;
        }
      }

      if (!nextExecution) {
        setNextRun('Aucune exécution prévue (date de fin atteinte)');
        setUpcomingRuns([]);
        return;
      }

      const tzOffset = -now.getTimezoneOffset() / 60;
      const tzString = `GMT${tzOffset >= 0 ? '+' : ''}${tzOffset}`;

      const formatDate = (date: Date, includeYear: boolean = false) => {
        const opts: Intl.DateTimeFormatOptions = {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          hour: '2-digit',
          minute: '2-digit'
        };
        if (includeYear) opts.year = 'numeric';
        return date.toLocaleString('fr-BE', opts);
      };

      const timeDiff = nextExecution.getTime() - now.getTime();
      const minutesUntil = Math.floor(timeDiff / 1000 / 60);
      const hoursUntil = Math.floor(minutesUntil / 60);

      let nextRunText = formatDate(nextExecution);

      if (minutesUntil < 60) {
        nextRunText += ` (dans ${minutesUntil} minute${minutesUntil > 1 ? 's' : ''})`;
      } else if (hoursUntil < 24) {
        nextRunText += ` (dans ${hoursUntil} heure${hoursUntil > 1 ? 's' : ''})`;
      }

      nextRunText += ` - ${tzString}`;

      setNextRun(nextRunText);

      if (allUpcoming.length > 1) {
        const upcoming = allUpcoming.slice(1, 4).map(date => formatDate(date));
        setUpcomingRuns(upcoming);
      } else {
        setUpcomingRuns([]);
      }

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de configuration';
      setNextRun(errorMessage);
      setUpcomingRuns([]);
    }
  };

  const runNow = async () => {
    setIsRunningNow(true);
    setRunNowMessage(null);
    setRunStatus('Vérification des sources...');

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/run-scheduled-generation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Échec de l\'exécution');
      }

      const result = await response.json();

      if (result.success) {
        const messages = [];

        if (result.sourcesChecked > 0) {
          messages.push(`${result.sourcesChecked} sources vérifiées`);
        }
        if (result.newItemsDetected > 0) {
          messages.push(`${result.newItemsDetected} nouveaux éléments détectés`);
        }
        if (result.articlesGenerated > 0) {
          messages.push(`${result.articlesGenerated} article(s) généré(s)`);
          setRunNowMessage({
            type: 'success',
            text: `✅ ${result.articlesGenerated} article(s) généré(s)!`
          });
        } else {
          setRunNowMessage({
            type: 'success',
            text: result.message || 'Aucun article généré'
          });
        }

        setRunStatus(messages.join(' • ') || 'Terminé');

        if (result.errors && result.errors.length > 0) {
          console.error('Generation errors:', result.errors);
          setRunNowMessage({
            type: 'error',
            text: `⚠️ ${result.articlesGenerated} article(s) généré(s), mais ${result.errors.length} erreur(s). Voir la console.`
          });
        }

        loadRecentRuns();
      } else {
        setRunNowMessage({ type: 'error', text: 'Erreur: ' + result.error });
        setRunStatus('Erreur: ' + result.error);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setRunNowMessage({ type: 'error', text: 'Erreur: ' + errorMessage });
      setRunStatus('Erreur');
    } finally {
      setIsRunningNow(false);
      setTimeout(() => setRunNowMessage(null), 10000);
    }
  };

  const saveSchedule = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    if (schedule.notify_email && !isValidEmail(schedule.notify_email)) {
      setSaveMessage({ type: 'error', text: 'Veuillez entrer une adresse email valide' });
      setIsSaving(false);
      return;
    }

    if (schedule.start_date && schedule.end_date) {
      const start = new Date(schedule.start_date);
      const end = new Date(schedule.end_date);
      if (end <= start) {
        setSaveMessage({ type: 'error', text: 'La date de fin doit être après la date de début' });
        setIsSaving(false);
        return;
      }
    }

    try {
      const { error } = await supabase
        .from('ai_settings')
        .update({
          schedule_enabled: schedule.enabled,
          schedule_check_frequency: schedule.check_frequency,
          schedule_generate_frequency: schedule.generate_frequency,
          schedule_time: schedule.generate_time,
          schedule_days: schedule.generate_days,
          schedule_max_articles: schedule.max_articles_per_day,
          schedule_min_relevance: schedule.min_relevance,
          schedule_auto_publish: schedule.auto_publish,
          schedule_sources_priority: schedule.sources_priority,
          notification_email: schedule.notify_email,
          notify_on_publish: schedule.notify_on_publish,
          notify_on_error: schedule.notify_on_error,
          schedule_start_date: schedule.start_date,
          schedule_end_date: schedule.end_date,
          updated_at: new Date().toISOString()
        })
        .eq('id', 'default');

      if (error) throw error;
      setSaveMessage({ type: 'success', text: 'Planification sauvegardée avec succès!' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setSaveMessage({ type: 'error', text: 'Erreur: ' + errorMessage });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 5000);
    }
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const toLocalDateTimeString = (isoString: string | null): string => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const fromLocalDateTimeString = (localString: string): string | null => {
    if (!localString) return null;
    const date = new Date(localString);
    return date.toISOString();
  };

  const getCurrentLocalDateTimeString = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const roundToNextFiveMinutes = (date: Date): string => {
    const minutes = date.getMinutes();
    const roundedMinutes = Math.ceil((minutes + 2) / 5) * 5;

    if (roundedMinutes >= 60) {
      date.setHours(date.getHours() + 1);
      date.setMinutes(roundedMinutes - 60);
    } else {
      date.setMinutes(roundedMinutes);
    }

    const hours = String(date.getHours()).padStart(2, '0');
    const mins = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${mins}`;
  };

  const setToNow = () => {
    const now = new Date();
    const roundedTime = roundToNextFiveMinutes(new Date(now));
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = dayNames[now.getDay()];

    const updatedDays = schedule.generate_days.includes(currentDay)
      ? schedule.generate_days
      : [...schedule.generate_days, currentDay];

    setSchedule({
      ...schedule,
      start_date: now.toISOString(),
      generate_time: roundedTime,
      generate_days: updatedDays
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="pt-32">
        <PageHeader
          title="Planification Automatique"
          subtitle="Configuration de la génération automatique de contenu"
          icon={Calendar}
        />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

          <div className={`rounded-xl p-6 border-2 ${schedule.enabled ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-900">
                  {schedule.enabled ? '✅ Planification active' : '⏸️ Planification désactivée'}
                </h2>
                {currentTime && (
                  <p className="text-sm text-gray-500 mt-1">
                    Heure actuelle: {currentTime}
                  </p>
                )}
                <p className="text-gray-600 mt-1">
                  Prochaine exécution: <strong>{nextRun}</strong>
                </p>
                {upcomingRuns.length > 0 && (
                  <div className="mt-2 text-sm text-gray-500">
                    <p className="font-semibold">Prochaines exécutions:</p>
                    <ul className="list-disc list-inside ml-2 space-y-1 mt-1">
                      {upcomingRuns.map((run, index) => (
                        <li key={index}>{run}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {runStatus && (
                  <p className="text-sm text-blue-600 font-medium mt-2">
                    {runStatus}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={runNow}
                  disabled={isRunningNow}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isRunningNow ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Exécution...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Exécuter maintenant
                    </>
                  )}
                </button>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={schedule.enabled}
                    onChange={(e) => setSchedule({...schedule, enabled: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
            </div>
            {runNowMessage && (
              <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 ${
                runNowMessage.type === 'success' ? 'bg-green-100 border border-green-300 text-green-800' : 'bg-red-100 border border-red-300 text-red-800'
              }`}>
                {runNowMessage.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                )}
                <span className="text-sm font-medium">{runNowMessage.text}</span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              Fréquence de génération
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Fréquence</label>
                <select
                  value={schedule.generate_frequency}
                  onChange={(e) => setSchedule({...schedule, generate_frequency: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="hourly">Toutes les heures</option>
                  <option value="twice_daily">2 fois par jour</option>
                  <option value="three_times_daily">3 fois par jour</option>
                  <option value="four_times_daily">4 fois par jour</option>
                  <option value="five_times_daily">5 fois par jour</option>
                  <option value="daily">Une fois par jour</option>
                  <option value="weekly">Une fois par semaine</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {schedule.generate_frequency === 'hourly' ? 'Heure de début' :
                   schedule.generate_frequency === 'daily' || schedule.generate_frequency === 'weekly' ? 'Heure' :
                   'Première exécution'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="time"
                    value={schedule.generate_time}
                    onChange={(e) => setSchedule({...schedule, generate_time: e.target.value})}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const now = new Date();
                      const roundedTime = roundToNextFiveMinutes(new Date(now));
                      setSchedule({...schedule, generate_time: roundedTime});
                    }}
                    className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-semibold whitespace-nowrap"
                    title="Définir à l'heure actuelle (arrondie)"
                  >
                    <Clock className="w-4 h-4" />
                  </button>
                </div>
                {(() => {
                  const now = new Date();
                  const startDate = schedule.start_date ? new Date(schedule.start_date) : null;
                  const isToday = startDate &&
                    startDate.getDate() === now.getDate() &&
                    startDate.getMonth() === now.getMonth() &&
                    startDate.getFullYear() === now.getFullYear();

                  if (isToday) {
                    const [scheduleHours, scheduleMinutes] = schedule.generate_time.split(':').map(Number);
                    const scheduledTime = new Date(now);
                    scheduledTime.setHours(scheduleHours, scheduleMinutes, 0, 0);

                    if (scheduledTime <= now) {
                      return (
                        <p className="text-xs text-amber-600 mt-1 flex items-start gap-1">
                          <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span>L'heure planifiée ({schedule.generate_time}) est déjà passée aujourd'hui. Cliquez sur l'icône horloge pour ajuster à l'heure actuelle.</span>
                        </p>
                      );
                    }
                  }

                  return (
                    <p className="text-xs text-gray-500 mt-1">
                      {schedule.generate_frequency === 'hourly' ? 'Génération toutes les heures à partir de cette heure' :
                       schedule.generate_frequency === 'twice_daily' ? 'Génération à cette heure et 6h plus tard' :
                       schedule.generate_frequency === 'three_times_daily' ? 'Génération à cette heure, puis +4h et +8h' :
                       schedule.generate_frequency === 'four_times_daily' ? 'Génération à cette heure, puis +3h, +6h, +9h' :
                       schedule.generate_frequency === 'five_times_daily' ? 'Génération à cette heure, puis +2h, +4h, +6h, +8h' :
                       schedule.generate_frequency === 'weekly' ? 'Génération une fois par semaine aux jours sélectionnés' :
                       'Génération quotidienne à cette heure'}
                    </p>
                  );
                })()}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date de début
                  <span className="text-xs text-gray-500 font-normal ml-2">(Optionnel)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="datetime-local"
                    value={toLocalDateTimeString(schedule.start_date)}
                    onChange={(e) => setSchedule({...schedule, start_date: fromLocalDateTimeString(e.target.value)})}
                    min={minDateTime}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={setToNow}
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-semibold whitespace-nowrap"
                    title="Définir à maintenant"
                  >
                    Maintenant
                  </button>
                  {schedule.start_date && (
                    <button
                      type="button"
                      onClick={() => setSchedule({...schedule, start_date: null})}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
                      title="Effacer"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {schedule.start_date ? 'La génération commencera à cette date' : 'Par défaut: maintenant'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date de fin
                  <span className="text-xs text-gray-500 font-normal ml-2">(Optionnel)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="datetime-local"
                    value={toLocalDateTimeString(schedule.end_date)}
                    onChange={(e) => setSchedule({...schedule, end_date: fromLocalDateTimeString(e.target.value)})}
                    min={schedule.start_date ? toLocalDateTimeString(schedule.start_date) : minDateTime}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {schedule.end_date && (
                    <button
                      type="button"
                      onClick={() => setSchedule({...schedule, end_date: null})}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
                      title="Effacer"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {schedule.end_date ? 'La génération s\'arrêtera à cette date' : 'Par défaut: illimitée'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Jours actifs</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'monday', label: 'Lun' },
                  { key: 'tuesday', label: 'Mar' },
                  { key: 'wednesday', label: 'Mer' },
                  { key: 'thursday', label: 'Jeu' },
                  { key: 'friday', label: 'Ven' },
                  { key: 'saturday', label: 'Sam' },
                  { key: 'sunday', label: 'Dim' }
                ].map(day => (
                  <button
                    key={day.key}
                    type="button"
                    onClick={() => {
                      const days = schedule.generate_days.includes(day.key)
                        ? schedule.generate_days.filter(d => d !== day.key)
                        : [...schedule.generate_days, day.key];
                      setSchedule({...schedule, generate_days: days});
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      schedule.generate_days.includes(day.key)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">⚙️ Paramètres de génération</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Articles max par jour</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={schedule.max_articles_per_day}
                  onChange={(e) => setSchedule({...schedule, max_articles_per_day: parseInt(e.target.value) || 1})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pertinence minimum</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={schedule.min_relevance * 100}
                    onChange={(e) => setSchedule({...schedule, min_relevance: parseInt(e.target.value) / 100})}
                    className="flex-1"
                  />
                  <span className="font-bold text-green-600 w-12 text-right">{Math.round(schedule.min_relevance * 100)}%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sources à utiliser</label>
                <select
                  value={schedule.sources_priority}
                  onChange={(e) => setSchedule({...schedule, sources_priority: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="high">Priorité haute uniquement</option>
                  <option value="high_medium">Haute et moyenne</option>
                  <option value="all">Toutes les sources</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={schedule.auto_publish}
                    onChange={(e) => setSchedule({...schedule, auto_publish: e.target.checked})}
                    className="mr-3 w-5 h-5 text-green-600 rounded focus:ring-green-500"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Publication automatique</p>
                    <p className="text-xs text-gray-500">Publier sans révision manuelle</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">🔔 Notifications</h2>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email de notification</label>
              <input
                type="email"
                value={schedule.notify_email}
                onChange={(e) => setSchedule({...schedule, notify_email: e.target.value})}
                placeholder="votre@email.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={schedule.notify_on_publish}
                  onChange={(e) => setSchedule({...schedule, notify_on_publish: e.target.checked})}
                  className="mr-2 w-5 h-5 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Notifier à chaque publication</span>
              </label>

              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={schedule.notify_on_error}
                  onChange={(e) => setSchedule({...schedule, notify_on_error: e.target.checked})}
                  className="mr-2 w-5 h-5 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Notifier en cas d'erreur</span>
              </label>
            </div>
          </div>

          {recentRuns.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">📊 Exécutions récentes</h2>

              <div className="space-y-2">
                {recentRuns.map((run) => (
                  <div key={run.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      {run.status === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(run.created_at).toLocaleString('fr-BE')}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {run.articles_generated} articles • {run.sources_checked} sources
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {saveMessage && (
            <div className={`p-4 rounded-lg flex items-start gap-3 ${
              saveMessage.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              {saveMessage.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <p className={`text-sm font-semibold ${saveMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {saveMessage.text}
              </p>
            </div>
          )}

          <button
            onClick={saveSchedule}
            disabled={isSaving}
            className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Sauvegarde en cours...
              </>
            ) : (
              '💾 Sauvegarder la planification'
            )}
          </button>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
}
