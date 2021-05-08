import React, { createContext, useState } from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import './index.css';

const Index = () => {
  const [{ theme, voice }, setContextValues] = useState<ContextValue>(
    initialContext
  );

  return (
    <React.StrictMode>
      <AppContext.Provider
        value={{
          theme,
          voice,
          setTheme: (theme) => setContextValues((c) => ({ ...c, theme })),
          setVoice: (voice) => setContextValues((c) => ({ ...c, voice }))
        }}
      >
        <App />
      </AppContext.Provider>
    </React.StrictMode>
  );
};

// Context Setup
export type Theme = 'light' | 'dark';
export type Voice = 'first' | 'second' | 'third';

interface ContextValue {
  theme: Theme;
  voice: Voice;
}
interface AppContext {
  theme: Theme;
  voice: Voice;
  setTheme: (theme: Theme) => void;
  setVoice: (voice: Voice) => void;
}

const initialContext: AppContext = {
  theme: 'light',
  voice: 'first',
  setTheme: () => {},
  setVoice: () => {}
};

export const AppContext = createContext<AppContext>(initialContext);

ReactDOM.render(<Index />, document.getElementById('root'));
