import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ApplicationLayout from "./components/layouts/ApplicationLayout";
import Records from "./components/routes/Records";
import Results from "./components/routes/Results";
import Courier from "./components/routes/courier/Courier";
import FillupForm from "./components/routes/form/FillupForm";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/dashboard/*" element={
            <ApplicationLayout>
              <Dashboard />
            </ApplicationLayout>} 
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
    </>
  )
}

export default App
