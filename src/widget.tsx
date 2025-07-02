import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import FloatingWidget from './FloatingWidget.tsx';
import './index.css';

createRoot(document.getElementById('widget-root')!).render(
  <StrictMode>
    <FloatingWidget />
  </StrictMode>
);