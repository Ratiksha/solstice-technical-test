import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './router/AppRouter';

async function enableMocking() {
  if (import.meta.env.MODE === "development") {
    const { worker } = await import("./mocks/browser");
    await worker.start();
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <AppRouter />
    </StrictMode>
  );
});

