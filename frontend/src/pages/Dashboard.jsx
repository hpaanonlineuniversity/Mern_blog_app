import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';


export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');

    console.log(tabFromUrl);

    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* Sidebar */}
        <DashSidebar />
      </div>

      {/* Main Content - Takes remaining space */}
      <div className='flex-1'>
        {tab === 'profile' && <DashProfile />}
      </div>

    </div>
  );
}