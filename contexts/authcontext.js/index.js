// create a context for authentication
// create a userAuth hook to use in different components 
// to get the different state parametrs
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../../utils/Firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [userLoggedIn, setUserLoggedIn] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUserLoggedIn(user ? true : false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ userLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}