import React, { useContext } from 'react';
import { AuthContext, AuthProvider } from './AuthContext';
import Login from './Login';
import Dashboard from './Dashboard';

function MainApp() {
  const { user } = useContext(AuthContext);
  return user ? <Dashboard /> : <Login />;
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
