import React from 'react'
import AdminHeader from '../components/layout/AdminHeader'
import AdminSideBar from '../components/Admin/Layout/AdminSideBar'
import AdminEvents from "../components/Admin/AdminEvents"
const AdminDashboardEvents = () => {
  return (
 <div>
        <AdminHeader />
        <div className="w-full flex">
              <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={6} />
        </div>
        <AdminEvents />
      </div>
        </div>
    </div>   ) 
}

export default AdminDashboardEvents