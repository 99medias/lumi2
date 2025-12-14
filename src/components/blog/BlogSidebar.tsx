import { useLanguage } from '../../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { AlertTriangle, TrendingUp, ExternalLink, Mail } from 'lucide-react';

interface PopularArticle {
  slug: string;
  title: string;
  viewCount: number;
}

interface BlogSidebarProps {
  popularArticles?: PopularArticle[];
}

export default function BlogSidebar({ popularArticles = [] }: BlogSidebarProps) {
  const { t } = useLanguage();

  const formatViews = (views: number = 0) => {
    return views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const officialResources = [
    { name: 'Safeonweb.be', url: 'https://safeonweb.be', description: 'Signaler une menace' },
    { name: 'CERT.be', url: 'https://cert.be', description: 'Alertes de sécurité' },
    { name: 'CCB', url: 'https://ccb.belgium.be', description: 'Centre Cybersécurité' },
    { name: 'Police Fédérale', url: 'https://www.police.be', description: 'Cybercriminalité' },
  ];

  return (
    <aside className="space-y-6">
      {popularArticles.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-lg">Articles Populaires</h3>
          </div>
          <div className="space-y-4">
            {popularArticles.map((article, index) => (
              <Link
                key={article.slug}
                to={`/blog/${article.slug}`}
                className="block group"
              >
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="font-semibold text-sm group-hover:text-green-600 transition-colors line-clamp-2">
                      {article.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">{formatViews(article.viewCount)} lectures</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="font-bold text-lg">Besoin d'aide ?</h3>
        </div>
        <p className="text-sm text-green-50 mb-4">
          Nos experts en cybersécurité sont là pour vous protéger
        </p>
        <Link
          to="/contact"
          className="block w-full bg-white text-green-600 text-center py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors"
        >
          Contactez-nous
        </Link>
      </div>

      <div className="bg-gray-900 rounded-xl shadow-sm p-6 text-white">
        <div className="flex items-center gap-2 mb-3">
          <Mail className="w-5 h-5 text-green-400" />
          <h3 className="font-bold text-lg">Newsletter</h3>
        </div>
        <p className="text-sm text-gray-300 mb-4">
          Recevez les dernières alertes de sécurité directement dans votre boîte mail
        </p>
        <input
          type="email"
          placeholder="Votre e-mail"
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-green-500 focus:outline-none text-white mb-3"
        />
        <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition-colors">
          S'abonner
        </button>
        <p className="text-xs text-gray-400 mt-2">
          Pas de spam. Désinscription facile.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🇧🇪</span>
          <h3 className="font-bold text-lg">Ressources Officielles</h3>
        </div>
        <div className="space-y-3">
          {officialResources.map((resource) => (
            <a
              key={resource.name}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-sm group-hover:text-green-600 transition-colors">
                    {resource.name}
                  </h4>
                  <p className="text-xs text-gray-500">{resource.description}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-green-600 flex-shrink-0" />
              </div>
            </a>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-600">
            MaSécurité.be collabore avec les autorités belges pour votre protection.
          </p>
        </div>
      </div>
    </aside>
  );
}
