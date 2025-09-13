import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/style";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { server } from "../../server";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/actions/wishlist";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/actions/cart";
import Ratings from "./Ratings";
import axios from "axios";

const ProductDetails = ({ data }) => {
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const navigate = useNavigate();
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { shopProducts } = useSelector((state) => state.products);

  const dispatch = useDispatch();

  useEffect(() => {
    if (data?.shop?._id) {
      dispatch(getAllProductsShop(data?.shop._id));
    }
    if (wishlist && data?._id && wishlist.find((i) => i._id === data?._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data, dispatch]);

  const removeFromWishlistHandler = (data) => {
    setClick(false);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(true);
    dispatch(addToWishlist(data));
  };

  const addToCartHandler = (id) => {
    const isItemExist = cart && cart.find((i) => i._id === id);
    if (isItemExist) {
      toast.error("Item already in cart");
    } else {
      if (data.stock < 1) {
        toast.error("Product Stock limited");
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addToCart(cartData));
        toast.success("Item added to cart successfully");
      }
    }
  };

  function increment() {
    setCount(count + 1);
  }
  function decrement() {
    if (count > 1) {
      setCount(count - 1);
    }
  }

  const totalReviewsLength =
    shopProducts?.reduce(
      (acc, product) => acc + (product.reviews?.length || 0),
      0
    ) || 0;

  const totalRatings =
    shopProducts?.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    ) || 0;

  const averageRating = totalRatings / totalReviewsLength || 0;

  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = data._id + user._id;
      const userId = user._id;
      const sellerId = data.shop._id;
      try {
        const res = await axios.post(
          `${server}/conversation/create-new-conversation`,
          {
            groupTitle,
            userId,
            sellerId,
          }
        );
        navigate(`/inbox?${res.data.conversation._id}`);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to create conversation"
        );
      }
    } else {
      toast.error("Please login to create a conversation");
    }
  };

  return (
    <div className="bg-white">
      {data ? (
        <div className={`unset ${styles.section} w-[90%] 800px:w-[80%] h-full`}>
          {/* TOP COMPONENT */}
          <div className="w-full py-5 ">
            <div className="w-full 800px:flex">
              {/* LEFT SIDE CONTENT */}
              <div className="w-full 800px:w-[50%]">
                {data?.images?.length > 0 ? (
                  <img
                    src={data?.images?.[select] || ""}
                    alt={data?.name || "Product image"}
                    className="w-[80%] object-contain"
                  />
                ) : (
                  <div className="w-[80%] h-[300px] bg-gray-200 flex items-center justify-center">
                    <span>No Image Available</span>
                  </div>
                )}

                {/* Thumbnails */}
                <div className="w-full flex flex-wrap">
                  {data?.images?.map((img, index) => (
                    <div
                      key={index}
                      className={`${
                        select === index ? "border-2 border-teal-500" : ""
                      } cursor-pointer mr-3 mt-3`}
                      onClick={() => setSelect(index)}
                    >
                      <img
                        src={img || ""}
                        alt={`Thumbnail ${index + 1}`}
                        className="h-[100px] w-[100px] object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT SIDE CONTENT */}
              <div className="w-full 800px:w-[50%] pt-5">
                <h1 className={`${styles.productTitle}`}>{data.name}</h1>
                <p>{data.description}</p>

                {/* PRICE */}
                <div className="flex pt-3 items-center">
                  <h4 className={`${styles.productDiscountPrice}`}>
                    {data.discountPrice}$
                  </h4>
                  {data.originalPrice && (
                    <h3 className={`${styles.price} line-through ml-3`}>
                      {data.originalPrice}$
                    </h3>
                  )}
                </div>

                {/* Quantity + Wishlist */}
                <div
                  className={`${styles.normalFlex} mt-12 justify-between pr-3`}
                >
                  <div className="flex items-center">
                    <button
                      className="bg-teal-500 text-white font-bold rounded-l px-4 py-2 hover:opacity-75"
                      onClick={decrement}
                    >
                      -
                    </button>
                    <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[11px]">
                      {count}
                    </span>
                    <button
                      className="bg-teal-500 text-white font-bold rounded-r px-4 py-2 hover:opacity-75"
                      onClick={increment}
                    >
                      +
                    </button>
                  </div>
                  <div>
                    {click ? (
                      <AiFillHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => removeFromWishlistHandler(data)}
                        color="red"
                        title="Remove from wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => addToWishlistHandler(data)}
                        color="#333"
                        title="Add to wishlist"
                      />
                    )}
                  </div>
                </div>

                {/* ADD TO CART */}
                <div
                  className={`${styles.button} !mt-6 !rounded !h-11 flex items-center`}
                  onClick={() => addToCartHandler(data._id)}
                >
                  <span className="text-white flex items-center">
                    Add to cart <AiOutlineShoppingCart className="ml-1" />
                  </span>
                </div>

                {/* SEND MESSAGE */}
                <div className="flex items-center pt-8 ">
                  <Link to={`/shop/preview/${data?.shop._id}`}>
                    <img
                      src={data?.shop?.avatar?.url || ""}
                      alt="Shop"
                      className="w-[50px] h-[50px] rounded-full mr-2 object-cover"
                    />
                  </Link>
                  <div className="pr-8">
                    <Link to={`/shop/preview/${data?.shop._id}`}>
                      <h3 className={`${styles.shop_name} pt-1`}>
                        {data.shop.name}
                      </h3>
                    </Link>
                    <h5 className="pb-3 text-[15px]">
                      ({averageRating.toFixed(1)}/5) Ratings
                    </h5>
                  </div>
                  <div
                    className={`${styles.button} bg-[#6443d1] !rounded !h-11`}
                    onClick={handleMessageSubmit}
                  >
                    <span className="text-white flex items-center">
                      Send Message <AiOutlineMessage className="ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM COMPONENT */}
          <ProductDetailsInfo
            data={data}
            products={shopProducts}
            totalReviewsLength={totalReviewsLength}
            averageRating={averageRating}
          />
        </div>
      ) : null}
    </div>
  );
};

const ProductDetailsInfo = ({
  data,
  products,
  totalReviewsLength,
  averageRating,
}) => {
  const [active, setActive] = useState(1);

  return (
    <div className="bg-[#f5f6fb] px-3 800px:px-10 py-2 rounded h-full">
      {/* HEADINGS */}
      <div className="w-full flex justify-between border-b pt-10 pb-2">
        {["Product Detail", "Product Reviews", "Seller Information"].map(
          (tab, idx) => (
            <div key={idx} className="relative">
              <h5
                className="text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer"
                onClick={() => setActive(idx + 1)}
              >
                {tab}
              </h5>
              {active === idx + 1 && (
                <div className={`${styles.active_indicator}`} />
              )}
            </div>
          )
        )}
      </div>

      {/* TAB CONTENT */}
      {active === 1 && (
        <p className="py-2 text-[18px] leading-8 pb-10 whitespace-pre-line">
          {data.description}
        </p>
      )}

      {active === 2 && (
        <div className="w-full min-h-[40vh] flex flex-col items-center py-3 overflow-y-scroll">
          {data?.reviews?.length > 0 ? (
            data.reviews.map((item) => (
              <div className="w-full flex my-2" key={item._id}>
                <img
                  src={item?.user?.avatar?.url || ""}
                  alt={item?.user?.name || "User"}
                  className="w-11 h-11 rounded-full object-cover"
                />
                <div className="ml-2">
                  <div className="flex items-center">
                    <h1 className="font-bold mr-3">{item?.user?.name}</h1>
                    <Ratings rating={item.rating} />
                  </div>
                  <p>{item?.comment}</p>
                </div>
              </div>
            ))
          ) : (
            <h5>No Reviews for this product!</h5>
          )}
        </div>
      )}

      {active === 3 && (
        <div className="w-full p-5 flex flex-col 800px:flex-row justify-between">
          <div className="w-full 800px:w-[50%]">
            <Link to={`/shop/preview/${data.shop._id}`}>
              <div className="flex items-center">
                <img
                  src={data?.shop?.avatar?.url || ""}
                  className="w-[50px] h-[50px] rounded-full object-cover"
                  alt="Shop"
                />
                <div className="pl-3">
                  <h3 className={`${styles.shop_name}`}>{data.shop.name}</h3>
                  <h4 className="pb-3 text-[15px]">
                    ({averageRating.toFixed(1)}/5) Ratings
                  </h4>
                </div>
              </div>
            </Link>
            <p className="pt-3 ">{data.shop.description}</p>
          </div>
          <div className="w-full 800px:w-[50%] mt-5 800px:mt-0">
            <h5 className="font-[700]">
              Joined on:{" "}
              <span className="font-[500]">
                {data.shop?.createdAt?.slice(0, 10)}
              </span>
            </h5>
            <h5 className="font-[700] pt-3">
              Total Products:{" "}
              <span className="font-[500]">{products?.length}</span>
            </h5>
            <h5 className="font-[700] pt-3">
              Total Reviews:{" "}
              <span className="font-[500]">{totalReviewsLength}</span>
            </h5>
            <Link to={`/shop/preview/${data.shop._id}`}>
              <div className={`${styles.button} rounded !h-[40px] mt-3`}>
                <h4 className="text-white font-semibold text-[18px]">
                  Visit Shop
                </h4>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
