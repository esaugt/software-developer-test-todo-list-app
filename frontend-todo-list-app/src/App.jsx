import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import Nav from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Todos from './pages/Todos';
import NotFound from './pages/NotFound';

function Home() {
  return (
    <div style={{ maxWidth: 700, margin: '2rem auto' }}>
      <h1>Todo App</h1>
      <p>SPA con login/registro y tasks con uuid y estados.</p>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<Todos />} />
        </Route>

        {/* Redirects y 404 */}
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
