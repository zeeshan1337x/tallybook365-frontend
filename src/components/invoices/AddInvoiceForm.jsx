import Styles from "./AddInvoiceForm.module.scss";
import React, { useEffect, useState } from "react";
import { configuration } from "../../configurations/configurations";
import useAxios from "../../hooks/useAxios";
import { instance } from "../../utilities/axiosInstance";
import { MdAddCircle, MdDelete } from "react-icons/md";

export default function AddInvoiceForm() {
  const [data, setData] = useState({});
  const [response, error, loading, axiosFetch, message] = useAxios();
  const [responseSelf, errorSelf, loadingSelf, axiosFetchSelf, messageSelf] =
  useAxios();
  const [
    responseClientData,
    errorClientData,
    loadingClientData,
    axiosFetchClientData,
    messageClientData,
  ] = useAxios();
  const [selectedClientIndex, setSelectedClientIndex] = useState();

  const [inputList, setInputList] = useState([
    { particulars: "", quantity: "", day: "", unitPrice: "", totalPrice: "" },
  ]);

  function handleChange(event) {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  }

  const addClientsAsync = (e) => {
    e.preventDefault();

    console.log(data);
    axiosFetch({
      axiosInstance: instance,
      method: "Post",
      url: configuration.invoices,
      requestConfig: data,
    });
    //document.getElementById("addInvoiceForm").reset();
  };
  useEffect(() => {
    //setting items data into the data object
    setData({ ...data, items: inputList });
  }, [inputList]);

  const getClientsData = () => {
    axiosFetchClientData({
      axiosInstance: instance,
      method: "Get",
      url: configuration.clients,
    });
  };
  const getSelf = () => {
    axiosFetchSelf({
      axiosInstance: instance,
      method: "Get",
      url: configuration.self,
    });
  };

  useEffect(() => {
    getClientsData();
    getSelf();
  }, []);

    // handle input change
    const handleInputChange = (e, index) => {
      const { name, value } = e.target;
      const list = [...inputList];
      list[index][name] = value;
      setInputList(list);
    };
  
    // handle click event of the Remove button
    const handleRemoveClick = (index) => {
      const list = [...inputList];
      list.splice(index, 1);
      setInputList(list);
    };
  
    // handle click event of the Add button
    const handleAddClick = () => {
      setInputList([
        ...inputList,
        { particulars: "", quantity: "", day: "", unitPrice: "", totalPrice: "" },
      ]);
    };

  // items...
  const itemsAddInObject = inputList.map((x, i) => {
    return (
      <div className={Styles.itemsContainer} key={i}>
        <input
          name="particulars"
          placeholder="Enter Particulars"
          value={x.particulars}
          onChange={(e) => handleInputChange(e, i)}
        />
        <input
          name="quantity"
          placeholder="Enter Last quantity"
          value={x.quantity}
          onChange={(e) => handleInputChange(e, i)}
        />
        <input
          name="day"
          placeholder="Enter day"
          value={x.day}
          onChange={(e) => handleInputChange(e, i)}
        />
        <input
          name="unitPrice"
          placeholder="Enter unit price"
          value={x.unitPrice}
          onChange={(e) => handleInputChange(e, i)}
        />
        <input
          name="totalPrice"
          placeholder="Enter total price"
          value={x.totalPrice}
          onChange={(e) => handleInputChange(e, i)}
        />
        <div className={Styles.btnBox}>
          {inputList.length !== 1 && (
            <MdDelete
              className={Styles.remove}
              onClick={() => handleRemoveClick(i)}
            />
          )}
          {inputList.length - 1 === i && (
            <MdAddCircle className={Styles.add} onClick={handleAddClick} />
          )}
        </div>
      </div>
    );
  });

  return (
    <div className={Styles.main}>
      <form onSubmit={addClientsAsync} id="addInvoiceForm">
      <input
          type="text"
          placeholder="Enter User id"
          name="user_id"
          onChange={handleChange}
          value={responseSelf ? responseSelf?.data?.user_id : ""}
          readOnly
        />
        <br />
        <label>Client info</label>
       <select
          name="client_id"
          onChange={(e) => {
            setSelectedClientIndex(e.target.value);
            setData({
              ...data,
              user_id: responseSelf?.data?.user_id,
              client_id: responseClientData?.data[e.target.value]?.client_id,
              client_name:
                responseClientData?.data[e.target.value]?.client_name,
              client_address:
                responseClientData?.data[e.target.value]?.client_address,
            });
          }}
          defaultValue=""
          required
        >
          <option value="" disabled>
            Select client
          </option>
          {responseClientData?.data?.map((user, i) => (
            <option key={i} value={i}>
              {user.client_id}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Enter Client's name"
          name="client_name"
          readOnly
          onChange={handleChange}
          value={
            selectedClientIndex
              ? responseClientData?.data[selectedClientIndex]?.client_name
              : ""
          }
        />
        <input
          type="text"
          placeholder="Enter Client's address"
          name="client_address"
          readOnly
          onChange={handleChange}
          value={
            selectedClientIndex
              ? responseClientData?.data[selectedClientIndex]?.client_address
              : ""
          }
        />

        <br />
        <label>Invoice info</label>

        <input
          type="text"
          placeholder="Enter title"
          name="title"
          onChange={handleChange}
        />

        <input
          type="number"
          placeholder="Enter job_no"
          name="job_no"
          onChange={handleChange}
        />
<input
          type="text"
          placeholder="Enter Brand name"
          name="brand"
          onChange={handleChange}
      
        />
        <input
          type="text"
          placeholder="Enter Job type"
          name="job_type"
          onChange={handleChange}
   
        />
        <input
          type="date"
          placeholder="Enter date"
          name="date"
          onChange={handleChange}
        />
<br />
        <label>Add items</label>
        {itemsAddInObject}

        <br />
        <label>Bank Account info</label>
        <input
          type="text"
          placeholder="Enter bank account"
          name="bank_account"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Enter bank name address"
          name="bank_name_address"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Enter swift no"
          name="swift"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Enter routing no"
          name="routing_no"
          onChange={handleChange}
        />
        <br />
        <label>Terms and condition</label>
        <textarea
          name="t_and_c"
          cols="30"
          rows="10"
          onChange={handleChange}
        ></textarea>

        <p>{message}</p>
        <button type="submit">Save</button>
        <br />
        <br />
        <br />
        <br />
      </form>
    </div>
  );
}