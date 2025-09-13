import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categoriesData } from "../../static/data";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { toast } from "react-toastify";
import axios from "axios";
import { createProduct } from "../../redux/actions/product";

const CreateProduct = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.products);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]); // Cloudinary URLs
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");

  // Upload images to Cloudinary
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);

    for (let file of files) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "ecommrence"); // must exist in Cloudinary
      data.append("cloud_name", "du6xqru9r");

      try {
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/du6xqru9r/image/upload",
          data
        );

        if (res.data.secure_url) {
          setImages((prev) => [...prev, res.data.secure_url]);
        } else {
          toast.error("Image upload failed!");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error uploading image");
      }
    }
  };

  // Submit product
  // Frontend handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!images.length) return toast.error("Please upload at least one image!");

    const productData = {
      name,
      description,
      category,
      tags,
      originalPrice,
      discountPrice,
      stock,
      shopId: seller._id,
      images, // these are already Cloudinary URLs
    };

    await dispatch(createProduct(productData));
  }


    useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Product created successfully!");
      navigate("/dashboard-products");
      window.location.reload();
    }
  }, [error, success, navigate]);
  

  return (
    <div className="w-[90%] 800px:w-[50%] shadow p-3 overflow-y-scroll h-[80vh] rounded-[4px] bg-white">
      <h5 className="text-[30px] font-Poppins text-center">Create Product</h5>

      {/* create product form */}
      <form onSubmit={handleSubmit}>
        <br />
        <div>
          <label className="pb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter product name..."
          />
        </div>

        <br />
        <div>
          <label className="pb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            cols="30"
            rows="8"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 block w-full px-3 pt-2 border border-gray-300 rounded-[3px] focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter product description"
          ></textarea>
        </div>

        <br />
        <div>
          <label className="pb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            required
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Choose a category</option>
            {categoriesData &&
              categoriesData.map((i) => (
                <option value={i.title} key={i.title}>
                  {i.title}
                </option>
              ))}
          </select>
        </div>

        <br />
        <div>
          <label className="pb-2">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="mt-2 block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter product tags..."
          />
        </div>

        <br />
        <div>
          <label className="pb-2">Original Price</label>
          <input
            type="number"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            className="mt-2 block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter product original price..."
          />
        </div>

        <br />
        <div>
          <label className="pb-2">
            Price (With Discount) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            required
            value={discountPrice}
            onChange={(e) => setDiscountPrice(e.target.value)}
            className="mt-2 block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter product discounted price..."
          />
        </div>

        <br />
        <div>
          <label className="pb-2">
            Product Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            required
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="mt-2 block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter product stock..."
          />
        </div>

        <br />
        <div>
          <label className="pb-2">
            Upload Image <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="upload"
            className="hidden"
            multiple
            onChange={handleImageChange}
          />
          <div className="w-full flex items-center flex-wrap">
            <label htmlFor="upload">
              <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
            </label>
            {images &&
              images.map((url, idx) => (
                <img
                  src={url}
                  alt={`preview-${idx}`}
                  key={idx}
                  className="object-cover m-2 h-[120px] w-[120px]"
                />
              ))}
          </div>
        </div>

        <br />
        <div>
          <input
            type="submit"
            value="Create"
            className="mt-2 block w-full px-3 h-[35px] bg-blue-500 text-white rounded-[3px] hover:bg-blue-600 cursor-pointer"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
