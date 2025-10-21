import { Avatar, Button, Card, Label, TextInput, Textarea } from 'flowbite-react';

export default function PublicProfile() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Profile Header Card */}
        <Card className="mb-6 relative">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-lg -mx-6 -mt-6 mb-6"></div>
          
          {/* Profile Info */}
          <div className="flex flex-col md:flex-row items-center md:items-start -mt-24 md:-mt-32">
            {/* Avatar */}
            <div className="relative mb-4 md:mb-0 md:mr-6">
              <Avatar
                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                alt="Profile picture"
                size="xl"
                rounded
                className="border-4 border-white dark:border-gray-800 shadow-lg"
              />
              <Button
                size="xs"
                className="absolute bottom-2 right-2 bg-purple-600 hover:bg-purple-700"
              >
                ✏️
              </Button>
            </div>
            
            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">John Doe</h1>
                  <p className="text-gray-600 dark:text-gray-400">@johndoe</p>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-2">
                  <Button color="gray" outline>
                    Message
                  </Button>
                  <Button color="purple">
                    Follow
                  </Button>
                </div>
              </div>
              
              {/* Bio */}
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Full-stack developer passionate about creating amazing user experiences. 
                Love working with React, Node.js, and modern web technologies.
              </p>
              
              {/* Stats */}
              <div className="flex justify-center md:justify-start space-x-6 text-sm">
                <div className="text-center">
                  <div className="font-bold text-gray-900 dark:text-white">124</div>
                  <div className="text-gray-600 dark:text-gray-400">Posts</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900 dark:text-white">1.2K</div>
                  <div className="text-gray-600 dark:text-gray-400">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900 dark:text-white">356</div>
                  <div className="text-gray-600 dark:text-gray-400">Following</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* About Card */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <span className="w-5 h-5 mr-3">📧</span>
                  <span>john.doe@example.com</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <span className="w-5 h-5 mr-3">📅</span>
                  <span>Joined January 2024</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <span className="w-5 h-5 mr-3">📍</span>
                  <span>Yangon, Myanmar</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <span className="w-5 h-5 mr-3">🔗</span>
                  <span>johndoe.dev</span>
                </div>
              </div>
            </Card>

            {/* Skills Card */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded-full text-sm">
                  React
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded-full text-sm">
                  JavaScript
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded-full text-sm">
                  TypeScript
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded-full text-sm">
                  Node.js
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded-full text-sm">
                  Tailwind CSS
                </span>
              </div>
            </Card>

            {/* Social Links Card */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Connect</h3>
              <div className="space-y-3">
                <Button color="light" className="w-full justify-start">
                  <span className="mr-3">🐙</span>
                  GitHub
                </Button>
                <Button color="light" className="w-full justify-start">
                  <span className="mr-3 text-blue-400">🐦</span>
                  Twitter
                </Button>
                <Button color="light" className="w-full justify-start">
                  <span className="mr-3 text-blue-600">💼</span>
                  LinkedIn
                </Button>
              </div>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Card>
              {/* Simple Tabs without Flowbite Tabs component */}
              <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <div className="flex space-x-8">
                  <button className="pb-4 px-1 border-b-2 border-purple-600 text-purple-600 font-medium">
                    Posts
                  </button>
                  <button className="pb-4 px-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                    About
                  </button>
                  <button className="pb-4 px-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                    Projects
                  </button>
                </div>
              </div>
              
              {/* Posts Content */}
              <div className="space-y-4">
                {[1, 2, 3].map((post) => (
                  <div key={post} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center mb-3">
                      <Avatar
                        img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                        alt="Profile picture"
                        size="sm"
                        rounded
                      />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">John Doe</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                      </div>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Amazing React Tips and Tricks
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      Discover some incredible React patterns that will level up your development skills...
                    </p>
                    <div className="flex space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>👍 24</span>
                      <span>💬 8</span>
                      <span>🔄 3</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}