import React, { useEffect } from 'react'
import AdminHeader from '../components/layout/AdminHeader'
import AdminSideBar from '../components/Admin/Layout/AdminSideBar'
import { DataGrid } from '@mui/x-data-grid'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrdersOfAdmin } from '../redux/actions/order'
import { getAllSellers } from '../redux/actions/seller'
const AdminDashboardOrders = () => {
const dispatch = useDispatch();

  const { adminOrders, isLoading } = useSelector((state) => state.order);
 
  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
  }, []);

    const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.value === "Delivered" ? "greenColor" : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "createdAt",
      headerName: "Order Date",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
   
  ];

  const rows = [];
  adminOrders &&
    adminOrders.forEach((item) => {
      rows.push({
        id: item._id,
        itemsQty: item?.cart?.reduce((acc, item) => acc + item.qty, 0),
        total: item?.totalPrice + " $",
        status: item?.status,
        createdAt: item?.createdAt.slice(0,10)
      });
    });
  return (
    <div>
        <AdminHeader />
        <div className="w-full flex">
              <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={2} />
        </div>
                 <div className="w-full rounded min-h-[45vh] flex justify-center pt-5">
                        <div className="w-[97%] ">
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={4}
                  disableRowSelectionOnClick
                  autoHeight
                />
              </div>
             </div>
      </div>
        </div>
    </div>
  )
}

export default AdminDashboardOrders