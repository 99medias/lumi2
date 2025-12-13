import { Link } from 'react-router-dom';
import { CheckCircle, Lock } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Footer from '../../components/Footer';
import { useLanguage } from '../../contexts/LanguageContext';

function PrivacyPolicy() {
  const { t } = useLanguage();
  const policy = t.legal.privacyPolicy;
  const common = t.legal.common;

  return (
    <div className="min-h-screen bg-white">
      <PageHeader showLanguageSelector={true} />

      <section className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-br from-emerald-400 via-emerald-400 to-emerald-500">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">{policy.title}</h1>
          <p className="text-xl text-white/90">{policy.lastUpdate}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-lg max-w-none">

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 mb-8 flex items-start gap-4">
              <Lock className="w-8 h-8 text-emerald-600 flex-shrink-0 mt-1" />
              <p className="text-lg text-slate-700 leading-relaxed mb-0">
                {policy.intro}
              </p>
            </div>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
              {policy.section1.title}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {policy.section1.description}
            </p>
            <div className="bg-slate-50 rounded-xl p-6 mb-6">
              <ul className="space-y-2 text-lg text-slate-700">
                <li><strong>{common.society}:</strong> {common.companyName}</li>
                <li><strong>{common.legalForm}:</strong> Limited Liability Company (LLC)</li>
                <li><strong>{common.registrationNumber}:</strong> {common.registrationNum}</li>
                <li><strong>{common.address}:</strong> {common.addressValue}</li>
                <li><strong>{common.registeredAgent}:</strong> {common.registeredAgentValue}</li>
                <li><strong>{common.email}:</strong> {common.emailValue}</li>
                <li><strong>{common.phone}:</strong> {common.phoneValue}</li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
              {policy.section2.title}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {policy.section2.intro}
            </p>

            <h3 className="text-2xl font-bold text-slate-700 mb-4">{policy.section2.identificationData.title}</h3>
            <ul className="list-disc pl-6 mb-6 text-lg text-slate-700 space-y-2">
              {policy.section2.identificationData.items.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3 className="text-2xl font-bold text-slate-700 mb-4">{policy.section2.technicalData.title}</h3>
            <ul className="list-disc pl-6 mb-6 text-lg text-slate-700 space-y-2">
              {policy.section2.technicalData.items.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3 className="text-2xl font-bold text-slate-700 mb-4">{policy.section2.paymentData.title}</h3>
            <ul className="list-disc pl-6 mb-6 text-lg text-slate-700 space-y-2">
              {policy.section2.paymentData.items.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
              {policy.section3.title}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {policy.section3.intro}
            </p>
            <ul className="list-disc pl-6 mb-6 text-lg text-slate-700 space-y-2">
              {policy.section3.items.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
              {policy.section4.title}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {policy.section4.intro}
            </p>
            <ul className="list-disc pl-6 mb-6 text-lg text-slate-700 space-y-2">
              {policy.section4.items.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
              {policy.section5.title}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {policy.section5.intro}
            </p>
            <ul className="list-disc pl-6 mb-6 text-lg text-slate-700 space-y-2">
              {policy.section5.items.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 mb-6">
              <p className="text-slate-700 mb-0">
                {policy.section5.important}
              </p>
            </div>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
              {policy.section6.title}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {policy.section6.description}
            </p>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
              {policy.section7.title}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {policy.section7.intro}
            </p>
            <ul className="list-disc pl-6 mb-6 text-lg text-slate-700 space-y-2">
              {policy.section7.items.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
              {policy.section8.title}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {policy.section8.intro}
            </p>
            <ul className="list-disc pl-6 mb-6 text-lg text-slate-700 space-y-3">
              {policy.section8.items.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3 className="text-2xl font-bold text-slate-700 mb-4">{policy.section8.howToExercise.title}</h3>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {policy.section8.howToExercise.intro}
            </p>
            <div className="bg-purple-50 rounded-xl p-6 mb-6">
              <ul className="space-y-2 text-lg text-slate-700">
                <li><strong>{common.society}:</strong> {common.company}</li>
                <li><strong>{common.email}:</strong> {policy.section8.howToExercise.dpo}</li>
                <li><strong>{common.address}:</strong> {common.addressValue}</li>
                <li><strong>{common.phone}:</strong> {common.phoneValue}</li>
              </ul>
            </div>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {policy.section8.howToExercise.responseTime}
            </p>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
              {policy.section9.title}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {policy.section9.intro}
            </p>
            <ul className="list-disc pl-6 mb-6 text-lg text-slate-700 space-y-2">
              {policy.section9.items.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {policy.section9.breachNotification}
            </p>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
              {policy.section10.title}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {policy.section10.description} <Link to="/legal/cookie-policy" className="text-emerald-600 hover:text-emerald-700 font-semibold underline">{policy.section10.cookiePolicyLink}</Link>.
            </p>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
              {policy.section11.title}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {policy.section11.para1}
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {policy.section11.para2}
            </p>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-8 mt-12">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">{policy.questionsSection.title}</h3>
              <p className="text-lg text-slate-700 mb-4">
                {policy.questionsSection.description}
              </p>
              <ul className="space-y-2 text-slate-700">
                <li><strong>{common.society}:</strong> {common.company}</li>
                <li><strong>{common.email}:</strong> {policy.section8.howToExercise.dpo}</li>
                <li><strong>{common.phone}:</strong> {common.phoneValue}</li>
                <li><strong>{common.address}:</strong> {common.addressValue}</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default PrivacyPolicy;
