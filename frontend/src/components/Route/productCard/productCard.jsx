import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/style";
import ProductDetailCard from "../ProductDetailCard/ProductDetailCard.jsx";
import {
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../../redux/actions/cart.js";
import Ratings from "../../Products/Ratings.jsx";

const ProductCard = ({ data, isEvent }) => {
    const {cart} = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  // Safe product name for URL

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist]);

  

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };
  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  
    const addToCartHandler = (id) => {
      const isItemExist = cart && cart.find((i) => i._id === id);
      if (isItemExist) {
        toast.error("Item already in cart");
      } else {
      if(data.stock < 1) {
        toast.error("Product Stock limited")
      }else {
        const cartData = {...data, qty: 1};
        dispatch(addToCart(cartData));
        toast.success("Item added to cart successfully");
      }
      }
  
    }
  
    
  return (
    <>
      <div className="w-full h-[370px] bg-white rounded-lg shadow-sm p-3 relative cursor-pointer">
        <div className="flex justify-end"></div>

        {/* Product Image */}
        <Link to={`${isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}>
          <img
            src={`${data?.images?.[0]}`}
            alt={data?.name || "Product"}
            className="w-full h-[170px] object-contain"
          />
        </Link>

        {/* Shop Name */}
        <Link to={`/shop/preview/${data?.shop?._id}`}>
          <h5 className={`${styles.shop_name}`}>
            {data?.shop?.name || "Shop"}
          </h5>
        </Link>

        {/* Product Title */}
        <Link to={`${isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}>
            <h4 className="pb-3 font-[500]">
            {data?.name?.length > 40
              ? data.name.slice(0, 40) + "..."
              : data?.name || "Unnamed Product"}
          </h4>

          {/* Rating */}
          <div className="flex">
               <Ratings rating={data?.ratings} />
          </div>

          {/* Price + Sales */}
          <div className="py-2 flex items-center justify-between mt-2">
            <div className="flex">
              <h5 className={`${styles.productDiscountPrice}`}>{data?.discountPrice + "$"}</h5>


              <h5 className={`${styles.price} font-[350] ml-[-7px]`}>
                { data?.originalPrice}$
              </h5>
              {/* <h4 className={`${styles.price}`}>
                {data?.price ? data.price + "$" : null}
              </h4> */}
            </div>

            <span className="font-[300] text-[17px] text-[#68d284]">
              {data?.sold_out || 0} sold
            </span>
          </div>
        </Link>

        {/* Side Options */}
        <div>
          {click ? (
            <AiFillHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={() => removeFromWishlistHandler(data)}
              color="red"
              title="Remove from wishlist"
            />
          ) : (
            <AiOutlineHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={() => addToWishlistHandler(data)}
              color="#333"
              title="Add to wishlist"
            />
          )}

          <AiOutlineEye
            size={22}
            className="cursor-pointer absolute right-2 top-14"
            onClick={() => setOpen(!open)}
            color="#333"
            title="Quick view"
          />

          <AiOutlineShoppingCart
            size={25}
            className="cursor-pointer absolute right-2 top-24"
            onClick={() => addToCartHandler(data._id)}
            color="#444"
            title="Add to cart"
          />

          {open && <ProductDetailCard setOpen={setOpen} data={data} />}
        </div>
      </div>
    </>
  );
};

export default ProductCard;
