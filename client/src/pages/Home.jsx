import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { Link } from "react-router-dom"
import Layout from '../components/Layout'

function Home() {
  const { user, logout } = useContext(AuthContext)
  console.log(user)

  const handleLogout = async (e) => {
    e.preventDefault()
    await logout()
    window.alert("Logout successfully")
  }


  return (
    <Layout>
      Home
    </Layout>
  )
}

export default Home
