import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../../styles/style";
import ShopInfo from "../../components/shop/ShopInfo";
import ShopProfileData from "../../components/shop/ShopProfileData";
import axios from "axios";
import { server } from "../../server";

const ShopPreviewPage = () => {
  const { id } = useParams(); 
  const [shop, setShop] = useState(null);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const { data } = await axios.get(`${server}/shop/get-shop-info/${id}`);
        setShop(data.shop);
      } catch (error) {
        console.error("Error fetching shop:", error);
      }
    };
    fetchShop();
  }, [id]);

  if (!shop) {
    return <p className="text-center py-10">Loading shop details...</p>;
  }

  return (
    <div className={`${styles.section} bg-[#f5f5f5]`}>
      <div className="w-full flex flex-col 800px:flex 800px:flex-row py-10 justify-between">
        <div className="w-full 800px:w-[25%] bg-[#fff] shadow-sm 800px:sticky left-0 z-10 rounded-[4px] overflow-y-scroll h-[90vh] top-10">
          <ShopInfo isOwner={false} shop={shop} />
        </div>
        <div className="w-full 800px:w-[72%] rounded-[4px]">
          <ShopProfileData isOwner={false} shop={shop} />
        </div>
      </div>
    </div>
  );
};

export default ShopPreviewPage;
