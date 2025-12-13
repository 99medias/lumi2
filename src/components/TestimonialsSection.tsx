import { useState, useEffect } from 'react';
import { Star, Quote, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string | null;
  avatar_url: string | null;
  rating: number;
  comment: string;
  product: string;
  featured: boolean;
  verified: boolean;
  location: string | null;
  created_at: string;
}

const TestimonialsSection = () => {
  const { t, language } = useLanguage();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('featured', true)
          .eq('language', language)
          .order('rating', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) {
          console.error('Error fetching testimonials:', error);
        } else {
          setTestimonials(data || []);
        }
      } catch (err) {
        console.error('Failed to fetch testimonials:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [language]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'from-orange-400 to-orange-600',
      'from-orange-400 to-orange-600',
      'from-orange-400 to-orange-600',
      'from-amber-400 to-amber-600',
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-orange-400 to-orange-600',
      'from-green-400 to-green-600'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-white to-orange-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              {t('testimonials.title')}
            </h2>
            <div className="animate-pulse flex justify-center gap-2">
              <div className="h-4 w-32 bg-slate-300 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-white to-orange-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-20 w-72 h-72 bg-orange-200 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-orange-200 rounded-full filter blur-3xl animate-float-delayed"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-6 py-2 bg-orange-100 rounded-full text-orange-700 font-semibold mb-6">
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-orange-600" />
              {t('testimonials.badge')}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {t('testimonials.subtitle')}
          </p>

          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-3xl font-bold text-slate-900">4.9/5</p>
              <p className="text-slate-600 text-sm">{t('testimonials.averageRating')}</p>
            </div>
            <div className="h-16 w-px bg-slate-300"></div>
            <div className="text-center">
              <p className="text-3xl font-bold text-slate-900">10,000+</p>
              <p className="text-slate-600 text-sm">{t('testimonials.happyCustomers')}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 relative"
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Quote className="w-6 h-6 text-white" />
              </div>

              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-200 text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                {testimonial.verified && (
                  <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                    <CheckCircle className="w-4 h-4" />
                    <span>{t('testimonials.verified')}</span>
                  </div>
                )}
              </div>

              <p className="text-slate-700 leading-relaxed mb-6 italic max-w-sm mx-auto">
                "{testimonial.comment}"
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                {testimonial.avatar_url ? (
                  <img
                    src={testimonial.avatar_url}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${getAvatarColor(
                      testimonial.name
                    )} rounded-full flex items-center justify-center text-white font-bold shadow-md`}
                  >
                    {getInitials(testimonial.name)}
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-bold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-600">
                    {testimonial.role}
                    {testimonial.company && ` • ${testimonial.company}`}
                  </p>
                  {testimonial.location && (
                    <p className="text-xs text-slate-500 mt-1">{testimonial.location}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {testimonials.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-slate-600">{t('testimonials.noTestimonials')}</p>
          </div>
        )}

        <div className="text-center mt-12">
          <a
            href="#contact"
            className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            {t('testimonials.joinButton')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
