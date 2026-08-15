import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './features/auth/authContext';
import { Toaster } from 'react-hot-toast';
import { router } from './appRouter';
import { AgentProvider } from './features/BuildAgent/agentContext';

function App() {
  return (
    <AuthProvider>
      <AgentProvider>
        <Toaster position="top-right" />
        <RouterProvider router={router} />
      </AgentProvider>
    </AuthProvider>
  );
}

export default App;