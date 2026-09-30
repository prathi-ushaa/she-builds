import { StrictMode } from 'react' //strictmode used for debugging during react development. 
import { createRoot } from 'react-dom/client' //createroot creates a virtual dom & dulpicate of my html file.
import './index.css'
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
