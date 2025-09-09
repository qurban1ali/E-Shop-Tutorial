import React from 'react'
import styles from '../../styles/style'
import ShopInfo from "../../components/shop/ShopInfo"
import ShopProfileData from "../../components/shop/ShopProfileData"

const ShopHomePage = () => {
  return (
    <div className={`${styles.section} bg-[#f5f5f5]`}>
         <div className="w-full flex flex-col 800px:flex 800px:flex-row py-10 justify-between">
          <div className=" w-full 800px:w-[25%] bg-[#fff] rounded-[4px] shadow-sm overflow-y-scroll h-[90vh] 800px:sticky top-10 left-0 z-10">
            <ShopInfo isOwner={true} />
          </div>
          <div className="w-full 800px:w-[72%] rounded-[4px]">
            <ShopProfileData isOwner={true} />
          </div>
         </div>
    </div>
  )
}

export default ShopHomePage
