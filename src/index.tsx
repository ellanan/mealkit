import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { CustomEmotionCacheProvider } from './utils/CustomEmotionCacheProvider';

ReactDOM.render(
  <BrowserRouter>
    <React.StrictMode>
      <CustomEmotionCacheProvider>
        <App />
      </CustomEmotionCacheProvider>
    </React.StrictMode>
  </BrowserRouter>,
  document.getElementById('root')
);
