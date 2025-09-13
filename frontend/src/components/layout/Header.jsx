import { useState, useEffect } from "react";
import styles from "../../styles/style";
import { Link } from "react-router-dom";
import { categoriesData } from "../../static/data";
import Cart from "../Cart/Cart";
import Wish from "../Wishlist/Wishlist.jsx";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import DropDown from "./DropDown";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { Avatar } from "../../assests/asset";
import { RxCross1 } from "react-icons/rx";

const Header = ({ activeHeading }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const { allProducts } = useSelector((state) => state.products);
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);

  // ✅ Fix avatar logic
  const fullAvatarUrl = user?.avatar?.url || Avatar;

  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openCard, setOpenCard] = useState(false);
  const [openwishlist, setOpenWishlist] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filturedProducts =
      allProducts &&
      allProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );

    setSearchData(filturedProducts);
  };

  useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 70);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* FIRST HEADER */}
      <div className={`${styles.section}`}>
        <div className="hidden 800px:h-[50px] 800px:my-[20px] 800px:flex items-center justify-between">
          {/* LOGO */}
          <Link to="/">
            <img
              src="https://shopo.quomodothemes.website/assets/images/logo.svg"
              alt="Logo"
            />
          </Link>

          {/* SEARCH */}
          <div className="w-[50%] relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md"
            />
            <AiOutlineSearch
              size={30}
              className="absolute right-2 top-1.5 cursor-pointer"
            />
            {searchData?.length > 0 && (
              <div className="absolute min-h-[30vh] w-full bg-slate-50 shadow-sm-2 z-[9] p-4">
                {searchData.map((i, index) => (
                  <Link key={index} to={`/product/${i._id}`}>
                    <div className="w-full flex items-center py-3">
                      <img
                        src={i.images?.[0]}
                        className="w-[40px] h-[40px] mr-[10px] object-cover"
                        alt={i.name}
                      />
                      <h1>{i.name}</h1>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* BECOME SELLER */}
          <div className={`${styles.button}`}>
            <Link to={isSeller ? "/dashboard" : "/shop-create"}>
              <h1 className="text-[#fff] flex items-center">
                {isSeller ? "Go Dashboard" : "Become Seller"}{" "}
                <IoIosArrowForward className="ml-1 mt-1" />
              </h1>
            </Link>
          </div>
        </div>
      </div>

      {/* SECOND HEADER */}
      <div
        className={`${
          active ? "shadow-sm fixed top-0 left-0 right-0 z-10" : ""
        } transition hidden 800px:flex items-center justify-between w-full bg-[#3321c8] h-[60px]`}
      >
        <div
          className={`${styles.section} relative ${styles.normalFlex} justify-between`}
        >
          {/* CATEGORIES */}
          <div
            onClick={() => setDropDown(!dropDown)}
            className="relative h-[50px] mt-[10px] w-[250px] hidden 900px:block bg-white rounded-t-md cursor-pointer"
          >
            <BiMenuAltLeft size={30} className="absolute top-3 left-2" />
            <button className="h-full w-[70%] pl-5 bg-white font-sans text-lg font-[500] select-none rounded-t-md">
              All Categories
            </button>
            <IoIosArrowDown
              className="absolute right-2 top-4"
              onClick={() => setDropDown(!dropDown)}
            />
            {dropDown && (
              <DropDown
                categoriesData={categoriesData}
                setDropDown={setDropDown}
              />
            )}
          </div>

          {/* NAVBAR */}
          <Navbar active={activeHeading} />

          {/* RIGHT ICONS */}
          <div className="flex items-center">
            {/* WISHLIST */}
            <div
              className="relative cursor-pointer mr-[15px]"
              onClick={() => setOpenWishlist(true)}
            >
              <AiOutlineHeart size={30} color="rgb(255 255 255 / 83%)" />
              <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 text-white text-[12px] flex items-center justify-center">
                {wishlist?.length}
              </span>
            </div>
            {openwishlist && <Wish setOpenWishlist={setOpenWishlist} />}

            {/* CART */}
            <div
              className="relative cursor-pointer mr-[15px]"
              onClick={() => setOpenCard(true)}
            >
              <AiOutlineShoppingCart size={30} color="rgb(255 255 255 / 83%)" />
              <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 text-white text-[12px] flex items-center justify-center">
                {cart?.length}
              </span>
            </div>
            {openCard && <Cart setOpenCard={setOpenCard} />}

            {/* PROFILE */}
            <div className="relative cursor-pointer mr-[15px]">
              {isAuthenticated ? (
                <Link to="/profile">
                  <img
                    src={fullAvatarUrl}
                    onError={(e) => (e.target.src = Avatar)}
                    className="w-10 h-10 border-green-700 rounded-full border-2 object-cover"
                    alt="User Avatar"
                  />
                </Link>
              ) : (
                <Link to="/login">
                  <CgProfile size={30} color="rgb(255 255 255 / 83%)" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE HEADER */}
      <div
        className={`${
          active ? "shadow-sm fixed top-0 left-0 z-10" : ""
        } w-full h-[70px] fixed bg-[#fff] z-50 800px:hidden`}
      >
        <div className="w-full flex items-center justify-between">
          <BiMenuAltLeft
            size={40}
            className="ml-4"
            onClick={() => setOpen(true)}
          />

          {/* LOGO */}
          <Link to="/">
            <img
              src="https://shopo.quomodothemes.website/assets/images/logo.svg"
              alt="Logo"
              className="mt-3 cursor-pointer"
            />
          </Link>

          {/* CART ICON */}
          <div
            className="relative mr-[20px]"
            onClick={() => setOpenCard(true)}
          >
            <AiOutlineShoppingCart size={40} />
            <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 text-white text-[12px] flex items-center justify-center">
              {cart?.length}
            </span>
          </div>
          {openCard && <Cart setOpenCard={setOpenCard} />}
          {openwishlist && <Wish setOpenWishlist={setOpenWishlist} />}
        </div>

        {/* SIDEBAR */}
        {open && (
          <div className="fixed w-full bg-[#0000005f] z-20 h-full top-0 left-0">
            <div className="fixed w-[70%] bg-white h-screen top-0 left-0 z-30">
              <div className="flex justify-between items-center pr-3">
                {/* Wishlist Icon */}
                <div
                  className="relative mr-[15px] mt-5 ml-3 cursor-pointer"
                  onClick={() => {
                    setOpenWishlist(true);
                    setOpen(false);
                  }}
                >
                  <AiOutlineHeart size={40} />
                  <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 text-white text-[12px] flex items-center justify-center">
                    {wishlist?.length}
                  </span>
                </div>
                <RxCross1
                  size={40}
                  className="mt-5 cursor-pointer"
                  onClick={() => setOpen(false)}
                />
              </div>

              {/* Search */}
              <div className="my-8 w-[92%] m-auto">
                <input
                  type="search"
                  placeholder="Search products..."
                  className="h-10 w-full px-2 border-[#3957db] border-2 rounded-md"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchData?.length > 0 && (
                  <div className="absolute min-h-[30vh] w-full bg-slate-50 shadow-sm-2 z-[9] p-4">
                    {searchData.map((i, index) => (
                      <Link key={index} to={`/product/${i._id}`}>
                        <div className="w-full flex items-center py-3">
                          <img
                            src={i.images?.[0]}
                            className="w-[40px] h-[40px] mr-[10px] object-cover"
                            alt={i.name}
                          />
                          <h1>{i.name}</h1>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Navbar active={activeHeading} />

              <div className={`${styles.button} ml-3 !rounded-[4px]`}>
                <Link to="/shop-create">
                  <h1 className="text-[#fff] flex items-center">
                    Become Seller <IoIosArrowForward className="ml-1 mt-1" />
                  </h1>
                </Link>
              </div>

              <div className="flex w-full justify-center mt-10">
                {isAuthenticated ? (
                  <Link to="/profile">
                    <img
                      src={fullAvatarUrl}
                      onError={(e) => (e.target.src = Avatar)}
                      className="w-16 h-16 border-green-700 rounded-full border-2 object-cover"
                      alt="User Avatar"
                    />
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className="text-xl pr-2 text-[#000000b7]">
                      Login/
                    </Link>
                    <Link to="/sign-up" className="text-xl text-[#000000b7]">
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
