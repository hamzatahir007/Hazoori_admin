import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { base_url } from "../../utils/baseUrl";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"))
    const [user, setUser] = useState("")

    const storeTokenInLS = (serverToken) => {
        const serializedData = JSON.stringify(serverToken);

        return localStorage.setItem("token", serializedData);
    }


    const isLoggedIn = !!token;

    const LogOutUser = () => {
        setToken("")
        return localStorage.removeItem("token");
    }

    


    // JWT authentication and get current login userdata
    const userAuthentication = async () => {
        let userToken = JSON.parse(token)
        // console.log(userToken?.token, 'ooo');
        // return
        try {
            const response = await axios.get(`${base_url}auth/company`, {
                headers: {
                    Authorization: `Bearer ${userToken?.token}`
                }
            });

            if (response.status === 200) {
                const data = response.data;
                setUser(data.msg);
            }
        } catch (error) {
            console.log("Error fetching user data:", error);
        }
    }

    useEffect(() => {
        userAuthentication()
    }, [])

    return (
        <AuthContext.Provider value={{ isLoggedIn, storeTokenInLS, LogOutUser, user }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const authContextValue = useContext(AuthContext)
    if (!authContextValue) {
        throw new Error("useAuth used outside of the Provider")
    }
    return authContextValue;
}