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
import RegisterPage from './auth/RegisterPage';
import LoginPage from './auth/LoginPage';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import RouteProtector from './auth/RouteProtector';
import CourierSample from './components/routes/courier/CourierSample';
import ReviewSample from './components/routes/form/ReviewSample';
import CourierInformationForm from './components/routes/form/CourierInformationForm';
import RepeatForm from './components/routes/form/RepeatForm';
import UpdateForm from './components/routes/form/UpdateForm';

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

  const queryCLient = new QueryClient();
  return (
    <QueryClientProvider client={queryCLient}>
      <DataProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={
                  <RouteProtector isLoggedIn={isLoggedIn}>
                    <ApplicationLayout>
                      <Dashboard />
                    </ApplicationLayout>
                  </RouteProtector>
                } 
              />
              <Route path="/records" element={
                  <RouteProtector isLoggedIn={isLoggedIn}>
                    <ApplicationLayout>
                      <Records />
                    </ApplicationLayout>
                  </RouteProtector>
                } 
              />
              <Route path="/results" element={
                  <RouteProtector isLoggedIn={isLoggedIn}>
                    <ApplicationLayout>
                      <Results />
                    </ApplicationLayout>
                  </RouteProtector>
                } 
              />
              <Route path="/courier" element={
                  <RouteProtector isLoggedIn={isLoggedIn}>
                    <ApplicationLayout>
                      <Courier />
                    </ApplicationLayout>
                  </RouteProtector>
                } 
              />
              <Route path="/courier-sample" element={
                <RouteProtector isLoggedIn={isLoggedIn}>
                  <ApplicationLayout>
                    <CourierSample />
                  </ApplicationLayout>
                </RouteProtector>
                } 
              />
              <Route path="/form" element={
                <RouteProtector isLoggedIn={isLoggedIn}>
                  <ApplicationLayout>
                    <FillupForm />
                  </ApplicationLayout>
                </RouteProtector>
                } 
              />
              <Route path="/update-form" element={
                <RouteProtector isLoggedIn={isLoggedIn}>
                  <ApplicationLayout>
                    <UpdateForm />
                  </ApplicationLayout>
                </RouteProtector>
                } 
              />
              <Route path="/review-sample-form" element={
                <RouteProtector isLoggedIn={isLoggedIn}>
                  <ApplicationLayout>
                    <ReviewSample />
                  </ApplicationLayout>
                </RouteProtector>
                } 
              />
              <Route path="/courier-information-form" element={
                <RouteProtector isLoggedIn={isLoggedIn}>
                  <ApplicationLayout>
                    <CourierInformationForm />
                  </ApplicationLayout>
                </RouteProtector>
                } 
              />
              <Route path="/repeat-form" element={
                <RouteProtector isLoggedIn={isLoggedIn}>
                  <ApplicationLayout>
                    <RepeatForm />
                  </ApplicationLayout>
                </RouteProtector>
                } 
              />
            </Routes>
          </Router>
      </DataProvider>
    </QueryClientProvider>
  )
}

export default App
