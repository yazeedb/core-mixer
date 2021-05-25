import './App.scss';
import { useMachine } from '@xstate/react';
import { workoutMachine } from './workoutMachine';
import { Home } from './screens/Home';
import { WorkoutPage } from './screens/WorkoutPage';
import { WorkoutComplete } from './screens/WorkoutComplete';
import { useCallback, useEffect, useState } from 'react';
import { Modal } from './Modal';
import { UserSettings } from './UserSettings';
import { ChooseDifficulty } from './screens/ChooseDifficulty';
import { Nav } from './Nav';

export const App = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [{ context, matches }, send] = useMachine(workoutMachine, {
    devTools: true
  });

  const showWorkout = ['introducingWorkout', 'workoutRunning'].some(matches);

  const pauseIfUserTabsAway = useCallback(() => {
    if (matches('workoutRunning.paused')) {
      return;
    }

    const message =
      document.visibilityState === 'hidden' ? 'PAUSE' : 'CONTINUE';

    send({ type: message });
  }, [matches, send]);

  useEffect(() => {
    document.addEventListener('visibilitychange', pauseIfUserTabsAway);

    return () => {
      document.removeEventListener('visibilitychange', pauseIfUserTabsAway);
    };
  }, [pauseIfUserTabsAway]);

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
      {matches('choosingDifficulty') ? (
        <ChooseDifficulty
          onSubmit={(difficulty) =>
            send({ type: 'CHOOSE_DIFFICULTY', difficulty })
          }
        />
      ) : (
        <>
          <Nav onSettingsClick={() => setSettingsOpen(true)} />
          {renderContent()}

          <Modal
            open={settingsOpen}
            onClose={() => setSettingsOpen(false)}
            title="Settings"
          >
            <UserSettings />
          </Modal>
        </>
      )}
    </div>
  );
};
