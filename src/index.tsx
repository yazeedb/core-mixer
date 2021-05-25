import { CssBaseline } from '@material-ui/core';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import './index.css';

ReactDOM.render(
  <StrictMode>
    <CssBaseline />
    <App />
  </StrictMode>,
  document.getElementById('root')
);
