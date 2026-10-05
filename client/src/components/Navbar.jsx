import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

function Navbar() {
  const { user, logout, profile } = useContext(AuthContext)
  console.log(user)

  const handleLogout = async (e) => {
    e.preventDefault()
    await logout()
    window.alert("Logout successfully")
    await profile()
  }

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Ecommerce Website</a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to={`/`}>Home</Link>
            </li>

            <li>
              <Link to={`/products`}>Products</Link>
            </li>

            <li>
              <Link to={`/orders`}>Orders</Link>
            </li>

            <li>
              <Link to={`/profile`}>Profile</Link>
            </li>

            <li>
              {user !== null ?
                <>
                  <Link to={`/login`}>{user?.name}</Link>
                  <li>
                    <form onSubmit={handleLogout}>
                      <button className='btn bg-red-500 text-white hover:bg-red-600' type='submit'>click to logout</button>
                    </form>
                  </li>
                </>
                :
                <Link to={`/login`}>login</Link>
              }

            </li>


          </ul>
        </div>
      </div>
    </>
  )
}

export default Navbar