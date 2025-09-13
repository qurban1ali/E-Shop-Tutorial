import React from "react";
import { AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { BiMessageSquareDetail } from "react-icons/bi";

const AdminHeader = () => {
  const { user } = useSelector((state) => state.user);

  // ✅ Ensure avatar always shows (fallback if missing)
  const avatarUrl = user?.avatar?.url || "/default-avatar.png";

  return (
    <div className="w-full sticky top-0 flex items-center justify-between h-[80px] bg-white shadow left-0 z-30 px-4">
      {/* LOGO */}
      <div>
        <Link to="/">
          <img
            src="https://shopo.quomodothemes.website/assets/images/logo.svg"
            alt="Shop Logo"
            className="h-[40px] object-contain"
          />
        </Link>
      </div>

      {/* NAV ICONS */}
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <Link to="/dashboard/cupouns" className="800px:block hidden">
            <AiOutlineGift
              color="#555"
              size={28}
              className="mx-5 cursor-pointer hover:scale-110 transition"
            />
          </Link>

          <Link to="/dashboard-events" className="800px:block hidden">
            <MdOutlineLocalOffer
              color="#555"
              size={28}
              className="mx-5 cursor-pointer hover:scale-110 transition"
            />
          </Link>

          <Link to="/dashboard-products" className="800px:block hidden">
            <FiShoppingBag
              color="#555"
              size={28}
              className="mx-5 cursor-pointer hover:scale-110 transition"
            />
          </Link>

          <Link to="/dashboard-orders" className="800px:block hidden">
            <FiPackage
              color="#555"
              size={28}
              className="mx-5 cursor-pointer hover:scale-110 transition"
            />
          </Link>

          <Link to="/dashboard-messages" className="800px:block hidden">
            <BiMessageSquareDetail
              color="#555"
              size={28}
              className="mx-5 cursor-pointer hover:scale-110 transition"
            />
          </Link>

          {/* ✅ Admin Avatar */}
          <img
            src={avatarUrl}
            alt={user?.name || "Admin"}
            className="w-[50px] h-[50px] rounded-full object-cover border border-gray-300"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
