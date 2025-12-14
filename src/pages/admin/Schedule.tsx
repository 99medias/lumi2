import { useState, useEffect } from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
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
    notify_on_error: true
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [nextRun, setNextRun] = useState<string>('');
  const [recentRuns, setRecentRuns] = useState<ScheduleLog[]>([]);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadSchedule();
    loadRecentRuns();
  }, []);

  useEffect(() => {
    calculateNextRun();
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
          notify_on_error: data.notify_on_error ?? true
        });
      }
    } catch (error) {
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
    } catch (error) {
      console.error('Error loading recent runs:', error);
    }
  };

  const calculateNextRun = () => {
    if (!schedule.enabled) {
      setNextRun('Planification désactivée');
      return;
    }

    const now = new Date();
    const [hours, minutes] = schedule.generate_time.split(':').map(Number);

    let next = new Date();
    next.setHours(hours, minutes, 0, 0);

    if (next <= now) {
      next.setDate(next.getDate() + 1);
    }

    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    while (!schedule.generate_days.includes(dayNames[next.getDay()])) {
      next.setDate(next.getDate() + 1);
    }

    setNextRun(next.toLocaleString('fr-BE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }));
  };

  const saveSchedule = async () => {
    setIsSaving(true);
    setSaveMessage(null);

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
          updated_at: new Date().toISOString()
        })
        .eq('id', 'default');

      if (error) throw error;
      setSaveMessage({ type: 'success', text: 'Planification sauvegardée avec succès!' });
    } catch (error: any) {
      setSaveMessage({ type: 'error', text: 'Erreur: ' + error.message });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 5000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
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
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {schedule.enabled ? '✅ Planification active' : '⏸️ Planification désactivée'}
                </h2>
                <p className="text-gray-600 mt-1">
                  Prochaine exécution: <strong>{nextRun}</strong>
                </p>
              </div>
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
                  <option value="daily">Une fois par jour</option>
                  <option value="weekly">Une fois par semaine</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Heure</label>
                <input
                  type="time"
                  value={schedule.generate_time}
                  onChange={(e) => setSchedule({...schedule, generate_time: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
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
  );
}
