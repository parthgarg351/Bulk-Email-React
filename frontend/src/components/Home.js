import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { app } from '../utils/firebase';
import Header from './Header';
import Body from './Body';

const Home = () => {
  
    const navigate = useNavigate();
    const [user, setUser] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(app), async (user) => {
            //console.log("Auth state changed:", user);
            setLoading(true);
            if (!user) {
                navigate("/");
                return;
            }
            // Get ID token to check custom claims
            const idTokenResult = await user.getIdTokenResult();
            console.log('User claims:', idTokenResult.claims);
            // if (!idTokenResult.claims.authorized) {
            //     navigate("/unauthorized");
            //     return;
            // }
            setUser(!!user);
            setLoading(false);
        });
        return () => {
            unsubscribe();
        };
    }, [user, setUser, navigate]);

    console.log(user);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>;
    }
    
    return (
        <div className='min-h-screen bg-gray-50'>
            <Header user={user} />
            <Body/>
    </div>
  )
}

export default Home