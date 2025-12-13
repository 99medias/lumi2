import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import Logo from '../components/Logo';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { usePhoneByLocation } from '../hooks/usePhoneByLocation';
import { formatPhoneForTel } from '../utils/phoneNumber';

function Contact() {
  const { t } = useLanguage();
  const { phoneInfo, loading: phoneLoading } = usePhoneByLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaQuestion, setCaptchaQuestion] = useState({ question: '', answer: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const generateCaptcha = useCallback(() => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaQuestion({
      question: `${t('contact.form.captcha')} ${num1} + ${num2} ?`,
      answer: num1 + num2
    });
    setCaptchaAnswer('');
  }, [t]);

  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (parseInt(captchaAnswer) !== captchaQuestion.answer) {
      setSubmitStatus('error');
      setErrorMessage(t('contact.form.captchaError'));
      generateCaptcha();
      return;
    }

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setSubmitStatus('error');
      setErrorMessage(t('contact.form.error'));
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject,
          message: formData.message,
          status: 'nouveau'
        }]);

      if (error) throw error;

      try {
        await supabase.functions.invoke('send-contact-notification', {
          body: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || '',
            subject: formData.subject,
            message: formData.message
          }
        });
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
      }

      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setCaptchaAnswer('');
      generateCaptcha();

      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setErrorMessage(t('contact.form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: Phone,
      title: t('contact.info.phone.title'),
      subtitle: t('contact.info.phone.hours'),
      value: phoneInfo ? `${phoneInfo.flag} ${phoneInfo.localNumber}` : t('contact.info.phone.value'),
      link: phoneInfo ? `tel:${formatPhoneForTel(phoneInfo)}` : 'tel:0189712866',
      color: 'from-emerald-400 to-emerald-500',
      bgColor: 'from-emerald-50 to-emerald-50'
    },
    {
      icon: Mail,
      title: t('contact.info.email.title'),
      subtitle: t('contact.info.email.responseTime'),
      value: t('contact.info.email.value'),
      link: 'mailto:contact@mysafesecurity.org',
      color: 'from-emerald-400 to-emerald-500',
      bgColor: 'from-emerald-50 to-emerald-50'
    },
    {
      icon: MapPin,
      title: t('contact.info.address.title'),
      subtitle: t('contact.info.address.officeSubtitle'),
      value: t('contact.info.address.value'),
      link: '#',
      color: 'from-purple-400 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50'
    },
    {
      icon: Clock,
      title: t('contact.info.phone.hours').includes('24') ? 'Horaires' : 'Hours',
      subtitle: 'Support technique',
      value: t('contact.info.phone.hours'),
      link: '#',
      color: 'from-amber-400 to-emerald-500',
      bgColor: 'from-amber-50 to-emerald-50'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-emerald-400 via-emerald-400 to-emerald-500">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-yellow-200 rounded-full filter blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6">{t('contact.title')}</h1>
            <p className="text-2xl md:text-3xl text-white max-w-4xl mx-auto leading-relaxed font-medium">{t('contact.subtitle')}</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <a
                key={index}
                href={method.link}
                className={`block bg-gradient-to-br ${method.bgColor} rounded-3xl p-8 shadow-xl border-2 border-white hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group`}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${method.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <method.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{method.title}</h3>
                <p className="text-sm text-slate-600 mb-3">{method.subtitle}</p>
                <p className="text-lg font-semibold text-slate-700">{method.value}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-emerald-600 via-emerald-600 to-emerald-600 bg-clip-text text-transparent mb-6">
              {t('contact.form.send')}
            </h2>
            <p className="text-xl text-slate-700">{t('contact.form.formIntro')}</p>
          </div>

          {submitStatus === 'success' && (
            <div className="mb-8 bg-gradient-to-r from-emerald-50 to-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 flex items-start gap-4 animate-fade-in">
              <CheckCircle className="w-8 h-8 text-emerald-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-emerald-800 mb-2">{t('contact.form.success')}</h3>
                <p className="text-emerald-700">Merci pour votre message. Notre équipe vous répondra dans les 24 heures. Si c'est urgent, n'hésitez pas à nous appeler au {t('contact.info.phone.value')}.</p>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-8 bg-gradient-to-r from-rose-50 to-pink-50 border-2 border-rose-300 rounded-2xl p-6 flex items-start gap-4 animate-fade-in">
              <AlertCircle className="w-8 h-8 text-rose-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-rose-800 mb-2">{t('contact.form.error').split('.')[0] || 'Erreur'}</h3>
                <p className="text-rose-700">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-2xl border-2 border-slate-100 p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-lg font-semibold text-slate-700 mb-2">
                  {t('contact.form.name')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl text-lg focus:border-emerald-400 focus:outline-none transition-colors"
                  placeholder="Jean Dupont"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-lg font-semibold text-slate-700 mb-2">
                  {t('contact.form.email')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl text-lg focus:border-emerald-400 focus:outline-none transition-colors"
                  placeholder="jean.dupont@email.fr"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="phone" className="block text-lg font-semibold text-slate-700 mb-2">
                  {t('contact.form.phone')} <span className="text-slate-400">(optionnel)</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl text-lg focus:border-emerald-400 focus:outline-none transition-colors"
                  placeholder="06 12 34 56 78"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-lg font-semibold text-slate-700 mb-2">
                  {t('contact.form.subject')} <span className="text-rose-500">*</span>
                </label>
                <select
                  id="subject"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl text-lg focus:border-emerald-400 focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="">{t('contact.form.selectSubject')}</option>
                  <option value="question-generale">{t('contact.form.subjectOptions.general')}</option>
                  <option value="support-technique">{t('contact.form.subjectOptions.technical')}</option>
                  <option value="abonnement">{t('contact.form.subjectOptions.subscription')}</option>
                  <option value="facturation">{t('contact.form.subjectOptions.billing')}</option>
                  <option value="autre">{t('contact.form.subjectOptions.other')}</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-lg font-semibold text-slate-700 mb-2">
                {t('contact.form.message')} <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="message"
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={6}
                className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl text-lg focus:border-emerald-400 focus:outline-none transition-colors resize-none"
                placeholder={t('contact.form.messagePlaceholder')}
              />
            </div>

            <div className="mb-8 bg-gradient-to-br from-amber-50 to-emerald-50 border-2 border-amber-200 rounded-2xl p-6">
              <label htmlFor="captcha" className="block text-lg font-semibold text-slate-700 mb-3">
                {t('contact.form.securityCheck')} <span className="text-rose-500">*</span>
              </label>
              <p className="text-xl font-bold text-slate-800 mb-4">{captchaQuestion.question}</p>
              <div className="flex gap-4">
                <input
                  type="number"
                  id="captcha"
                  required
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  className="flex-1 px-5 py-4 border-2 border-amber-300 rounded-xl text-lg focus:border-amber-500 focus:outline-none transition-colors"
                  placeholder="Votre réponse"
                />
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="px-6 py-4 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors"
                >
                  Nouveau calcul
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-gradient-to-r from-emerald-500 to-emerald-500 text-white rounded-2xl text-xl font-bold hover:from-emerald-600 hover:to-emerald-600 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  {t('contact.form.sending')}
                </>
              ) : (
                <>
                  <Send className="w-6 h-6" />
                  {t('contact.form.send')}
                </>
              )}
            </button>

            <p className="text-center text-slate-600 mt-6">
              Ou appelez-nous directement au <a href={phoneInfo ? `tel:${formatPhoneForTel(phoneInfo)}` : 'tel:0189712866'} className="font-bold text-emerald-600 hover:text-emerald-700">{phoneInfo ? `${phoneInfo.flag} ${phoneInfo.localNumber}` : t('contact.info.phone.value')}</a>
            </p>
          </form>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-emerald-500 via-emerald-500 to-emerald-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-yellow-200 rounded-full filter blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Phone className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{t('contact.features.immediateSupport.title')}</h3>
              <p className="text-lg text-white/90">{t('contact.features.immediateSupport.description')}</p>
            </div>
            <div>
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{t('contact.features.quickResponse.title')}</h3>
              <p className="text-lg text-white/90">{t('contact.features.quickResponse.description')}</p>
            </div>
            <div>
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{t('contact.features.caringTeam.title')}</h3>
              <p className="text-lg text-white/90 max-w-sm mx-auto leading-relaxed">{t('contact.features.caringTeam.description')}</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Logo size={48} />
                <span className="text-2xl font-bold">MySafeSecurity</span>
              </div>
              <p className="text-slate-400 leading-relaxed">Solutions Cloud sécurisées pour particuliers et professionnels</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-emerald-400">Navigation</h3>
              <ul className="space-y-3">
                <li><Link to="/" className="text-slate-400 hover:text-white transition-colors">{t('nav.home')}</Link></li>
                <li><Link to="/about" className="text-slate-400 hover:text-white transition-colors">{t('footer.about')}</Link></li>
                <li><Link to="/#pricing" className="text-slate-400 hover:text-white transition-colors">{t('footer.pricing')}</Link></li>
                <li><Link to="/contact" className="text-slate-400 hover:text-white transition-colors">{t('footer.contact')}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-emerald-400">{t('footer.legal')}</h3>
              <ul className="space-y-3">
                <li><Link to="/legal/privacy-policy" className="text-slate-400 hover:text-white transition-colors">{t('footer.privacyPolicy')}</Link></li>
                <li><Link to="/legal/terms" className="text-slate-400 hover:text-white transition-colors">{t('footer.terms')}</Link></li>
                <li><Link to="/legal/refund-policy" className="text-slate-400 hover:text-white transition-colors">{t('footer.refundPolicy')}</Link></li>
                <li><Link to="/legal/cookie-policy" className="text-slate-400 hover:text-white transition-colors">{t('footer.cookiePolicy')}</Link></li>
                <li><Link to="/legal/legal-notice" className="text-slate-400 hover:text-white transition-colors">{t('footer.legalNotice')}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-emerald-400">{t('footer.contact')}</h3>
              <ul className="space-y-3">
                <li className="text-slate-400">{t('footer.support247')}</li>
                <li className="text-xl font-bold text-emerald-400">{t('contact.info.phone.value')}</li>
                <li className="text-slate-400">{t('contact.info.email.value')}</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center">
            <p className="text-slate-400">© 2025 MySafeSecurity. {t('footer.rights')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Contact;
