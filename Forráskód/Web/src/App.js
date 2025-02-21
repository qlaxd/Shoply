import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import LoginSignup from './pages/LoginSignup/LoginSignup';
import PrivateRoute from './utils/PrivateRoute';
import ListEditor from './components/ListEditor/ListEditor';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/register" element={<LoginSignup isRegister />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/lists/:id" element={<ListEditor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
