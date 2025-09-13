import React from "react";
import styles from "../../styles/style";
import { navItems } from "../../static/data";
import { Link } from "react-router-dom";

const Navbar = ({ active }) => {
  return (
    <nav className={`block 800px:${styles.normalFlex}`}>
      {navItems?.map((item, index) => (
        <div className="flex" key={index}>
          <Link
            to={item.url}
            className={`${
              active === index + 1
                ? "text-[#17dd1f] font-semibold"
                : "text-black 800px:text-white"
            } pb-[15px] 800px:pb-0 px-3 mx-2 transition-colors duration-200 hover:text-[#17dd1f]`}
          >
            {item.title}
          </Link>
        </div>
      ))}
    </nav>
  );
};

export default Navbar;
