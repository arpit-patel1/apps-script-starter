import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { installAppIcons } from '@/lib/installAppIcons';
import './index.css';

installAppIcons();

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
