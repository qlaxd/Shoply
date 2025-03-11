import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import LoginSignup from './pages/LoginSignup/LoginSignup';
import ProductCatalogPage from './pages/ProductCatalog/ProductCatalogPage';
import PrivateRoute from './utils/PrivateRoute';
import ListEditor from './components/features/lists/ListEditor';
import MainLayout from './components/layout/MainLayout/MainLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/register" element={<LoginSignup isRegister />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/list/:id" element={<MainLayout><ListEditor /></MainLayout>} />
          <Route path="/products" element={<MainLayout><ProductCatalogPage /></MainLayout>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
