import axios from "axios";
import {server} from "../../server";
import { Country } from "country-state-city";
import { data } from "react-router-dom";

// LOAD USER

export const loadUser = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoadUserRequest",
    });
    const { data } = await axios.get(`${server}/user/getUser`, {
      withCredentials: true,
    });
    dispatch({
      type: "LoadUserSuccess",
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: "LoadUserFail",
      payload: error.response?.data.message || "Some thing went wrong",
    });
  }
};

// LOAD SHOP

export const loadShop = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoadSellerRequest",
    });
    const { data } = await axios.get(`${server}/shop/getSeller`, {
      withCredentials: true,
    });
    dispatch({
      type: "LoadSellerSuccess",
            payload: data?.seller,
    });
  } catch (error) {
    dispatch({
      type: "LoadSellerFail",
      payload: error.response?.data.message || "Some thing went wrong",
    });
  }
};
    


//user update information
export const updateUserInformation = ({email, password, phoneNumber, name}) => async (dispatch) => {
try {
     dispatch({
    type:  "updateUserInfoRequest"
   })
   const {data} = await axios.put(`${server}/user/update-user-info`, {
    email,
    password,
    phoneNumber,
    name,
   },{
    withCredentials: true,
   });
   dispatch({
    type: "updateUserInfoSuccess",
    payload: data.user,
    
   })
} catch (error) {
  dispatch({
    type:"updateUserInfoFailed",
    payload:error.response.data.message
  })
}

}

// update user address
export const updateUserAddress = ( country,
      city,
      address1,
      address2,
      addressType,
      zipCode
    ) => async(dispatch) => {
  try {
    dispatch({
      type:"updateUserAddressRequest"
    })

    const {data} = await axios.put(`${server}/user/update-user-addresses`, {
      country,
      city,
      address1,
      address2,
      addressType,
      zipCode 
    }, {withCredentials: true});
    dispatch({
      type: "updateUserAddressSuccess",
      payload:{
        successMessage: "User Adress updated successfully!",
        user: data.user
      }
    })
    
  } catch (error) {
      dispatch({
    type:"updateUserAddressFailed",
    payload:error.response?.data.message
  })
  }
}



// delete user address
export const deleteUserAddress = (id) => async (dispatch) => {
  try {
    dispatch({ type: "deleteUserAddressRequest" });

    const { data } = await axios.delete(
      `${server}/user/delete-user-address/${id}`,  // ✅ fixed
      { withCredentials: true }
    );

    dispatch({
      type: "deleteUserAddressSuccess",
      payload: {
        successMessage: "Address deleted successfully!",
        user: data.user,
      },
    });
  } catch (error) {
    dispatch({
      type: "deleteUserAddressFailed",
      payload: error.response?.data.message || "Something went wrong",
    });
  }
};


  

// get all users -- admin
export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({ type: "getAllUsersRequest" });

    const { data } = await axios.get(`${server}/user/admin-all-users`, {
      withCredentials: true,
    });

    dispatch({
      type: "getAllUsersSuccess",
      payload: data.users, // 👈 FIX: should be users not user
    });
  } catch (error) {
    dispatch({
      type: "getAllUsersFailed",
      payload: error.response?.data.message,
    });
  }
};
