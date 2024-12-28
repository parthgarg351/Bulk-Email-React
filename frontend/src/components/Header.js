import React, { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../utils/firebase';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [userData, setUserData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserData(user);
        // Check for admin claims
        const idTokenResult = await user.getIdTokenResult();
        setIsAdmin(!!idTokenResult.claims.admin);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <span className="text-white text-2xl font-bold">Bulk Email Sender</span>
          </div>

          {userData && (
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <Link 
                  to={isAdminPage ? "/home" : "/admin"}
                  className="text-white hover:text-blue-200 transition-colors font-medium"
                >
                  {isAdminPage ? "Home" : "Admin Panel"}
                </Link>
              )}
              <div className="flex items-center">
                <div className="text-right mr-4">
                  <div className="text-white font-medium">{userData.displayName}</div>
                  <div className="text-blue-100 text-sm">{userData.email}</div>
                </div>
                <img
                  src={userData.photoURL}
                  alt="Profile"
                  className="h-12 w-12 rounded-full border-2 border-white shadow-md hover:border-blue-200 transition-all"
                />
              </div>
              <button
                onClick={() => getAuth(app).signOut()}
                className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors duration-200"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Header