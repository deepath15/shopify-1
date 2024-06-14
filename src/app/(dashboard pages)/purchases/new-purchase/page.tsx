"use client"
import NewPurchase from "@/app/components/sales-pur/addnew";
import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import useSWR from 'swr'
import { FormState } from "../../../../../global";
import axios from "axios";
import { useSession } from "next-auth/react";
import { ContextData } from "../../../../../contextapi";

const page = () => {

  const { data: session } = useSession();
  const [purchaseData, setPurchaseData] = useState<FormState>({
    customerName: "",
    customerId: 0,
    billDate: new Date,
    billStatus: "Purchased",
    billQuantity: 0,
    billCharges: 0,
    billTaxType: "",
    billDiscount: 0,
    billDiscountType: "",
    billNote: "",
    billSubtotal: 0,
    billOtherCharge: 0,
    billOverallDis: 0,
    billTotal: 0,
    billPaymentType: "",
    billAmount: 0,
    billUserName: "",
  })

  const { purchaseStocks: Items } = useContext(ContextData)

  const [inputItem, setInputItem] = useState<any>("");
  console.log(Items);

  useEffect(() => {
    setProduct(Items ? Items.filter((item: any) => {
      return inputItem === "" ? true : item.itemName.toLowerCase().includes(inputItem.toLowerCase())
    })
      : [])
  }, [inputItem])
  const [product, setProduct] = useState<any>();
  const customerName = [
    {
      value: "Fire10",
      label: "Fire10",
      id: 4,
    },
    {
      value: "deepath",
      label: "Deepath",
      id: 1,
    },
    {
      value: "deepak",
      label: "Deepak",
      id: 2,
    },
    {
      value: "999",
      label: "Dhilip",
      id: 3,
    },
  ]

  const [cus, setCus] = useState<any>("");

  useEffect(() => {
    setCus(customerName.filter((item: any) => {
      return purchaseData.customerName === "" ? true : item.value.toLowerCase().includes(purchaseData.customerName.toLowerCase())
    })
    )

  }, [purchaseData.customerName])

  const [itemList, setItemList] = useState<any>([]);



  const handleClick = async () => {
    console.log(purchaseData);
    console.log(itemList);
    //sending data to purchase backend
    try {
      const { data } = await axios.post("/api/purchase", {
        header: "purchase",
        data: {
          purchase: purchaseData,
          items: itemList,
          status: "Purchased"
        }
      });
      console.log(data);
      alert("saved")
    }
    catch (err) {
      console.log(err);
    }
  }


  return (
    <div className="w-full ">
      <h1 className="px-10 pt-5 ">New Purchase</h1>

      <NewPurchase
        isSales={false}  //false parameter used to behave as purchase
        placeholder="Search supplier" 
        data={purchaseData} 
        setData={setPurchaseData}
        inputItem={inputItem} //input field value
        setInputItem={setInputItem}
        Items={product} //all products
        customerData={cus} //all customer data
        itemList={itemList}  //item cart data
        setItemList={setItemList} 
      />
      <div className="flex justify-center pt-5 pb-10 gap-10">
        <button onClick={handleClick} type="button" className="w-20 py-2 bg-primary-save rounded-md text-white">Save</button>
        <Link href={"../../dashboard"} className="w-20 py-2 text-center bg-primary-close rounded-md text-white">Close</Link>
      </div>
    </div>
  );
};
export default page;