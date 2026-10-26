import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Calculadora from '@/pages/Calculadora';
import Codigos from '@/pages/Codigos';
import Urgencias from '@/pages/Urgencias';
import Receituarios from '@/pages/Receituarios';
import Receita from '@/pages/Receita';
import Painel from '@/pages/Painel';
import RaioX from '@/pages/RaioX';
import Pacientes from '@/pages/Pacientes';
import PacienteDetalhe from '@/pages/PacienteDetalhe';
import Laserterapia from '@/pages/Laserterapia';
import Interacoes from '@/pages/Interacoes';
import Apostilas from '@/pages/Apostilas';
import Calculadora2 from '@/pages/Calculadora2';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

const AuthenticatedApp = () => {
  const { isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Na versão própria o Layout (antes aplicado automaticamente pelo
  // Base44) envolve as páginas aqui. Calculadoras e consultas são
  // públicas; pacientes, prontuários e raio-x exigem login no servidor
  // (o aviso aparece nessas páginas quando não há conta ativa).
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/ForgotPassword" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/ResetPassword" element={<ResetPassword />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/painel" element={<Painel />} />
        <Route path="/raio-x" element={<RaioX />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/pacientes/:id" element={<PacienteDetalhe />} />
        <Route path="/calculadora" element={<Calculadora />} />
        <Route path="/modulos/codigos" element={<Codigos />} />
        <Route path="/modulos/urgencias" element={<Urgencias />} />
        <Route path="/modulos/laser" element={<Laserterapia />} />
        <Route path="/modulos/receituarios" element={<Receituarios />} />
        <Route path="/modulos/receita" element={<Receita />} />
        <Route path="/modulos/interacoes" element={<Interacoes />} />
        <Route path="/apostilas" element={<Apostilas />} />
        <Route path="/calculadora2" element={<Calculadora2 />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
