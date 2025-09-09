import React from 'react'
import AdminSideBar from '../components/Admin/Layout/AdminSideBar'
import AdminHeader from '../components/layout/AdminHeader'
import AllUsers from "../components/Admin/AllUsers"

const AdminDashboardUsers = () => {
  return (
     <div>
        <AdminHeader />
        <div className="w-full flex">
              <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={4} />
        </div>
        <AllUsers />
      </div>
        </div>
    </div>
  )
}

export default AdminDashboardUsers