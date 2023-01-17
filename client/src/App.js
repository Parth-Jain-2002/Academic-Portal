import './App.css';
import Signup from './components/Signup';
import Login from './components/Login';
import ForgotPassword from './components/ForgetPassword';
import BatchAdvisior from './components/BatchAdvisior';
import Student from './components/Student';
import Instructor from './components/Instructor';
import AuthProvider, { useAuth } from './contexts/AuthContext';
import {Routes, Route, Navigate} from 'react-router-dom'
import SignupOtp from './components/SignupOtp';
import LoginOtp from './components/LoginOtp';

function App() {
  const PrivateRoute = ({ children }) => {
    const {currentUser} = useAuth() 
    return currentUser ? children : <Navigate to="/login" />;
  }

  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/signup" element={<Signup/>} />
          <Route path="/signup-otp" element={<SignupOtp/>} />
          <Route path="/login-otp" element={<LoginOtp/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          <Route path="/batch-advisior" element={<BatchAdvisior/>} />
          <Route path="/student/:email" element={<Student/>} />
          <Route path="/instructor/:email" element={<Instructor/>} />
          {/* <Route path="/update-profile" element={<PrivateRoute><UpdateProfile/></PrivateRoute>} /> */}
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
