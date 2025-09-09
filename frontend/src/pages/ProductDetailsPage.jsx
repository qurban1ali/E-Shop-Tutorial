import React, { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductDetails from "../components/Products/ProductDetails.jsx";
import { useParams, useSearchParams } from "react-router-dom";
import SuggestedProduct from "../components/Products/SuggestedProduct.jsx";
import { useSelector, useDispatch } from "react-redux";
import { getAllProducts } from "../redux/actions/product"; 

const ProductDetailsPage = () => {
  const { allEvents } = useSelector((state) => state.event);
  const { allProducts } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();
  const eventData = searchParams.get("isEvent"); // returns "true" or null
  const { id } = useParams();

  const [data, setData] = useState(null);

  // Fetch products if not already loaded
  useEffect(() => {
    if (!allProducts || allProducts.length === 0) {
      dispatch(getAllProducts());
    }
  }, [dispatch, allProducts]);

  // Decide whether to use events or products
  useEffect(() => {
    if (eventData !== null) {
      // ?isEvent is in the URL → look inside events
      if (allEvents && allEvents.length > 0) {
        const eventItem = allEvents.find((i) => i._id === id);
        setData(eventItem);
      }
    } else {
      // Otherwise → look inside products
      if (allProducts && allProducts.length > 0) {
        const productItem = allProducts.find((i) => i._id === id);
        setData(productItem);
      }
    }
  }, [id, eventData, allProducts, allEvents]);

  console.log("eventData:", eventData);
  console.log("data:", data);

  return (
    <div>
      <Header />
      <ProductDetails data={data} />
      {!eventData && data && <SuggestedProduct data={data} />}
      <Footer className="mb-10" />
    </div>
  );
};

export default ProductDetailsPage;
