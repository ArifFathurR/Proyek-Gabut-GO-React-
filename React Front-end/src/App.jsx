import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Create from './pages/Create';
import Edit from './pages/Edit';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import BottomNavbar from './components/BottomNavbar';

function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#1e293b',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      }} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<>
            <Dashboard />
            <BottomNavbar />
          </>} />
          <Route path="/create" element={<>
            <Create />
            <BottomNavbar />
          </>} />
          <Route path="/edit/:id" element={<>
            <Edit />
            <BottomNavbar />
          </>} />
          <Route path="/profile" element={<>
            <Profile />
            <BottomNavbar />
          </>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
