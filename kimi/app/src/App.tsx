import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CookieConsentBanner } from '@/components/CookieConsent';
import Home from '@/pages/Home';
import Chosko from '@/pages/Chosko';
import Kaolin from '@/pages/Kaolin';
import ServiceAppointments from '@/pages/ServiceAppointments';
import Policy from '@/pages/Policy';

function App() {
  return (
    <HashRouter>
      <CookieConsentBanner />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Chosko/*" element={<Chosko />} />
        <Route path="/Kaolin/*" element={<Kaolin />} />
        <Route path="/service-appointments/*" element={<ServiceAppointments />} />
        <Route path="/policy.html" element={<Policy />} />
        {/* Redirect old paths */}
        <Route path="/Chosko" element={<Navigate to="/Chosko/" replace />} />
        <Route path="/Kaolin" element={<Navigate to="/Kaolin/" replace />} />
        <Route path="/service-appointments" element={<Navigate to="/service-appointments/" replace />} />
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
