import { generateWorkout } from './data';
import { useState } from 'react';

export const App = () => {
  const [workout, setWorkout] = useState(generateWorkout());

  return (
    <main>
      <nav>
        <h1>Core Mixer</h1>
      </nav>

      <section>
        {
          <ul>
            {workout.map((item) => (
              <li>{item.name}</li>
            ))}
          </ul>
        }
      </section>

      <footer>
        <button onClick={() => setWorkout(generateWorkout())}>Mix it up</button>
      </footer>
    </main>
  );
};
