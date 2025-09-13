import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/style";

const DropDown = ({ categoriesData, setDropDown }) => {
  const navigate = useNavigate();

  const submitHandler = (i) => {
    navigate(`/products?category=${i.title}`);
    setDropDown(false); // ✅ Close dropdown only
  };

  return (
    <div className="absolute top-full left-0 w-[250px] bg-white z-30 rounded-b-md shadow-md">
      {categoriesData &&
        categoriesData.map((i, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100 transition ${styles.normalFlex}`}
            onClick={() => submitHandler(i)}
          >
            <img
              src={i.image_Url}
              alt={i.title}
              className="w-[25px] h-[25px] object-contain select-none"
            />
            <h3 className="text-sm font-medium select-none">{i.title}</h3>
          </div>
        ))}
    </div>
  );
};

export default DropDown;
