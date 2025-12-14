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
  authorName,
  isFeatured = false,
}: ArticleCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-BE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatViews = (views: number) => {
    const viewsNum = views || 0;
    if (viewsNum >= 1000) {
      return `${(viewsNum / 1000).toFixed(1)}k`;
    }
    return viewsNum.toString();
  };

  return (
    <Link
      to={`/blog/${slug}`}
      className={`group block bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden ${
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

          <p className={`text-gray-600 line-clamp-3 mb-4 ${isFeatured ? 'text-lg' : ''}`}>
            {excerpt}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                👤 {authorName}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(publishedAt)}
              </span>
            </div>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {formatViews(viewCount)} lectures
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
