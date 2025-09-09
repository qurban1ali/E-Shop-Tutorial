import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import styles from "../../styles/style";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { loadShop } from "../../redux/actions/user";
import { AiOutlineDelete } from "react-icons/ai";

const WithdrawMoney = () => {
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);
  const [open, setOpen] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(null);
  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    bankCountry: "",
    bankSwiftCode: null,
    bankHolderName: null,
    bankAccountNumber: null,
    bankAddress: null,
  });

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch]);

    

  const handleSubmit = async (e) => {
    e.preventDefault();

    const withdrawMethod = {
      bankName: bankInfo.bankName,
      bankCountry: bankInfo.bankCountry,
      bankSwiftCode: bankInfo.bankSwiftCode,
      bankHolderName: bankInfo.bankHolderName,
      bankAccountNumber: bankInfo.bankAccountNumber,
      bankAddress: bankInfo.bankAddress,
    };

    dispatch(loadShop());

    await axios
      .put(
        `${server}/shop/update-payment-methods`,
        {
          withdrawMethod,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Withdraw method added successfully!");
        setBankInfo({
          bankName: "",
          bankCountry: "",
          bankSwiftCode: null,
          bankHolderName: null,
          bankAccountNumber: "",
          bankAddress: "",
        });
        setPaymentMethods(false);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  const deleteHandler = async () => {
    await axios
      .delete(`${server}/shop/delete-withdraw-method`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success("Withdraw method deleted successfully!");
        dispatch(loadShop());
      });
  };

  const error = () => {
    toast.error("You do not have enough balance to withdraw");
  };

  const withdrawHandler = async () => {
    if (
      withdrawAmount < 50 || withdrawAmount > availableBalance) {
      toast.error("You can't withdraw this amount!");
    } else {
      const amount = withdrawAmount;
      await axios
        .post(
          `${server}/withdraw/create-withdraw-request`,
          { amount },
          { withCredentials: true }
        )
        .then((res) => {
          toast.success("withdraw money request is successful!");
        });
    }
  };
 
 const availableBalance =  seller?.availableBalance.toFixed(2)
  return (
    <div className="w-full h-[90vh] p-8">
      <div className="w-full bg-white h-full rounded flex items-center justify-center flex-col">
        <h5 className="text-[20px] pb-4">
          Available Balance: {availableBalance}{" "}
        </h5>
        <div
          className={`${styles.button} text-white !h-[42px] !rounded`}
            onClick={() => availableBalance < 50 ? error()  : setOpen(true)}
        >
          Withdraw
        </div>
      </div>
      {open && (
        <div className="flex items-center h-screen z-[0000] justify-center w-full fixed top-0 left-0 bg-[#000000b7]">
          <div
            className={`800px:w-[50%] w-[95%] bg-white shadow ${
              paymentMethods ? "h-[80vh] overflow-y-scroll" : "h-[unset]"
            } mt-[70px] rounded min-h-[40vh] p-3`}
          >
            <div className="w-full flex justify-end">
              <RxCross1
                size={25}
                onClick={() => setOpen(false) || setPaymentMethods(false)}
                className="cursor-pointer"
              />
            </div>
            {paymentMethods ? (
              <div className="">
                <h3 className="text-[22px] font-Poppins text-center font-[600]">
                  Add Withdraw Methods:
                </h3>
                <form onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="">
                      Bank Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankInfo.bankName}
                      onChange={(e) =>
                        setBankInfo({ ...bankInfo, bankName: e.target.value })
                      }
                      required
                      placeholder="Enter your bank name!"
                      className={`${styles.input} mt-2`}
                    />
                  </div>
                  <div>
                    <label htmlFor="">
                      Bank Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankInfo.bankCountry}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankCountry: e.target.value,
                        })
                      }
                      required
                      placeholder="Enter your bank country name!"
                      className={`${styles.input} mt-2`}
                    />
                  </div>
                  <div>
                    <label htmlFor="">
                      Bank Swift Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankInfo.bankSwiftCode}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankSwiftCode: e.target.value,
                        })
                      }
                      required
                      placeholder="Enter your bank Swift code!"
                      className={`${styles.input} mt-2`}
                    />
                  </div>
                  <div className="pt-2">
                    <label htmlFor="">
                      Bank Account Number{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={bankInfo.bankAccountNumber}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankAccountNumber: e.target.value,
                        })
                      }
                      required
                      placeholder="Enter your bank account number!"
                      className={`${styles.input} mt-2`}
                    />
                  </div>
                  <div className="pt-2">
                    <label htmlFor="">
                      Bank Holder Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankInfo.bankHolderName}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankHolderName: e.target.value,
                        })
                      }
                      required
                      placeholder="Enter your bank holder name!"
                      className={`${styles.input} mt-2`}
                    />
                  </div>
                  <div className="pt-2">
                    <label htmlFor="">
                      Bank Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankInfo.bankAddress}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankAddress: e.target.value,
                        })
                      }
                      required
                      placeholder="Enter your bank address!"
                      className={`${styles.input} mt-2`}
                    />
                  </div>

                  <button
                    type="submit"
                    className={`${styles.button} text-white m-3`}
                  >
                    Add
                  </button>
                </form>
              </div>
            ) : (
              <>
                <h3 className="text-[22px] font-Poppins">
                  Available Withdraw Methods:
                </h3>
                {seller && seller?.withdrawMethod ? (
                  <div>
                    <div className="800px:flex w-full justify-between">
                      <div className="800px:w-[50%]">
                        <h5>
                          Account Number:{" "}
                          {"*".repeat(
                            seller?.withdrawMethod.bankAccountNumber.length - 3
                          ) +
                            seller?.withdrawMethod.bankAccountNumber.slice(-3)}
                        </h5>
                        <h5>Bank Name: {seller?.withdrawMethod.bankName}</h5>
                      </div>
                      <div className="w-[50%]">
                        <AiOutlineDelete
                          size={25}
                          className="cursor-pointer"
                          onClick={() => deleteHandler()}
                        />
                      </div>
                    </div>
                    <br />
                    <h4> Available Balance: {availableBalance}$</h4>
                    <br />
                    <div className="800px:flex w-full items-center">
                      <input
                        type="number"
                        placeholder="Amount..."
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="w-full 800px:w-[100px] border 800px:mr-3 p-1 rounded"
                      />
                      <div
                        className={`${styles.button} text-white !h-[42px]`}
                        onClick={withdrawHandler}
                      >
                        Withdraw
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="">
                    {" "}
                    <p className="text-[18px] pt-2">
                      No Withdraw Methods available!
                    </p>
                    <div className="w-ful flex items-center">
                      <div
                        className={`${styles.button} text-[#fff] text-[18px] mt-4`}
                        onClick={() => setPaymentMethods(true)}
                      >
                        {" "}
                        Add now
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawMoney;
