import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
// Uncomment these when you create these components
// import CallToAction from '../components/CallToAction';
// import CommentSection from '../components/CommentSection';
// import PostCard from '../components/PostCard';

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        
        if (data.posts && data.posts.length > 0) {
          setPost(data.posts[0]);
          setError(false);
          
          // Fetch recent posts
          const recentRes = await fetch('/api/post/getposts?limit=3&order=desc');
          const recentData = await recentRes.json();
          if (recentRes.ok) {
            // Filter out the current post from recent posts
            const filteredRecentPosts = recentData.posts.filter(
              (recentPost) => recentPost._id !== data.posts[0]._id
            );
            setRecentPosts(filteredRecentPosts.slice(0, 3)); // Get max 3 recent posts
          }
        } else {
          setError(true);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  // Handle error state
  if (error) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-800 mb-4'>Post Not Found</h1>
          <p className='text-gray-600 mb-4'>The post you're looking for doesn't exist.</p>
          <Link to='/'>
            <Button color='blue'>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );
  }

  // Calculate reading time more accurately
  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    const wordCount = textContent.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      {/* Post Header */}
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
        {post.title}
      </h1>
      
      {/* Category */}
      <Link
        to={`/search?category=${post.category}`}
        className='self-center mt-5'
      >
        <Button color='gray' pill size='xs'>
          {post.category}
        </Button>
      </Link>
      
      {/* Featured Image */}
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className='mt-10 p-3 max-h-[600px] w-full object-cover rounded-lg'
        />
      )}
      
      {/* Post Meta Information */}
      <div className='flex justify-between p-3 border-b border-slate-300 mx-auto w-full max-w-2xl text-xs text-gray-500'>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        <span className='italic'>
          {calculateReadingTime(post.content)} min read
        </span>
      </div>
      
      {/* Post Content */}
      <div
        className='p-3 max-w-2xl mx-auto w-full post-content prose prose-lg'
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>
      
      {/* Call to Action Section */}
      <div className='max-w-4xl mx-auto w-full mt-8'>
        {/* <CallToAction /> */}
        <div className='bg-blue-50 p-6 rounded-lg text-center'>
          <h3 className='text-xl font-bold mb-2'>Enjoyed this article?</h3>
          <p className='text-gray-600 mb-4'>Share it with your friends or leave a comment below!</p>
          <div className='flex gap-2 justify-center'>
            <Button color='light'>Share</Button>
            <Link to='/search'>
              <Button color='blue'>Read More Articles</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Comment Section */}
      {/* <CommentSection postId={post._id} /> */}
      <div className='max-w-2xl mx-auto w-full mt-8 p-3'>
        <h3 className='text-2xl font-bold mb-4'>Comments</h3>
        <div className='bg-gray-50 p-4 rounded-lg text-center'>
          <p className='text-gray-500'>Comment section coming soon...</p>
          <Button color='gray' className='mt-2' disabled>
            Add Comment
          </Button>
        </div>
      </div>

      {/* Recent Posts Section */}
      <div className='flex flex-col justify-center items-center mb-5 mt-8'>
        <h1 className='text-2xl font-bold mt-5'>Recent Articles</h1>
        <div className='flex flex-wrap gap-5 mt-5 justify-center'>
          {recentPosts && recentPosts.length > 0 ? (
            /*
            {recentPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
            */
            recentPosts.map((post) => (
              <div key={post._id} className='bg-white border border-gray-200 rounded-lg shadow-md max-w-xs'>
                {post.image && (
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className='w-full h-48 object-cover rounded-t-lg'
                  />
                )}
                <div className='p-4'>
                  <Link to={`/post/${post.slug}`}>
                    <h3 className='text-lg font-semibold hover:text-blue-600 transition-colors'>
                      {post.title}
                    </h3>
                  </Link>
                  <Link to={`/search?category=${post.category}`}>
                    <Button color='gray' pill size='xs' className='mt-2'>
                      {post.category}
                    </Button>
                  </Link>
                  <p className='text-gray-500 text-sm mt-2'>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className='text-gray-500'>No recent articles found.</p>
          )}
        </div>
      </div>
    </main>
  );
}