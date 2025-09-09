import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../redux/actions/user";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import styles from "../../styles/style";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { getAllSellers } from "../../redux/actions/seller";
import { Link } from "react-router-dom";

const AllSellers = () => {
  const dispatch = useDispatch();
  const { sellers } = useSelector((state) => state.seller);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    dispatch(getAllSellers());
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        `${server}/shop/delete-seller/${id}`,
        { withCredentials: true } 
      );
      toast.success(data.message);
      setOpen(false);
      dispatch(getAllUsers()); // refresh users after delete
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

    dispatch(getAllUsers())

  const columns = [
    { field: "id", headerName: "Seller ID", minWidth: 150, flex: 0.7 },
    { field: "name", headerName: "Name", minWidth: 130, flex: 0.7 },
    {
      field: "email",
      headerName: "Email",
      type: "text",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "role",
      headerName: "User Role",
      type: "text",
      minWidth: 130, 
      flex: 0.7,
    },
    {
      field: "joinedAt",
      headerName: "Joined At",
      type: "text",
      minWidth: 130,
      flex: 0.8,
    },
     {
      field: "actions ",
      headerName: "Preview Shop",
      type: "text",
      minWidth: 150,
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
        <Link to={`/shop/preview/${params.id}`}>
  <Button>
    <AiOutlineEye size={20} />
  </Button>
</Link>

        );
      },
    },
    {
      field: "actions",
      headerName: "Delete Seller",
      type: "number",
      minWidth: 150,
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <Button
            onClick={() => {
              setUserId(params.id); // save user id
              setOpen(true);
            }}
          >
            <AiOutlineDelete size={20} />
          </Button>
        );
      },
    },
       
  ];

  const rows = [];
  sellers &&
    sellers.forEach((item) => {
      rows.push({
        id: item._id,
        name: item?.name,
        email: item?.email,
        role: item?.role,
        joinedAt: item?.createdAt.slice(0, 10),
        address: item.address   
      });
    });

  return (
    <div className="w-full flex justify-center pt-5">
      <div className="w-[97%]">
        <h3 className="text-[22px] font-Poppins pb-2">All Sellers</h3>
        <div className="w-full bg-white rounded min-h-[45vh]">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableRowSelectionOnClick
            autoHeight
          />
        </div>

        {open && (
          <div className="w-full fixed top-0 left-0 z-[999] bg-[#0000005d] flex items-center justify-center h-screen">
            <div className="w-[95%] 800px:w-[40%] min-h-[20vh] bg-white rounded shadow p-5">
              <div className="w-full flex justify-end cursor-pointer">
                <RxCross1 size={25} onClick={() => setOpen(false)} />
              </div>
              <h3 className="text-[25px] text-center py-5 font-Poppins text-[#000000c0]">
                Are you sure you want to delete this user?
              </h3>
              <div className="w-full flex items-center justify-center">
                <div
                  className={`${styles.button} text-white text-[18px] !h-[42px] mr-4`}
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </div>
                <div
                  className={`${styles.button} text-white text-[18px] !h-[42px] ml-4`}
                  onClick={() => setOpen(false) || handleDelete(userId) }
                >
                  Confirm
                </div>
              </div> 
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSellers;
