import { CheckCircle, Cookie } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Footer from '../../components/Footer';
import { useLanguage } from '../../contexts/LanguageContext';

function CookiePolicy() {
  const { t } = useLanguage();
  const policy = t.legal.cookiePolicy;
  const common = t.legal.common;

  return (
    <div className="min-h-screen bg-white">
      <PageHeader showLanguageSelector={true} />

      <section className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-br from-orange-400 via-orange-400 to-orange-500">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">{policy.title}</h1>
          <p className="text-xl text-white/90">{policy.lastUpdate}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-lg max-w-none">

            <div className="bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-200 rounded-2xl p-6 mb-8 flex items-start gap-4">
              <Cookie className="w-8 h-8 text-rose-600 flex-shrink-0 mt-1" />
              <p className="text-lg text-slate-700 leading-relaxed mb-0">
                {policy.intro}
              </p>
            </div>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-rose-500" />
              {policy.section1.title}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {policy.section1.description}
            </p>
            <ul className="list-disc pl-6 mb-6 text-lg text-slate-700 space-y-2">
              {policy.section1.items.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-rose-500" />
              {policy.section2.title}
            </h2>

            <h3 className="text-2xl font-bold text-slate-700 mb-4">{policy.section2.sessionCookies.title}</h3>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {policy.section2.sessionCookies.description}
            </p>
            <ul className="list-disc pl-6 mb-6 text-lg text-slate-700 space-y-2">
              {policy.section2.sessionCookies.items.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3 className="text-2xl font-bold text-slate-700 mb-4">{policy.section2.persistentCookies.title}</h3>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {policy.section2.persistentCookies.description}
            </p>
            <ul className="list-disc pl-6 mb-6 text-lg text-slate-700 space-y-2">
              {policy.section2.persistentCookies.items.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-rose-500" />
              {policy.section3.title}
            </h2>

            <h3 className="text-2xl font-bold text-slate-700 mb-4">{policy.section3.strictlyNecessary.title}</h3>
            <div className="bg-slate-50 rounded-xl p-6 mb-6">
              <ul className="space-y-2 text-slate-700 mb-4">
                <li><strong>Finalité :</strong> {policy.section3.strictlyNecessary.purpose}</li>
                <li><strong>Durée :</strong> {policy.section3.strictlyNecessary.duration}</li>
                <li><strong>Consentement requis :</strong> {policy.section3.strictlyNecessary.consentRequired}</li>
              </ul>
              <p className="text-slate-700 mb-2">{policy.section3.strictlyNecessary.description}</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                {policy.section3.strictlyNecessary.items.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <h3 className="text-2xl font-bold text-slate-700 mb-4">{policy.section3.performance.title}</h3>
            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <ul className="space-y-2 text-slate-700 mb-4">
                <li><strong>Finalité :</strong> {policy.section3.performance.purpose}</li>
                <li><strong>Durée :</strong> {policy.section3.performance.duration}</li>
                <li><strong>Consentement requis :</strong> {policy.section3.performance.consentRequired}</li>
              </ul>
              <p className="text-slate-700 mb-2">{policy.section3.performance.description}</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                {policy.section3.performance.items.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <p className="text-slate-700 mt-4"><strong>Outil :</strong> {policy.section3.performance.tool}</p>
            </div>

            <h3 className="text-2xl font-bold text-slate-700 mb-4">{policy.section3.functionality.title}</h3>
            <div className="bg-purple-50 rounded-xl p-6 mb-6">
              <ul className="space-y-2 text-slate-700 mb-4">
                <li><strong>Finalité :</strong> {policy.section3.functionality.purpose}</li>
                <li><strong>Durée :</strong> {policy.section3.functionality.duration}</li>
                <li><strong>Consentement requis :</strong> {policy.section3.functionality.consentRequired}</li>
              </ul>
              <p className="text-slate-700 mb-2">{policy.section3.functionality.description}</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                {policy.section3.functionality.items.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <h3 className="text-2xl font-bold text-slate-700 mb-4">{policy.section3.advertising.title}</h3>
            <div className="bg-orange-50 rounded-xl p-6 mb-6">
              <ul className="space-y-2 text-slate-700 mb-4">
                <li><strong>Finalité :</strong> {policy.section3.advertising.purpose}</li>
                <li><strong>Durée :</strong> {policy.section3.advertising.duration}</li>
                <li><strong>Consentement requis :</strong> {policy.section3.advertising.consentRequired}</li>
              </ul>
              <p className="text-slate-700 mb-2">{policy.section3.advertising.description}</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                {policy.section3.advertising.items.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <p className="text-slate-700 mt-4"><strong>Partenaires :</strong> {policy.section3.advertising.partners}</p>
            </div>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-rose-500" />
              {policy.section4.title}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {policy.section4.intro}
            </p>

            <h3 className="text-2xl font-bold text-slate-700 mb-4">{policy.section4.banner.title}</h3>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {policy.section4.banner.description}
            </p>

            <h3 className="text-2xl font-bold text-slate-700 mb-4">{policy.section4.browser.title}</h3>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {policy.section4.browser.description}
            </p>
            <ul className="list-disc pl-6 mb-6 text-lg text-slate-700 space-y-2">
              {policy.section4.browser.items.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="text-lg text-slate-700 font-semibold mb-4">{policy.section4.browser.browserLinks}</p>

            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 mb-6">
              <p className="text-slate-700 mb-0">
                {policy.section4.warning}
              </p>
            </div>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-rose-500" />
              {policy.section5.title}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {policy.section5.intro}
            </p>
            <p className="text-lg text-slate-700 font-semibold mb-4">{policy.section5.services}</p>
            <ul className="list-disc pl-6 mb-6 text-lg text-slate-700 space-y-2">
              {policy.section5.items.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {policy.section5.recommendation}
            </p>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-rose-500" />
              {policy.section6.title}
            </h2>
            <ul className="list-disc pl-6 mb-6 text-lg text-slate-700 space-y-2">
              {policy.section6.items.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-rose-500" />
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
              <CheckCircle className="w-8 h-8 text-rose-500" />
              {policy.section8.title}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {policy.section8.para1}
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {policy.section8.para2}
            </p>

            <div className="bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-200 rounded-2xl p-8 mt-12">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">{policy.questionsSection.title}</h3>
              <p className="text-lg text-slate-700 mb-4">
                {policy.questionsSection.description}
              </p>
              <ul className="space-y-2 text-slate-700">
                <li><strong>{common.society}:</strong> {common.company}</li>
                <li><strong>{common.email}:</strong> {common.emailValue}</li>
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

export default CookiePolicy;
