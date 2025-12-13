import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Users, Phone, Lock, Heart, Coffee, Smile, HandHeart, Home, Clock, Shield } from 'lucide-react';
import Header from '../components/Header';
import Logo from '../components/Logo';
import { useLanguage } from '../contexts/LanguageContext';

interface StatItem {
  number: string;
  label: string;
}

interface ValueItem {
  title: string;
  description: string;
}

interface TestimonialItem {
  text: string;
  name: string;
  age: string;
  location: string;
}

function About() {
  const { t } = useLanguage();
  const [animatedElements, setAnimatedElements] = useState<Set<number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setAnimatedElements((prev) => new Set(prev).add(index));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const aboutData = t.about;

  const statIcons = [Home, Phone, Smile, Heart];
  const valueIcons = [Heart, HandHeart, Coffee, Shield];
  const benefitIcons = [Phone, Users, Coffee, Clock, Heart, Lock];

  const valueColors = [
    { color: 'from-rose-400 to-pink-500', bgColor: 'from-rose-50 to-pink-50' },
    { color: 'from-violet-400 to-purple-500', bgColor: 'from-violet-50 to-purple-50' },
    { color: 'from-amber-400 to-emerald-500', bgColor: 'from-amber-50 to-emerald-50' },
    { color: 'from-emerald-400 to-emerald-500', bgColor: 'from-emerald-50 to-emerald-50' }
  ];

  const benefitColors = [
    'text-purple-600', 'text-emerald-600', 'text-amber-600',
    'text-emerald-600', 'text-rose-600', 'text-violet-600'
  ];

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-25px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
      `}</style>

      <Header />

      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-emerald-400 via-emerald-400 to-emerald-500">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-white rounded-full filter blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full filter blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-yellow-200 rounded-full filter blur-3xl animate-float"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6">{aboutData.title}</h1>
            <p className="text-2xl md:text-3xl text-white max-w-4xl mx-auto leading-relaxed font-medium">{aboutData.subtitle}</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(aboutData.stats as StatItem[]).map((stat, index) => {
              const Icon = statIcons[index];
              const colors = [
                { color: 'from-emerald-400 to-emerald-500', bgColor: 'from-emerald-50 to-emerald-100' },
                { color: 'from-purple-400 to-purple-500', bgColor: 'from-purple-50 to-purple-100' },
                { color: 'from-amber-400 to-amber-500', bgColor: 'from-amber-50 to-amber-100' },
                { color: 'from-rose-400 to-rose-500', bgColor: 'from-rose-50 to-rose-100' }
              ];
              return (
                <div
                  key={index}
                  data-index={index}
                  className={`animate-on-scroll text-center p-8 rounded-3xl bg-gradient-to-br ${colors[index].bgColor} border-2 border-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 ${animatedElements.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${colors[index].color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-5xl font-extrabold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent mb-2">{stat.number}</div>
                  <div className="text-slate-700 font-semibold text-lg">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-96 h-96 bg-rose-300 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-300 rounded-full filter blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-emerald-600 via-emerald-600 to-emerald-600 bg-clip-text text-transparent mb-6">{aboutData.story.title}</h2>
            <p className="text-2xl text-slate-700 max-w-3xl mx-auto">{aboutData.story.subtitle}</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-white to-emerald-50 rounded-3xl p-12 shadow-2xl border-2 border-emerald-100">
              <p className="text-xl text-slate-700 leading-relaxed mb-6">
                <strong className="text-emerald-600">MaSécurité</strong> {aboutData.story.paragraph1.replace('MaSécurité est née', 'est née').replace('MaSécurité was born', 'was born').replace('MaSécurité nació', 'nació')}
              </p>
              <p className="text-xl text-slate-700 leading-relaxed mb-6">
                {aboutData.story.paragraph2.split('chacun mérite')[0]}<strong className="text-emerald-600">{aboutData.story.paragraph2.match(/chacun mérite[^.]+\./)?.[0] || aboutData.story.paragraph2.match(/everyone deserves[^.]+\./)?.[0] || aboutData.story.paragraph2.match(/todos merecen[^.]+\./)?.[0]}</strong>{aboutData.story.paragraph2.split(/\. C'est|That's why|Por eso/)[1] ? '. ' + aboutData.story.paragraph2.split(/\. C'est|That's why|Por eso/)[1] : ''}
              </p>
              <p className="text-xl text-slate-700 leading-relaxed mb-6">
                {aboutData.story.paragraph3.split('prendre le temps')[0]}<strong className="text-emerald-600">{aboutData.story.paragraph3.match(/prendre le temps nécessaire|take the necessary time|tomar el tiempo necesario/)?.[0]}</strong>{aboutData.story.paragraph3.split(/avec chaque|with each|con cada/)[1] ? ' ' + aboutData.story.paragraph3.split(/avec chaque|with each|con cada/)[0].split(/\. /).pop() + ' avec chaque' + aboutData.story.paragraph3.split(/avec chaque|with each|con cada/)[1] : aboutData.story.paragraph3.replace(/.*prendre le temps nécessaire|.*take the necessary time|.*tomar el tiempo necesario/, '')}
              </p>
              <p className="text-xl text-slate-700 leading-relaxed">
                {aboutData.story.paragraph4.split('150')[0]}<strong className="text-emerald-600">150 000 {aboutData.story.paragraph4.match(/familles|families|familias/)?.[0]}</strong>{aboutData.story.paragraph4.split(/150[., ]000 familles|150[., ]000 families|150[., ]000 familias/)[1]}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-6">{aboutData.valuesSection.title}</h2>
            <p className="text-2xl text-slate-700">{aboutData.valuesSection.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {(aboutData.valuesSection.items as ValueItem[]).map((value, index) => {
              const Icon = valueIcons[index];
              return (
                <div
                  key={index}
                  data-index={index + 20}
                  className={`animate-on-scroll bg-white rounded-3xl p-10 shadow-2xl border-2 border-white hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 ${animatedElements.has(index + 20) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                  <div className={`w-20 h-20 bg-gradient-to-br ${valueColors[index].color} rounded-3xl flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent mb-4">{value.title}</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-emerald-600 via-emerald-600 to-emerald-600 bg-clip-text text-transparent mb-6">{aboutData.benefits.title}</h2>
            <p className="text-2xl text-slate-700">{aboutData.benefits.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {aboutData.benefits.items.map((benefit: string, index: number) => {
              const Icon = benefitIcons[index];
              return (
                <div
                  key={index}
                  data-index={index + 30}
                  className={`animate-on-scroll bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 shadow-lg border-2 border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ${animatedElements.has(index + 30) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                  <div className="flex items-center gap-4">
                    <Icon className={`w-8 h-8 ${benefitColors[index]}`} />
                    <span className="text-lg font-semibold text-slate-700">{benefit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-amber-50 via-emerald-50 to-rose-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-96 h-96 bg-amber-300 rounded-full filter blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-300 rounded-full filter blur-3xl animate-float-delayed"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-amber-600 via-emerald-600 to-rose-600 bg-clip-text text-transparent mb-6">{aboutData.testimonialsSection.title}</h2>
            <p className="text-2xl text-slate-700">{aboutData.testimonialsSection.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {(aboutData.testimonialsSection.items as TestimonialItem[]).map((testimonial, index) => (
              <div
                key={index}
                data-index={index + 40}
                className={`animate-on-scroll bg-white rounded-3xl p-8 shadow-2xl border-2 border-white hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 ${animatedElements.has(index + 40) ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              >
                <div className="text-6xl mb-4 text-amber-400">❝</div>
                <p className="text-lg text-slate-700 leading-relaxed mb-6 italic max-w-lg mx-auto">{testimonial.text}</p>
                <div className="border-t-2 border-slate-100 pt-4">
                  <div className="font-bold text-xl text-slate-800">{testimonial.name}</div>
                  <div className="text-slate-600">{testimonial.age} • {testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-emerald-500 via-emerald-500 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <Shield className="w-20 h-20 text-white mx-auto mb-8" />
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-8">
            {aboutData.cta.title}
          </h2>
          <p className="text-2xl md:text-3xl text-white mb-12 max-w-3xl mx-auto leading-relaxed">
            {aboutData.cta.subtitle}
          </p>
          <Link
            to="/contact"
            className="inline-block px-12 py-5 bg-white text-emerald-600 rounded-2xl text-xl font-bold hover:bg-emerald-50 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
          >
            {aboutData.cta.button}
          </Link>
        </div>
      </section>

      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <Logo variant="footer" className="mb-4" />
              <p className="text-slate-400 leading-relaxed">{aboutData.cta.description}</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-emerald-400">{t('footer.information')}</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-slate-400 hover:text-white transition-colors">{aboutData.footerLinks.about}</Link></li>
                <li><Link to="/contact" className="text-slate-400 hover:text-white transition-colors">{t('footer.contact')}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-emerald-400">{aboutData.footerLinks.legal}</h3>
              <ul className="space-y-2">
                <li><Link to="/legal/privacy-policy" className="text-slate-400 hover:text-white transition-colors">{aboutData.footerLinks.privacy}</Link></li>
                <li><Link to="/legal/terms" className="text-slate-400 hover:text-white transition-colors">{aboutData.footerLinks.terms}</Link></li>
                <li><Link to="/legal/legal-notice" className="text-slate-400 hover:text-white transition-colors">{aboutData.footerLinks.mentions}</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center">
            <p className="text-slate-400">© 2025 MaSécurité. {t('footer.rights')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default About;
