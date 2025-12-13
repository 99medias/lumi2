import { CheckCircle, RotateCcw } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Footer from '../../components/Footer';
import { useLanguage } from '../../contexts/LanguageContext';

function RefundPolicy() {
  const { t } = useLanguage();
  const policy = t.legal.refundPolicy;
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

            <div className="bg-gradient-to-br from-orange-50 to-orange-50 border-2 border-orange-200 rounded-2xl p-6 mb-8 flex items-start gap-4">
              <RotateCcw className="w-8 h-8 text-orange-600 flex-shrink-0 mt-1" />
              <p className="text-lg text-slate-700 leading-relaxed mb-0">
                {policy.intro}
              </p>
            </div>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-orange-500" />
              {policy.section1.title}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {policy.section1.para1}
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {policy.section1.para2}
            </p>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-orange-500" />
              {policy.section2.title}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {policy.section2.intro}
            </p>
            <ul className="list-disc pl-6 mb-6 text-lg text-slate-700 space-y-2">
              {policy.section2.items.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
              <p className="text-slate-700 mb-0">
                <strong>{policy.section2.advice}</strong>
              </p>
            </div>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-orange-500" />
              {policy.section3.title}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {policy.section3.intro}
            </p>

            <h3 className="text-2xl font-bold text-slate-700 mb-4">{policy.section3.installation.title}</h3>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {policy.section3.installation.description}
            </p>

            <h3 className="text-2xl font-bold text-slate-700 mb-4">{policy.section3.proportional.title}</h3>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {policy.section3.proportional.description}
            </p>
            <div className="bg-slate-50 rounded-xl p-6 mb-6">
              <p className="text-slate-700 mb-0 font-mono text-sm">
                {policy.section3.proportional.example}
              </p>
            </div>

            <h3 className="text-2xl font-bold text-slate-700 mb-4">{policy.section3.hardware.title}</h3>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {policy.section3.hardware.description}
            </p>
            <ul className="list-disc pl-6 mb-6 text-lg text-slate-700 space-y-2">
              {policy.section3.hardware.items.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-orange-500" />
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
              <CheckCircle className="w-8 h-8 text-orange-500" />
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
                {policy.section5.note}
              </p>
            </div>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-orange-500" />
              {policy.section6.title}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {policy.section6.intro}
            </p>
            <ul className="list-disc pl-6 mb-6 text-lg text-slate-700 space-y-2">
              {policy.section6.items.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-orange-500" />
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
              <CheckCircle className="w-8 h-8 text-orange-500" />
              {policy.section8.title}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {policy.section8.intro}
            </p>
            <ul className="list-disc pl-6 mb-6 text-lg text-slate-700 space-y-2">
              {policy.section8.items.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <div className="bg-gradient-to-br from-orange-50 to-pink-50 border-2 border-orange-200 rounded-2xl p-8 mt-12">
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

export default RefundPolicy;
