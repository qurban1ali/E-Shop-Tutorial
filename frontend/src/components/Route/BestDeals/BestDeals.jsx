import React, { useEffect, useState } from "react";
import styles from "../../../styles/style";
import ProductCard from "../productCard/productCard";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../../redux/actions/product";

const BestDeals = () => {
  const [data, setData] = useState([]);
  const {allProducts} = useSelector((state) => state.products);
    const dispatch = useDispatch();

 
  //tutorial code
   
  // useEffect(() => {
  //   const allProductsData = allProducts ? [...allProducts] : [];
  //   const sortData = allProductsData?.sort((a,b) => b.sold_out - a.sold_out)
  //    const firstFive = sortData && sortData.slice(0,5)
  // }, [allProducts]);


      useEffect(() => {
    dispatch(getAllProducts()); // fetch products from backend
  }, [dispatch]);

  
   //chat gpt code
 useEffect(() => {
    if (allProducts && Array.isArray(allProducts)) {
const firstFive = [...allProducts]
        .sort((a, b) => b.sold_out - a.sold_out) // optional sort
        .slice(0, 5);
      setData(firstFive);
    }
  }, [allProducts]);


     console.log(allProducts)


  return (
    <div>
      <div className={`${styles.section}`}>
        <div className={`${styles.heading}`}>
          <h1>Best Deals </h1>
        </div>
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-10 border-0">
          {
            data && data.length !== 0 &&(
              <>
              {data && data.map((i, index) => <ProductCard data={i} key={index} />)}
              </>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default BestDeals;
