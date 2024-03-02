import ReactDOM from 'react-dom/client';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { App } from './App';
import packageJson from '../package.json'

import './index.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const enableMocking = async () => { 
  const { worker } = await import('api/mocks/browser')

  if (process.env.NODE_ENV === 'production') {
    return worker.start({
      serviceWorker: {
        url: `${packageJson.homepage}/mockServiceWorker.js`,
      }
    })
  }

  return worker.start()
}

enableMocking().then(() => {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  
  root.render(
    <App />
  );  
})