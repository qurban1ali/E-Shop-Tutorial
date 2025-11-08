import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/style";
import { useTranslation } from "react-i18next";

const DropDown = ({ categoriesData, setDropDown }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const submitHandler = (i) => {
    navigate(`/products?category=${i.key}`); // Use key for URL
    setDropDown(false);
  };

  return (
    <div className="absolute top-full left-0 w-[250px] bg-white z-30 rounded-b-md shadow-md">
      {categoriesData?.map((i, index) => (
        <div
          key={index}
          className={`flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100 transition ${styles.normalFlex}`}
          onClick={() => submitHandler(i)}
        >
          <img
            src={i.image_Url}
            alt={t(`categories.${i.key}`)}
            className="w-[25px] h-[25px] object-contain select-none"
          />
          <h3 className="text-sm font-medium select-none">{t(i.title)}</h3>
        </div>
      ))}
    </div>
  );
};

export default DropDown;
