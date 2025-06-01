import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MainComponent from './App.jsx'
import { VideoProvider } from './VideoContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <VideoProvider>
      <MainComponent />
    </VideoProvider>
  </StrictMode>,
)
