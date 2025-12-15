import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import About from './pages/About';
import Contact from './pages/Contact';
import AnalyseRapide from './pages/AnalyseRapide';
import BreachCheckerPage from './pages/BreachCheckerPage';
import Blog from './pages/Blog';
import BlogArticle from './pages/BlogArticle';
import TermsOfService from './pages/legal/TermsOfService';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import RefundPolicy from './pages/legal/RefundPolicy';
import LegalNotice from './pages/legal/LegalNotice';
import CookiePolicy from './pages/legal/CookiePolicy';
import VPNProduct from './pages/products/VPNProduct';
import AdBlockProduct from './pages/products/AdBlockProduct';
import SystemCleanerProduct from './pages/products/SystemCleanerProduct';
import TotalCareProduct from './pages/products/TotalCareProduct';
import AIAssistantProduct from './pages/products/AIAssistantProduct';
import MobileSecurityProduct from './pages/products/MobileSecurityProduct';
import Settings from './pages/admin/Settings';
import SourceManager from './pages/admin/SourceManager';
import ContentQueue from './pages/admin/ContentQueue';
import Dashboard from './pages/admin/Dashboard';
import Schedule from './pages/admin/Schedule';
import Diagnostics from './pages/admin/Diagnostics';
import ScrollToTop from './components/ScrollToTop';

function AppRouter() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/analyse-rapide" element={<AnalyseRapide />} />
        <Route path="/verification" element={<BreachCheckerPage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogArticle />} />
        <Route path="/products/vpn" element={<VPNProduct />} />
        <Route path="/products/adblock" element={<AdBlockProduct />} />
        <Route path="/products/system-cleaner" element={<SystemCleanerProduct />} />
        <Route path="/products/total-care" element={<TotalCareProduct />} />
        <Route path="/products/ai-assistant" element={<AIAssistantProduct />} />
        <Route path="/products/mobile-security" element={<MobileSecurityProduct />} />
        <Route path="/legal/terms" element={<TermsOfService />} />
        <Route path="/legal/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/legal/refund-policy" element={<RefundPolicy />} />
        <Route path="/legal/legal-notice" element={<LegalNotice />} />
        <Route path="/legal/cookie-policy" element={<CookiePolicy />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/sources" element={<SourceManager />} />
        <Route path="/admin/content-queue" element={<ContentQueue />} />
        <Route path="/admin/schedule" element={<Schedule />} />
        <Route path="/admin/diagnostics" element={<Diagnostics />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
