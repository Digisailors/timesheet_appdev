import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getSession } from '@/lib/api';

interface ProfileModalProps {
  onClose: () => void;
}

interface UserData {
  name: string;
  role: string;
  email: string;
  phone: string;
  department: string;
  joinDate: string;
  lastLogin: string;
  permissions: string[];
  location: string;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getSession();
        
        if (data.user) {
          // Map API response to your UserData format
          const mappedUserData: UserData = {
            name: data.user.name,
            role: '', // You can modify this based on your needs
            email: data.user.email,
            phone: data.user.phoneNumber || 'Not provided',
            department: '', // You can modify this based on your needs
            joinDate: new Date(data.user.createdAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            }),
            lastLogin: new Date(data.user.updatedAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }),
            permissions: ['Full Access', 'User Management', 'System Settings', 'Reports'], // You can modify this based on your needs
            location: 'Chennai, Tamil Nadu' // You can modify this based on your needs
          };
          
          setUserData(mappedUserData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback to default data if API fails
        setUserData({
          name: 'User',
          role: '',
          email: 'user@company.com',
          phone: 'Not provided',
          department: '',
          joinDate: 'N/A',
          lastLogin: 'N/A',
          permissions: ['Limited Access'],
          location: 'Not specified'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="absolute top-12 right-0 z-50 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 w-96 p-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500 dark:text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="absolute top-12 right-0 z-50 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 w-96 p-6">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-center mb-4 space-x-4">
        <div className="w-16 h-16 bg-blue-600 text-white flex items-center justify-center rounded-full text-xl font-bold">
          {userData.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{userData.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{userData.role}  {userData.department}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
        <div className="font-medium text-gray-700 dark:text-gray-300">Email:</div>
        <div className="text-gray-600 dark:text-gray-400">{userData.email}</div>

        <div className="font-medium text-gray-700 dark:text-gray-300">Phone:</div>
        <div className="text-gray-600 dark:text-gray-400">{userData.phone}</div>

        {/* <div className="font-medium text-gray-700 dark:text-gray-300">Location:</div>
        <div className="text-gray-600 dark:text-gray-400">{userData.location}</div> */}

        {/* <div className="font-medium text-gray-700 dark:text-gray-300">Join Date:</div>
        <div className="text-gray-600 dark:text-gray-400">{userData.joinDate}</div> */}

        {/* <div className="font-medium text-gray-700 dark:text-gray-300">Last Login:</div>
        <div className="text-gray-600 dark:text-gray-400">{userData.lastLogin}</div> */}
      </div>

      {/* <div className="border-t border-gray-200 dark:border-slate-600 pt-4">
        <div className="flex items-center mb-2">
          <Shield className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
          <span className="font-medium text-gray-700 dark:text-gray-300">Permissions</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {userData.permissions.map((permission, index) => (
            <span 
              key={index} 
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full"
            >
              {permission}
            </span>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default ProfileModal;