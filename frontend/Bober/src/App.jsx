import React from 'react';
import { useAppContext } from './contexts/AppContext'; // Import your context
import './App.css';
import Form from './components/Form';
import Login from './pages/Login'; // Hypothetical login form component

function App() {
  const { isAuthenticated, loading } = useAppContext();

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while checking auth state
  }

  return (
    <>
      {isAuthenticated ? <Form /> : <Login />}
    </>
  );
}

export default App;
