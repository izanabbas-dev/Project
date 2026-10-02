import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

function Home() {
  const { user, logout } = useContext(AuthContext)
  console.log(user)

  const handleLogout = async (e) => {
    e.preventDefault()
    await logout()
    window.alert("Logout Successfully")
  } 
  return (
    <div>
        Home

        <form onSubmit={handleLogout}>
            <button className='btn bg-red-500 text-white hover:bg-red-600' type='submit'>click to logout</button>
        </form>
    </div>
)
}

export default Home
