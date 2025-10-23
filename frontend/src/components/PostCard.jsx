import { Link } from 'react-router';
import { useState } from 'react';

export default function PostCard({ post, loading = false }) {
  const [imageError, setImageError] = useState(false);

  // Loading skeleton
  if (loading) {
    return (
      <div className="group relative w-full border border-gray-200 h-[400px] overflow-hidden rounded-lg sm:w-[430px] bg-white shadow-sm hover:shadow-md transition-all duration-300 mx-auto animate-pulse">
        <div className="h-[260px] w-full bg-gray-300"></div>
        <div className="p-4 flex flex-col gap-3">
          <div className="h-5 bg-gray-300 rounded w-4/5"></div>
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-300 rounded w-20"></div>
            <div className="h-3 bg-gray-300 rounded w-16"></div>
          </div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate reading time
  const calculateReadingTime = (content) => {
    if (!content) return '1 min';
    const textContent = content.replace(/<[^>]*>/g, '');
    const wordCount = textContent.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    return `${readingTime} min read`;
  };

  // Get excerpt from content
  const getExcerpt = (content, length = 100) => {
    if (!content) return '';
    const textContent = content.replace(/<[^>]*>/g, '');
    return textContent.length > length 
      ? `${textContent.substring(0, length)}...` 
      : textContent;
  };

  return (
    <article className="group relative w-full border border-gray-200 h-[400px] overflow-hidden rounded-xl sm:w-[430px] bg-white shadow-sm hover:shadow-xl transition-all duration-300 mx-auto hover:border-teal-500 hover:scale-[1.02]">
      {/* Image Container */}
      <Link 
        to={`/post/${post.slug}`} 
        className="block relative overflow-hidden"
        aria-label={`Read ${post.title}`}
      >
        <div className="h-[260px] w-full overflow-hidden">
          {!imageError ? (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center">
              <div className="text-center text-teal-600">
                <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">No Image</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-teal-500 text-white rounded-full shadow-md">
            {post.category}
          </span>
        </div>
      </Link>

      {/* Content Container */}
      <div className="p-4 flex flex-col gap-3 h-[140px]">
        {/* Title */}
        <Link to={`/post/${post.slug}`}>
          <h3 className="text-lg font-bold text-gray-800 line-clamp-2 group-hover:text-teal-600 transition-colors duration-200 leading-tight">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed flex-grow">
          {getExcerpt(post.content)}
        </p>

        {/* Meta Information */}
        <div className="flex justify-between items-center text-xs text-gray-500 mt-auto">
          <span>{formatDate(post.createdAt)}</span>
          <span>{calculateReadingTime(post.content)}</span>
        </div>
      </div>

      {/* Read Article Button - Slides up on hover */}
      <Link
        to={`/post/${post.slug}`}
        className="absolute z-10 left-3 right-3 bg-teal-500 text-white text-center py-3 rounded-lg font-semibold shadow-lg transform transition-all duration-300 hover:bg-teal-600 hover:shadow-xl hover:scale-105 border-2 border-teal-500 group-hover:bottom-3 bottom-[-80px]"
        aria-label={`Read article: ${post.title}`}
      >
        Read Article
        <svg 
          className="w-4 h-4 inline-block ml-2 transition-transform group-hover:translate-x-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </Link>

      {/* Hover Overlay Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
    </article>
  );
}