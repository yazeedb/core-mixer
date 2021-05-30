import './App.scss';
import { useMachine } from '@xstate/react';
import { workoutMachine } from './workoutMachine';
import { Home } from './screens/Home';
import { WorkoutPage } from './screens/WorkoutPage';
import { WorkoutComplete } from './screens/WorkoutComplete';
import { useState } from 'react';
import {
  ChoosePreferences,
  ChoosePreferencesModal
} from './screens/ChoosePreferences';
import { Nav } from './components/Nav';
import { Modal } from './components/Modal';
import { useNoSleep } from './useNoSleep';

export const App = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [{ context, matches }, send] = useMachine(workoutMachine, {
    devTools: true
  });

  const showWorkout = ['introducingWorkout', 'workoutRunning'].some(matches);

  useNoSleep();

  const renderContent = () => {
    if (matches('choosingPreferences')) {
      return (
        <ChoosePreferences
          onSubmit={(preferences) =>
            send({ type: 'SET_PREFERENCES', preferences })
          }
        />
      );
    }

    if (matches('viewingWorkout')) {
      return (
        <Home
          workout={context.workout}
          difficulty={context.preferences.difficulty}
          onStart={() => send('INTRODUCE_WORKOUT')}
          onShuffle={() => send('SHUFFLE')}
          ready={matches('viewingWorkout.ready')}
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
      <Nav
        showSettings={matches('viewingWorkout')}
        onSettingsClick={() => setSettingsOpen(true)}
      />

      {renderContent()}

      <Modal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Preferences"
      >
        <ChoosePreferencesModal
          existingPreferences={context.preferences}
          onSubmit={(preferences) => {
            send({ type: 'SET_PREFERENCES', preferences });
            setSettingsOpen(false);
          }}
        />
      </Modal>
    </div>
  );
};
