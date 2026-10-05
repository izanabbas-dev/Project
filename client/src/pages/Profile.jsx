import { useContext } from 'react'
import Layout from '../components/Layout'
import { AuthContext } from '../contexts/AuthContext'

function Profile() {
    const { user } = useContext(AuthContext)
    console.log(user)
    return (
        <Layout>
            <div className="card bg-base-100 w-96 shadow-sm my-20 mx-auto">
                <div className="card-body">
                    <h2 className="card-title">Profile Details</h2>
                      <p>
                        Name: {user?.profile?.name}
                      </p>
                      <p>
                          Email: {user?.profile?.email}
                      </p>
                      <p>
                          Address: {user?.profile?.address}
                      </p>
                      <p>
                          Workphone No: {user?.profile?.workphone_no}
                      </p>
                      <p>
                          Cell No: {user?.profile?.cellphone_no}
                      </p>
                      <p>
                          Dob: {user?.profile?.dob}
                      </p>

                </div>
            </div>
        </Layout>
    )
}

export default Profile
