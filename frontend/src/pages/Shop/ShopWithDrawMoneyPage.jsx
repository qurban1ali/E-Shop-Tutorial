import React from 'react'
import DashboardSideBar from '../../components/shop/Layout/DashboardSideBar'
import WithdrawMoney from "../../components/shop/WithdrawMoney"
import DashboardHeader from '../../components/shop/Layout/DashboardHeader'
const ShopWithDrawMoneyPage = () => {
  return (
  <div>
        <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">

            <DashboardSideBar active={7} />
        </div>
            <WithdrawMoney />
      </div>
    </div>  )
}

export default ShopWithDrawMoneyPage