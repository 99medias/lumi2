import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Footer from '../../components/Footer';
import { useLanguage } from '../../contexts/LanguageContext';

function TermsOfService() {
  const { t } = useLanguage();
  const tos = t.legal.termsOfService;

  return (
    <div className="min-h-screen bg-white">
      <PageHeader showLanguageSelector={true} />

      <section className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-br from-emerald-400 via-emerald-400 to-emerald-500">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">{tos.title}</h1>
          <p className="text-xl text-white/90">{tos.lastUpdate}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-lg max-w-none">

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 mb-8">
              <p className="text-lg text-slate-700 leading-relaxed mb-0">
                {tos.intro.split('MySafeSecurity')[0]}
                <strong>MySafeSecurity</strong>
                {tos.intro.split('MySafeSecurity')[1]}
              </p>
            </div>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
              {tos.section1.title}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {tos.section1.intro}
            </p>
            <ul className="list-disc pl-6 mb-6 text-lg text-slate-700 space-y-2">
              {tos.section1.items.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
              {tos.section2.title}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {tos.section2.intro}
            </p>
            <ul className="list-disc pl-6 mb-6 text-lg text-slate-700 space-y-2">
              {tos.section2.items.map((item: string, index: number) => (
                <li key={index}>
                  {item.includes(':') ? (
                    <>
                      <strong>{item.split(':')[0]}:</strong>
                      {item.split(':')[1]}
                    </>
                  ) : item}
                </li>
              ))}
            </ul>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {tos.section2.outro}
            </p>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
              {tos.section3.title}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {tos.section3.para1}
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {tos.section3.para2}
            </p>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
              {tos.section4.title}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {(() => {
                const delimiter = tos.section4.para1.includes('30 jours') ? '30 jours' : tos.section4.para1.includes('30 days') ? '30 days' : '30 días';
                const parts = tos.section4.para1.split(delimiter);
                return (
                  <>
                    {parts[0]}
                    <strong>{delimiter}</strong>
                    {parts[1]}
                  </>
                );
              })()}
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {tos.section4.para2.split(tos.contact.phoneValue)[0]}
              <strong>{tos.contact.phoneValue}</strong>
              {tos.section4.para2.split(tos.contact.phoneValue)[1]?.split('contact@mysafesecurity.org')[0]}
              <strong>contact@mysafesecurity.org</strong>
              {tos.section4.para2.split('contact@mysafesecurity.org')[1]}
            </p>
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 mb-6">
              <p className="text-slate-700 mb-0">
                <strong>{tos.section4.important.split(':')[0]}:</strong>
                {tos.section4.important.split(':')[1]}
              </p>
            </div>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
              {tos.section5.title}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-4">
              {tos.section5.intro}
            </p>
            <ul className="list-disc pl-6 mb-6 text-lg text-slate-700 space-y-2">
              {tos.section5.items.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
              {tos.section6.title}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-4">
              {tos.section6.intro}
            </p>
            <ul className="list-disc pl-6 mb-6 text-lg text-slate-700 space-y-2">
              {tos.section6.items.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
              {tos.section7.title}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {tos.section7.intro}
            </p>
            <ul className="list-disc pl-6 mb-6 text-lg text-slate-700 space-y-2">
              {tos.section7.items.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
              {tos.section8.title}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {tos.section8.para1.split(tos.section8.privacyPolicyLink)[0]}
              <Link to="/legal/privacy-policy" className="text-emerald-600 hover:text-emerald-700 font-semibold underline">
                {tos.section8.privacyPolicyLink}
              </Link>
              {tos.section8.para1.split(tos.section8.privacyPolicyLink)[1]}
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {tos.section8.para2.split('dpo@mysafesecurity.fr')[0]}
              <strong>dpo@mysafesecurity.fr</strong>
              {tos.section8.para2.split('dpo@mysafesecurity.fr')[1]}
            </p>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
              {tos.section9.title}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {tos.section9.para1}
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {tos.section9.para2}
            </p>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
              {tos.section10.title}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {tos.section10.para1}
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {tos.section10.para2}
            </p>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
              {tos.section11.title}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {tos.section11.para1}
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {tos.section11.para2}{' '}
              <a href="https://ec.europa.eu/consumers/odr" className="text-emerald-600 hover:text-emerald-700 underline" target="_blank" rel="noopener noreferrer">
                https://ec.europa.eu/consumers/odr
              </a>.
            </p>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-50 border-2 border-emerald-200 rounded-2xl p-8 mt-12">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">{tos.contact.title}</h3>
              <p className="text-lg text-slate-700 mb-4">
                {tos.contact.intro}
              </p>
              <ul className="space-y-2 text-slate-700">
                <li><strong>{tos.contact.company}:</strong> Digital Genesys Solutions LLC</li>
                <li><strong>{tos.contact.phone}:</strong> {tos.contact.phoneValue}</li>
                <li><strong>{tos.contact.email}:</strong> contact@mysafesecurity.org</li>
                <li><strong>{tos.contact.address}:</strong> 5203 Juan Tabo Blvd STE 2B, Albuquerque, NM 87111, USA</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default TermsOfService;
