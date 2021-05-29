import NoSleep from 'nosleep.js';
import { useEffect } from 'react';

export const useNoSleep = () => {
  useEffect(() => {
    document.addEventListener('click', nastyScreenTimeoutHack, {
      capture: false,
      once: true
    });
  }, []);
};

const nastyScreenTimeoutHack = () => {
  // NoSleep seems inconsistent alongside audio and network calls.
  // Disabling/enabling it every few seconds, however, seems to work.

  const noSleep = new NoSleep();
  noSleep.enable();

  setInterval(() => {
    noSleep.disable();

    noSleep
      .enable()
      .then(() => {})

      // If browser tab isn't active, WakeLock API call breaks.
      // I don't care if it fails, just don't crash the app
      .catch(() => {});
  }, 5000);
};
