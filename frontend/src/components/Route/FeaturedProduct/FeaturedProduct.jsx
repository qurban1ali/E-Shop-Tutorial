import React from "react";
import styles from "../../../styles/style";
import { productData } from "../../../static/data";
import ProductCard from "../productCard/productCard";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const FeaturedProduct = () => {
  const { t } = useTranslation();

  const { allProducts } = useSelector((state) => state.products);

  return (
    <div>
      <div className={`${styles.section}`}>
        <div className={`${styles.heading}`}>{t("featured_product")}</div>
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-10 border-0">
          {allProducts && allProducts.length !== 0 && (
            <>
              {allProducts &&
                allProducts.map((i, index) => (
                  <ProductCard data={i} key={index} />
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;
