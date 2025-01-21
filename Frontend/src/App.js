import './App.css';
import { Routes, Route } from 'react-router-dom'
import Homapage from './pages/Homepage'
import Register from './components/Register';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Task from './components/Task';
import Dashboard from './pages/Dashboard';
import { useSelector } from 'react-redux';
import { selectUser } from './redux/userReducer';
import UpdateTask from './components/UpdateTask';
import Homepage from './pages/Homepage';
import Profile from './components/Profile';
import { useEffect } from 'react';

function App() {
  const { user } = useSelector(selectUser);

  useEffect(() => {
    document.title = "Task Manager";
  })
  // const location = useLocation();

  // const NavbarWrapper = () => {
  //   const hideNavbarPaths = ["/signin", "/signup"];
  //   return hideNavbarPaths.includes(location.pathname) ? null : (
  //     <div className="sticky top-0 z-50">
  //       <Navbar />
  //     </div>
  //   );
  // };

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Homapage />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Register />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/task" element={user ? <Task /> : <Homapage />} />
        <Route path="/task/:id" element={<UpdateTask />} />
        <Route path='/profile' element={user ? <Profile /> : <Homepage />} />
      </Routes>
    </div>
  );
}

export default App;

