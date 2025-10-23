import { Button } from 'flowbite-react';
import { Link } from 'react-router';

export default function CallToAction() {
  return (
    <section className='max-w-4xl mx-auto w-full mt-12 px-4'>
      <div className='bg-blue-50 p-8 rounded-xl text-center border border-blue-200'>
        <h3 className='text-xl font-bold text-gray-800 mb-3'>Master Web Security</h3>
        <p className='text-gray-600 mb-6'>Learn from PortSwigger's Web Security Academy</p>
        <div className='flex flex-wrap gap-3 justify-center'>
          <a href="https://portswigger.net/web-security" target="_blank" rel="noopener noreferrer">
            <Button color='blue'>
              🔒 PortSwigger Academy
            </Button>
          </a>
          <Link to='/search'>
            <Button color='light'>
              More Articles
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}