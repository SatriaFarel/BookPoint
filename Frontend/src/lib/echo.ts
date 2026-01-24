import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: any;
  }
}

window.Pusher = Pusher;

export const echo = new Echo({
  broadcaster: 'reverb',
  key: 'local',

  wsHost: window.location.hostname,
  wsPort: 8080,

  forceTLS: false,      // ⬅️ PENTING
  encrypted: false,    // ⬅️ PENTING
  disableStats: true,
});
