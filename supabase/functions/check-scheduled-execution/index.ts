import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: settings, error: settingsError } = await supabase
      .from('ai_settings')
      .select('*')
      .eq('id', 'default')
      .maybeSingle();

    if (settingsError || !settings) {
      return new Response(
        JSON.stringify({ 
          shouldExecute: false, 
          reason: 'Settings not found',
          error: settingsError?.message 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!settings.schedule_enabled) {
      return new Response(
        JSON.stringify({ 
          shouldExecute: false, 
          reason: 'Schedule is disabled' 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (settings.is_executing) {
      return new Response(
        JSON.stringify({ 
          shouldExecute: false, 
          reason: 'Already executing' 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const now = new Date();
    
    if (settings.schedule_start_date) {
      const startDate = new Date(settings.schedule_start_date);
      if (now < startDate) {
        return new Response(
          JSON.stringify({ 
            shouldExecute: false, 
            reason: `Start date not reached (${startDate.toISOString()})` 
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    if (settings.schedule_end_date) {
      const endDate = new Date(settings.schedule_end_date);
      if (now > endDate) {
        await supabase
          .from('ai_settings')
          .update({ schedule_enabled: false })
          .eq('id', 'default');

        return new Response(
          JSON.stringify({ 
            shouldExecute: false, 
            reason: `End date reached (${endDate.toISOString()}). Schedule disabled.` 
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = dayNames[now.getDay()];
    const scheduleDays = settings.schedule_generate_days || [];

    if (!scheduleDays.includes(currentDay)) {
      return new Response(
        JSON.stringify({ 
          shouldExecute: false, 
          reason: `Current day (${currentDay}) not in schedule: ${scheduleDays.join(', ')}` 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const getExecutionTimes = (frequency: string, baseTime: string): string[] => {
      const [baseHours, baseMinutes] = baseTime.split(':').map(Number);
      
      switch (frequency) {
        case 'twice_daily':
          return [
            baseTime,
            `${((baseHours + 12) % 24).toString().padStart(2, '0')}:${baseMinutes.toString().padStart(2, '0')}`
          ];
        case 'three_times_daily':
          return [
            baseTime,
            `${((baseHours + 8) % 24).toString().padStart(2, '0')}:${baseMinutes.toString().padStart(2, '0')}`,
            `${((baseHours + 16) % 24).toString().padStart(2, '0')}:${baseMinutes.toString().padStart(2, '0')}`
          ];
        case 'four_times_daily':
          return [
            baseTime,
            `${((baseHours + 6) % 24).toString().padStart(2, '0')}:${baseMinutes.toString().padStart(2, '0')}`,
            `${((baseHours + 12) % 24).toString().padStart(2, '0')}:${baseMinutes.toString().padStart(2, '0')}`,
            `${((baseHours + 18) % 24).toString().padStart(2, '0')}:${baseMinutes.toString().padStart(2, '0')}`
          ];
        case 'five_times_daily':
          return [
            baseTime,
            `${((baseHours + 4) % 24).toString().padStart(2, '0')}:${baseMinutes.toString().padStart(2, '0')}`,
            `${((baseHours + 8) % 24).toString().padStart(2, '0')}:${baseMinutes.toString().padStart(2, '0')}`,
            `${((baseHours + 12) % 24).toString().padStart(2, '0')}:${baseMinutes.toString().padStart(2, '0')}`,
            `${((baseHours + 16) % 24).toString().padStart(2, '0')}:${baseMinutes.toString().padStart(2, '0')}`
          ];
        default:
          return [baseTime];
      }
    };

    const executionTimes = getExecutionTimes(
      settings.schedule_generate_frequency || 'daily',
      settings.schedule_generate_time || '09:00'
    );

    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHours * 60 + currentMinutes;

    let shouldExecuteNow = false;
    let matchedTime = '';

    for (const time of executionTimes) {
      const [schedHours, schedMinutes] = time.split(':').map(Number);
      const schedTimeInMinutes = schedHours * 60 + schedMinutes;
      
      const diff = currentTimeInMinutes - schedTimeInMinutes;
      
      if (diff >= 0 && diff < 5) {
        shouldExecuteNow = true;
        matchedTime = time;
        break;
      }
    }

    if (!shouldExecuteNow) {
      return new Response(
        JSON.stringify({ 
          shouldExecute: false, 
          reason: `Current time ${currentHours.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')} not within 5-minute window of scheduled times: ${executionTimes.join(', ')}` 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (settings.last_executed_at) {
      const lastExec = new Date(settings.last_executed_at);
      const timeSinceLastExec = (now.getTime() - lastExec.getTime()) / 1000 / 60;
      
      if (timeSinceLastExec < 30) {
        return new Response(
          JSON.stringify({ 
            shouldExecute: false, 
            reason: `Last execution was ${Math.round(timeSinceLastExec)} minutes ago (minimum 30 minutes between runs)` 
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    await supabase
      .from('ai_settings')
      .update({ 
        is_executing: true,
        last_executed_at: now.toISOString()
      })
      .eq('id', 'default');

    try {
      const generateUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/run-scheduled-generation`;
      const genResponse = await fetch(generateUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ triggered_by: 'cron' })
      });

      const result = await genResponse.json();

      await supabase
        .from('ai_settings')
        .update({ is_executing: false })
        .eq('id', 'default');

      return new Response(
        JSON.stringify({ 
          shouldExecute: true, 
          executed: true,
          matchedTime,
          result 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );

    } catch (error: any) {
      await supabase
        .from('ai_settings')
        .update({ is_executing: false })
        .eq('id', 'default');

      return new Response(
        JSON.stringify({ 
          shouldExecute: true, 
          executed: false,
          error: error.message 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

  } catch (error: any) {
    console.error('Check scheduled execution error:', error);
    return new Response(
      JSON.stringify({
        shouldExecute: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});