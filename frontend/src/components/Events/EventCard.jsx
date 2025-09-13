import React from "react";
import styles from "../../styles/style";
import CountDown from "../CountDown";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/actions/cart";
import { useDispatch, useSelector } from "react-redux";

const EventCard = ({ active, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  if (!data) return null;

  // ✅ Ensure Cloudinary image URL is always picked
  const imageUrl =
    data?.images?.[0]

  const addToCartHandler = (item) => {
    const isItemExists = cart && cart.find((i) => i._id === item._id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      const cartData = { ...item, qty: 1 };
      dispatch(addToCart(cartData));
      toast.success("Item added to cart successfully!");
    }
  };

  return (
    <div
      className={`w-full block bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ${
        active ? "unset" : "mb-12"
      } lg:flex p-3`}
    >
      {/* LEFT: Product Image */}
      <div className="w-full lg:w-[50%] flex justify-center items-center">
        <img
          src={imageUrl}
          alt={data.name || "Event Product"}
          className="max-h-[300px] w-auto object-contain rounded-md"
        />
      </div>

      {/* RIGHT: Product Info */}
      <div className="w-full lg:w-[50%] flex flex-col justify-center lg:pl-8 mt-5 lg:mt-0">
        {/* Name + Description */}
        <h2 className={`${styles.productTitle} mb-2`}>{data.name}</h2>
        <p className="text-gray-600 mb-3">{data.description}</p>

        {/* Prices + Sold */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            {data.originalPrice && (
              <h5 className="font-medium text-[16px] text-gray-400 line-through">
                ${data.originalPrice}
              </h5>
            )}
            <h5 className="font-bold text-[20px] text-[#333] font-Roboto">
              ${data.discountPrice}
            </h5>
          </div>
          <span className="text-[15px] text-[#44a55e]">
            {data.sold_out || 0} sold
          </span>
        </div>

        {/* Countdown */}
        <CountDown data={data} />

        {/* Buttons */}
        <div className="flex gap-3 mt-5">
          <Link to={`/product/${data._id}?isEvent=true`}>
            <div className={`${styles.button} text-white`}>
              See Details
            </div>
          </Link>
          <div
            className={`${styles.button} text-white bg-[#44a55e] hover:bg-[#388f4f] transition`}
            onClick={() => addToCartHandler(data)}
          >
            Add to Cart
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
