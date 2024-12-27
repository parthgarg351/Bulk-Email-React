import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { app } from '../utils/firebase';

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

    function handleClick() {
        const auth = getAuth(app);
        auth.signOut();
    }
    console.log(user);
    
    return (
        <div>
            <button onClick={handleClick}>Sign Out</button>
    </div>
  )
}

export default Home