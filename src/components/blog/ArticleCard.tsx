import { Link } from 'react-router-dom';
import { Clock, Eye, Calendar } from 'lucide-react';

interface ArticleCardProps {
  slug: string;
  title: string;
  excerpt: string;
  featuredImage?: string;
  category: 'alerte' | 'guide' | 'actualite' | 'arnaque';
  readingTime: number;
  viewCount: number;
  publishedAt: string;
  updatedAt?: string;
  authorName: string;
  isFeatured?: boolean;
}

const categoryColors = {
  alerte: 'bg-red-500',
  guide: 'bg-blue-500',
  actualite: 'bg-green-500',
  arnaque: 'bg-orange-500',
};

const categoryLabels = {
  alerte: 'Alerte',
  guide: 'Guide',
  actualite: 'Actualité',
  arnaque: 'Arnaque Signalée',
};

export default function ArticleCard({
  slug,
  title,
  excerpt,
  featuredImage,
  category,
  readingTime,
  viewCount,
  publishedAt,
  updatedAt,
  authorName,
  isFeatured = false,
}: ArticleCardProps) {
  const formatDate = (date: string) => {
    const now = new Date();
    const published = new Date(date);
    const diffTime = Math.abs(now.getTime() - published.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Aujourd'hui";
    } else if (diffDays === 1) {
      return 'Hier';
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else {
      return published.toLocaleDateString('fr-BE', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).replace('.', '');
    }
  };

  const formatViews = (views: number) => {
    const viewsNum = views || 0;
    return viewsNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const isUpdated = updatedAt && updatedAt !== publishedAt;
  const displayDate = isUpdated ? updatedAt : publishedAt;

  return (
    <Link
      to={`/blog/${slug}`}
      className={`group block bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden ${
        isFeatured ? 'md:col-span-2 lg:col-span-3' : ''
      }`}
    >
      <div className={`${isFeatured ? 'md:flex' : ''}`}>
        {featuredImage && (
          <div className={`relative overflow-hidden ${isFeatured ? 'md:w-1/2' : 'h-48'}`}>
            <img
              src={featuredImage}
              alt={title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className={`${categoryColors[category]} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                {categoryLabels[category]}
              </span>
              <span className="bg-gray-900/80 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {readingTime} min
              </span>
            </div>
          </div>
        )}

        <div className={`p-6 ${isFeatured ? 'md:w-1/2 flex flex-col justify-center' : ''}`}>
          <h3 className={`font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 mb-3 ${
            isFeatured ? 'text-2xl lg:text-3xl' : 'text-xl'
          }`}>
            {title}
          </h3>

          <p className={`text-gray-600 line-clamp-2 mb-4 ${isFeatured ? 'text-lg' : ''}`}>
            {excerpt}
          </p>

          <div className="space-y-2 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  👤 {authorName}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {formatViews(viewCount)} lectures
                </span>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              {isUpdated ? (
                <span>
                  Publié le {formatDate(publishedAt)} • <span className="text-green-600 font-medium">Mis à jour le {formatDate(displayDate)}</span>
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(publishedAt)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
