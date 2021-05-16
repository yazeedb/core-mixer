import './App.scss';
import { useMachine } from '@xstate/react';
import { workoutMachine } from './workoutMachine';
import { Home } from './screens/Home';
import { WorkoutPage } from './screens/WorkoutPage';
import { WorkoutComplete } from './screens/WorkoutComplete';
import { useEffect, useState } from 'react';
import cn from 'classnames';
import { SettingsIcon } from './svg/Settings';
import { Modal } from './Modal';
import { UserSettings } from './UserSettings';

export const App = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [{ context, matches }, send] = useMachine(workoutMachine, {
    devTools: true
  });

  const showWorkout = ['introducingWorkout', 'workoutRunning'].some(matches);

  const pauseIfUserTabsAway = () => {
    if (matches('workoutRunning.paused')) {
      return;
    }

    const message =
      document.visibilityState === 'hidden' ? 'PAUSE' : 'CONTINUE';

    send({ type: message });
  };

  useEffect(() => {
    document.addEventListener('visibilitychange', pauseIfUserTabsAway);

    return () => {
      document.removeEventListener('visibilitychange', pauseIfUserTabsAway);
    };
  }, []);

  const renderContent = () => {
    if (matches('viewingWorkout')) {
      return (
        <Home
          workout={context.workout}
          onStart={() => send('INTRODUCE_WORKOUT')}
          onShuffle={() => send('SHUFFLE')}
        />
      );
    }

    if (showWorkout) {
      return (
        <WorkoutPage
          context={context}
          isPaused={matches('workoutRunning.paused')}
          onPause={() => send('PAUSE')}
          onContinue={() => send('CONTINUE')}
          onSkip={() => send('SKIP')}
        />
      );
    }

    return (
      <WorkoutComplete
        workout={context.workout}
        onGoHome={() => send('GO_HOME')}
      />
    );
  };

  return (
    <div className="app-max-size">
      <nav
        className={cn([
          'flex',
          'justify-between',
          'app-padding',
          'text-neutral-4',
          'bg-primary-1',
          'items-center'
        ])}
      >
        <h1>CoreMixer</h1>

        {/* TODO: Re-add Settings once voices and dark mode done */}

        {/* <button onClick={() => setSettingsOpen(true)}>
          <span className="sr-only">Settings</span>
          <SettingsIcon className="fill-current" />
        </button> */}
      </nav>

      {renderContent()}

      {/* <Modal open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <UserSettings />
      </Modal> */}
    </div>
  );
};
