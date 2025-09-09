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
    await axios
      .post(
        `${server}/coupon/create-coupon-code`,
        {
          name,
          minAmount,
          maxAmount,
          selectedProducts,
          value,
          shop: seller,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("coupon code created successfully!");
        setOpen(false);
        window.location.reload();
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
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
            <div className="fixed top-0 left-0 w-full h-screen z-[20000] bg-[#00000062]  flex items-center justify-center">
              <div className="800px:w-[40%] w-[80%] h-[90vh] rounded-md bg-white shadow relative p-4">
                <div className="w-full justify-end flex">
                  <RxCross1
                    size={30}
                    className="cursor-pointer"
                    onClick={() => setOpen(false)}
                  />
                </div>
                <h5 className="text-[30px] font-Poppins text-center">
                  Create Coupon code
                </h5>
                {/* create coupon code */}
                <form onSubmit={handleSubmit} aria-required={true}>
                  <br />
                  <div>
                    <label htmlFor="" className="pb-2 ">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-2 block w-full appearance-none px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter Your coupon code ..."
                    />
                  </div>
                  <br />
                  <div>
                    <label htmlFor="" className="pb-2 ">
                      Discount Persentenge{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="value"
                      value={value}
                      required
                      onChange={(e) => setValue(e.target.value)}
                      className="mt-2 block w-full appearance-none px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter Your coupon value ..."
                    />
                  </div>
                  <br />
                  <div>
                    <label htmlFor="" className="pb-2 ">
                      Min Amount
                    </label>
                    <input
                      type="number"
                      name="value"
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value)}
                      className="mt-2 block w-full appearance-none px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter Your coupon code min amount ..."
                    />
                  </div>
                  <br />
                  <div>
                    <label htmlFor="" className="pb-2 ">
                      Max Amount
                    </label>
                    <input
                      type="number"
                      name="value"
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value)}
                      className="mt-2 block w-full appearance-none px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter Your coupon code max amount ..."
                    />
                  </div>
                  <br />
                  <div className="">
                    <label htmlFor="" className="pb-2 ">
                      Selected Product
                    </label>
                    <select
                      className="w-full mt-2 border h-[35px] rounded-[5px]"
                      id=""
                      value={selectedProducts}
                      onChange={(e) => setSelectedProducts(e.target.value)}
                    >
                      <option value="Choose your selected products">
                        {" "}
                        Choose a selected product
                      </option>
                      {products &&
                        products.map((i) => (
                          <option value={i.name} key={i.name}>
                            {i.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <br />
                  <div>
                    <input
                      type="submit"
                      value="Create"
                      className="mt-2 block w-full appearance-none px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
