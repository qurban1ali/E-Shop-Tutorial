import React, { useEffect, useState } from "react";
import styles from "../styles/style";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfUser } from "../redux/actions/order";
import { server } from "../server";
import { RxCross1 } from "react-icons/rx";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";

const UserOrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);

  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(1);

  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllOrdersOfUser(user._id));
    }
  }, [dispatch, user]);

  const data = orders && orders.find((item) => item._id === id);

  const reviewHandler = async () => {
    try {
      const res = await axios.put(
        `${server}/product/create-new-review`,
        {
          user,
          rating,
          comment,
          productId: selectedItem?._id,
          orderId: id,
        },
        { withCredentials: true }
      );

      toast.success(res.data.message);
      dispatch(getAllOrdersOfUser(user._id));
      setComment("");
      setRating(1);
      setOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const refundHandler = async () => {
    try {
      const res = await axios.put(`${server}/order/order-refund/${id}`, {
        status: "Processing refund",
      });
      toast.success(res.data.message);
      dispatch(getAllOrdersOfUser(user._id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Refund failed");
    }
  };

  return (
    <div className={`py-4 min-h-screen ${styles.section}`}>
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="pl-2 text-[25px]">Order Details</h1>
        </div>

        <Link to="/dashboard-orders">
          <div
            className={`${styles.button} !bg-[#daced0] !rounded-[4px] text-[#e94560] font-[600] !h-[45px] text-[18px]`}
          >
            Order List
          </div>
        </Link>
      </div>

      {/* Order meta */}
      <div className="w-full flex items-center justify-between pt-6">
        <h5 className="text-[#00000057]">
          Order ID: <span>#{data?._id?.slice(0, 8)}</span>
        </h5>
        <h5 className="text-[#00000057]">
          Placed on: <span>{data?.createdAt?.slice(0, 10)}</span>
        </h5>
      </div>

      {/* Order items */}
      <div className="mt-6">
        {data &&
          data?.cart.map((item, index) => (
            <div
              className="w-full flex items-start mb-5 border-b pb-4"
              key={item._id || index}
            >
              <img
                src={item.images[0] || item.images[0]}
                alt={item.name}
                className="w-[80px] h-[80px] object-cover rounded"
              />
              <div className="w-full pl-3">
                <h5 className="text-[20px] font-[500]">{item.name}</h5>
                <h5 className="text-[18px] text-[#000000aa]">
                  US${item.discountPrice} × {item.qty}
                </h5>
              </div>

              {!item.isReviewed &&
              data?.status?.toLowerCase() === "delivered" ? (
                <div
                  className={`${styles.button} text-white`}
                  onClick={() => {
                    setOpen(true);
                    setSelectedItem(item);
                  }}
                >
                  Write a review
                </div>
              ) : null}
            </div>
          ))}
      </div>

      {/* Review popup */}
      {open && (
        <div className="w-full fixed top-0 left-0 h-screen bg-[#0000007d] z-50 flex items-center justify-center">
          <div className="w-[90%] md:w-[50%] bg-white shadow rounded-md p-4">
            <div className="w-full flex justify-end">
              <RxCross1
                size={30}
                onClick={() => setOpen(false)}
                className="cursor-pointer"
              />
            </div>
            <h2 className="pt-3 text-[20px] font-[600]">Give a Review</h2>

            <div className="flex items-center mt-4">
              <img
                src={selectedItem?.images[0] || selectedItem?.images[0]}
                alt={selectedItem?.name}
                className="w-[80px] h-[80px] object-cover rounded"
              />
              <div className="pl-3">
                <div className="text-[18px] font-[500]">
                  {selectedItem?.name}
                </div>
                <h4 className="text-[16px] text-gray-600">
                  US${selectedItem?.discountPrice} × {selectedItem?.qty}
                </h4>
              </div>
            </div>

            {/* Ratings */}
            <h5 className="mt-5 text-[18px] font-[500]">
              Give a Rating <span className="text-red-500">*</span>
            </h5>
            <div className="flex mt-2">
              {[1, 2, 3, 4, 5].map((i) =>
                rating >= i ? (
                  <AiFillStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246, 186, 0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                ) : (
                  <AiOutlineStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246, 186, 0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                )
              )}
            </div>

            {/* Comment box */}
            <div className="mt-5">
              <label className="block text-[18px] font-[500]">
                Write a comment
                <span className="ml-1 font-[400] text-[14px] text-[#0009]">
                  (optional)
                </span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was your product? Write your thoughts!"
                className="mt-2 w-full border p-2 rounded outline-none"
                rows={5}
              ></textarea>
            </div>

            <div
              className={`${styles.button} text-white text-[18px] mt-4`}
              onClick={rating >= 1 ? reviewHandler : null}
            >
              Submit
            </div>
          </div>
        </div>
      )}

      {/* Order total */}
      <div className="border-t w-full text-right mt-6">
        <h5 className="pt-3 text-[18px]">
          Total Price: <strong>US${data?.totalPrice}</strong>
        </h5>
      </div>

      {/* Shipping & Payment */}
      <div className="w-full mt-6 800px:flex items-start gap-6">
        <div className="w-full 800px:w-[60%]">
          <h4 className="text-[20px] font-[600]">Shipping address:</h4>
          <p className="text-[18px] mt-2">
            {data?.shippingAddress.address1} {data?.shippingAddress.address2}
          </p>
          <p className="text-[18px]">{data?.shippingAddress.country}</p>
          <p className="text-[18px]">{data?.shippingAddress.city}</p>
          <p className="text-[18px]">{data?.user?.phoneNumber}</p>
        </div>

        <div className="w-full 800px:w-[40%]">
          <h4 className="text-[20px] font-[600]">Payment Info:</h4>
          <p className="text-[18px] mt-2">
            Status: {data?.paymentInfo?.status || "Not Paid"}
          </p>
          {data?.status?.toLowerCase() === "delivered" && (
            <div
              className={`${styles.button} text-white mt-4`}
              onClick={refundHandler}
            >
              Request Refund
            </div>
          )}
        </div>
      </div>

      {/* Message seller */}
      <Link to="/">
        <div className={`${styles.button} text-white mt-6`}>Send Message</div>
      </Link>
    </div>
  );
};

export default UserOrderDetails;
