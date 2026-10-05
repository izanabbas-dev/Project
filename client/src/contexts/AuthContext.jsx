import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

export const AuthContext = createContext(null)

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    useEffect( () => {
        profile()
    }, [])

    const register = async(body) => {
        try {
            let data = await authService.register(body)            
        } catch (error) {
            console.log({ error: error })
        }

    }
    
    const login = async(credentials) => {
        try {
            const data = await authService.login(credentials)
            setUser(data)
            return data

        } catch (error) {
            console.log({ error: error })
        }
    }

    const logout = async() => {
        try {
            await authService.logout()
        } catch (error) {
            console.log({ error })
        }
    }

    const profile = async() => {
        try {
            const data = await authService.profile()
            setUser(data)
        } catch (error) {
            console.log({ error: error })
        }
    }

    return (
        <AuthContext.Provider value={{user, setUser, register, login, logout, profile}}>
            { children }
        </AuthContext.Provider>
    )
}