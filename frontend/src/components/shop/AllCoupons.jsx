import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct} from "../../redux/actions/product";
import { AiOutlineDelete} from "react-icons/ai";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Loader from "../layout/Loader";
import styles from "../../styles/style";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const AllCoupons = () => {
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [value, setValue] = useState(null);
  const [minAmount, setMinAmount] = useState(null);
  const [maxAmount, setMaxAmount] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const { seller } = useSelector((state) => state.seller);
    const { products } = useSelector((state) => state.products);

  const dispatch = useDispatch();
useEffect(() => {
  setIsLoading(true);
  axios
    .get(`${server}/coupon/get-coupon/${seller._id}`, { withCredentials: true })
    .then((res) => {
      setIsLoading(false);
      console.log("Coupons API Response:", res.data);
      // Use the correct key from API response
      setCoupons(Array.isArray(res.data.couponCodes) ? res.data.couponCodes : []);
    })
    .catch((error) => {
      setIsLoading(false);
      console.error("Error loading coupons:", error);
      setCoupons([]);
    });
}, [seller._id]);

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
    window.location.reload();
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
await axios.post(
  `${server}/coupon/create-coupon-code`,
  {
    name,
    minAmount,
    maxAmount,
    selectedProducts, // should be product _id(s)
    value,
    shop: seller._id, // ✅ matches schema
  },
  { withCredentials: true }
);



    toast.success("Coupon code created successfully!");
    setOpen(false);

    // re-fetch coupons instead of full reload
    const res = await axios.get(
      `${server}/coupon/get-coupon/${seller._id}`,
      { withCredentials: true }
    );
    setCoupons(res.data.couponCodes);
  } catch (err) {
    toast.error(err.response?.data?.message || "Something went wrong");
  }
};


  const columns = [
    {
      field: "id",
      headerName: "Product Id",
      minWidth: 150,
      flex: 0.7,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.6,
    },

   
  
    {
      field: "Delete",
      headerName: "",
      type: "number",
      minWidth: 120,
      flex: 0.8,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];
  coupons &&
    coupons.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: item.value + " %",
      });
    });
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <div className="w-full flex justify-end">
            <div
              className={`${styles.button} !w-max !h-[45px] !px-3 !rounded-[5px] mr-3 mb-3`}
              onClick={() => setOpen(true)}
            >
              <span className="text-white">Create Coupone Code</span>
            </div>
          </div>
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        {open && (
  <div className="fixed top-0 left-0 w-full h-screen z-[20000] bg-black bg-opacity-60 flex items-center justify-center px-4">
    <div className="w-full max-w-lg bg-white rounded-xl shadow-lg relative p-6">
      {/* Close Button */}
      <button
        onClick={() => setOpen(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
      >
        <RxCross1 size={25} />
      </button>

      <h5 className="text-2xl font-semibold text-center mb-6">
        Create Coupon Code
      </h5>

      {/* create coupon code */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 focus:border-blue-500"
            placeholder="Enter your coupon code..."
          />
        </div>

        {/* Discount Percentage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Discount Percentage <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            required
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 focus:border-blue-500"
            placeholder="Enter discount value (%)"
          />
        </div>

        {/* Min Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Amount
          </label>
          <input
            type="number"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 focus:border-blue-500"
            placeholder="Enter minimum amount"
          />
        </div>

        {/* Max Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Amount
          </label>
          <input
            type="number"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 focus:border-blue-500"
            placeholder="Enter maximum amount"
          />
        </div>

        {/* Select Product */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Selected Product
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 focus:border-blue-500"
            value={selectedProducts}
            onChange={(e) => setSelectedProducts(e.target.value)}
          >
            <option value="">Choose a product</option>
            {products &&
              products.map((i) => (
                <option value={i.name} key={i._id}>
                  {i.name}
                </option>
              ))}
          </select>
        </div>

        {/* Submit */}
        <div>
          <input
            type="submit"
            value="Create"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer transition"
          />
        </div>
      </form>
    </div>
  </div>
)}

        </div>
      )}
    </>
  );
};

export default AllCoupons;
