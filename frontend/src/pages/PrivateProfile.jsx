import { Avatar, Button, Card, Label, TextInput, Textarea, FileInput, Alert } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
} from '../redux/user/userSlice';



export default function PrivateProfile() {

  const { currentUser, loading } = useSelector((state) => state.user);
  const [image, setImage] = useState(undefined);
  const [localProfilePic, setLocalProfilePic] = useState(currentUser.profilePicture);
  const fileRef = useRef(null);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  // Profile picture ကို form data ထဲထည့်ဖို့ function အသစ်ထည့်ပါ
  const updateFormDataWithProfilePic = (profilePic) => {
    if (profilePic) {
      setFormData(prevFormData => ({
        ...prevFormData,
        profilePicture: profilePic
      }));
    }
  };

   useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  // Local storage ကနေ profile picture ကိုဖတ်တဲ့ function
  useEffect(() => {
    const savedProfilePic = localStorage.getItem('profilePicture');
    if (savedProfilePic) {
      setLocalProfilePic(savedProfilePic);

      // Form data ထဲကိုလည်း ထည့်ပါ
    updateFormDataWithProfilePic(savedProfilePic);

    }
  }, []);

   const handleFileUpload = async (image) => {
    try {
      // ၁. File ရှိမရှိစစ်ဆေးခြင်း
      if (!image) {
        throw new Error('No file selected');
      }

      // ၂. File size ကြီးလားစစ်ဆေးခြင်း (2MB ထက်မကြီးရ)
      const maxSize = 2 * 1024 * 1024;
      if (image.size > maxSize) {
        throw new Error('File size must be less than 2MB');
      }

      // ၃. File type မှန်ရဲ့လားစစ်ဆေးခြင်း
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(image.type)) {
        throw new Error('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      }

      // ၄. File ကို Base64 string အဖြစ်ပြောင်းခြင်း
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const base64String = event.target.result;
          
          // ၅. Local Storage မှာသိမ်းခြင်း
          localStorage.setItem('profilePicture', base64String);
          
          // ၆. State update လုပ်ခြင်း (UI မှာပြဖို့)
          setLocalProfilePic(base64String);

          // Form data ကိုလည်း update လုပ်ပါ
          updateFormDataWithProfilePic(base64String);
          
          console.log('Profile picture saved to local storage successfully');
                    
        } catch (error) {
          console.error('Error processing file:', error.message);
          alert('Error saving profile picture: ' + error.message);
        }
      };

      reader.onerror = (error) => {
        console.error('File reading error:', error);
        alert('Error reading file');
      };

      // File ကို read လုပ်ခြင်း
      reader.readAsDataURL(image);

    } catch (error) {
      console.error('Error uploading file:', error.message);
      alert(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`${API_BASE_URL}/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

    // Response headers ကြည့်ကြည့်ပါ
    console.log('Response headers:', res.headers);


      const data = await res.json();
      console.log(data);

      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      
    } catch (error) {
      console.log("error",error);
      dispatch(updateUserFailure(error));
    }
  };

  // Local storage ကိုရှင်းတဲ့ function (လိုအပ်ရင်သုံးမယ်)
  const clearProfilePicture = () => {
    localStorage.removeItem('profilePicture');
    setLocalProfilePic(null);
    console.log('Profile picture cleared from local storage');
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`${API_BASE_URL}/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/signout`);
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Sidebar - Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Profile Picture Card */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Picture</h3>
              <div className="flex flex-col items-center space-y-4">
                <Avatar
                  img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                  alt="Profile picture"
                  size="xl"
                  rounded
                  className="border-4 border-white dark:border-gray-800 shadow-lg"
                />
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    JPG, GIF or PNG. Max size 2MB
                  </p>
                  <FileInput 
                    id="profile-picture"
                    className="w-full"
                    helperText="Upload a new profile picture"
                  />
                </div>
              </div>
            </Card>


          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Personal Information Card */}
            <Card>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Personal Information</h3>
              <div className="space-y-6">
                
                <div>
                  <Label htmlFor="username" value="Username" />
                  <TextInput
                    id="username"
                    placeholder="username"
                    helperText="This will be your public display name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" value="Email Address" />
                  <TextInput
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div>
                  <Label htmlFor="currentPassword" value="Current Password" />
                  <TextInput
                    id="password"
                    type="password"
                    placeholder="password"
                  />
                </div>
                
                <Button color="purple">
                  Save Changes
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}