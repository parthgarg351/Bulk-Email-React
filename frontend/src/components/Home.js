import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { app } from '../utils/firebase';
import Header from './Header';
import Body from './Body';

const Home = () => {
  
    const navigate = useNavigate();
    const [user, setUser] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(app), (user) => {
            console.log("Auth state changed:", user);
            if (!user) {
                navigate("/");
            }
            
            setUser(!!user);
        });
        return () => {
            unsubscribe();
        };
    }, [user, setUser, navigate]);

    console.log(user);
    
    return (
        <div className='min-h-screen bg-gray-50'>
            
            <Header user={user} />
            <Body/>
    </div>
  )
}

export default Home