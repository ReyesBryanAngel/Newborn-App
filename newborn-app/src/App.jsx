import { useState, useEffect } from 'react';
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ApplicationLayout from "./components/layouts/ApplicationLayout";
import Records from "./components/routes/Records";
import Results from "./components/routes/Results";
import Courier from "./components/routes/courier/Courier";
import FillupForm from "./components/routes/form/FillupForm";
import { DataProvider } from './context/DataProvider';
import LoginPage from './auth/LoginPage';
import RouteProtector from './auth/RouteProtector';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const checkUserToken = () => {
    const userToken = sessionStorage.getItem('token');
    if (userToken && userToken !== 'undefined') {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }

  useEffect(() => {
    checkUserToken();
  }, [isLoggedIn]);


  return (
    <DataProvider>
      <Router>
        <Routes>
            <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
              <RouteProtector isLoggedIn={isLoggedIn}>
                <ApplicationLayout>
                  <Dashboard />
                </ApplicationLayout>
              </RouteProtector>
            } 
          />
          <Route path="/records" element={
            <ApplicationLayout>
              <Records />
            </ApplicationLayout>} 
          />
          <Route path="/results" element={
            <ApplicationLayout>
              <Results />
            </ApplicationLayout>} 
          />
           <Route path="/courier" element={
            <ApplicationLayout>
              <Courier />
            </ApplicationLayout>} 
          />
           <Route path="/form" element={
            <ApplicationLayout>
              <FillupForm />
            </ApplicationLayout>} 
          />
        </Routes>
      </Router>
    </DataProvider>
  )
}

export default App
