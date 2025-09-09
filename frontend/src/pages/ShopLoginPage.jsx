import React, { useEffect } from "react";
import ShopLogin from "../components/shop/ShopLogin";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


const ShopLoginPage = () => {
  const navigate = useNavigate();
  const { isSeller, seller, isLoading} = useSelector((state) => state.seller);

  useEffect(() => {
    if (isSeller === true) {
      navigate(`/dashboard`);
    }
  }, [ isLoading, isSeller]);

  // Only hide form if seller exists and we will navigate
  if (isSeller && seller?._id) return null;

  return (
    <div>
      <ShopLogin />
    </div>
  );
};

export default ShopLoginPage;




// useEffect(() => {
//     if (isSeller && seller?._id) {
//       navigate(`/shop/${seller._id}`);
//     }
//   }, [ isLoading, isSeller]);