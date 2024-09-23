// App.js

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import MainApp from './components/MainApp';
import ProfileForm from './components/ProfileForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/main" element={<MainApp />} />
        <Route path="/profile" element={<ProfileForm />} />
        
      </Routes>
    </Router>
  );
}

export default App;
