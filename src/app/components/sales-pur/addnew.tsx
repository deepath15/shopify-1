"use client"
import { BsPersonAdd } from "react-icons/bs";
import { BiCart } from "react-icons/bi";
import { AiOutlineCalendar } from "react-icons/ai";
import React, { useState, useEffect, useRef, ChangeEvent } from 'react'
import { format } from "date-fns"
import { Input } from '@/components/ui/input'
import { IoMdContact } from "react-icons/io";
import DataTable from "../datatable/DataTable";
import Selections from "./selections";
import Link from "next/link";
import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineMinus } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";
import { ColumnDef } from "@tanstack/react-table";
import PopUp from "./extraPopUp";
import { AnimatePresence, motion } from "framer-motion";
import { columnHeader_dataTable } from "../../../../global";
import { useSession } from "next-auth/react";


const NewSales = ({ data, setData, placeholder, isSales, customerData, Items, inputItem, setInputItem, itemList, setItemList, searchPlaceholder }: any) => {

  console.log(itemList);

  const { data: session } = useSession();

  console.log("ses", session);


  const [modify, setModify] = useState<string>("")
  const i_NAME: any = {
    accessorKey: "itemName",
    header: "Item Name"/* ,
    cell: ({ row }: any) => (
      <p>{row.original.name}</p>
    ) */
  };
  const i_QUANTITY: any = {
    accessorKey: "quantity",
    header: "QUANTITY",
    cell: ({ row }: any) => (
      <span className="flex gap-1 items-center">

        <button onClick={() => {
          /*    const update = Items.find((item: any) => item.itemName === row.original.itemName)
             console.log(update.quantity); */
          console.log(row.original.quantity);
          if (row.original.quantity > 1) {
            const updateTax = Math.floor(((row.original.tax?.match(/\d+/g)?.map(Number)[0]) / 100 * row.original.price) * 100) / 100;
            const updateDis = Math.floor((row.original.discountPer / 100 * row.original.price) * 100) / 100;
            const subTotal = Math.floor(((row.original.taxType).toLowerCase() === "Exclusive".toLowerCase() ? row.original.price + updateTax - updateDis : row.original.price - updateDis) * 100) / 100;

            const uplist = {
              ...row.original,
              quantity: --row.original.quantity,
              discount: Math.floor(row.original.quantity * updateDis * 100) / 100,
              taxAmount: Math.floor(row.original.quantity * updateTax * 100) / 100,
              subtotal: Math.floor(row.original.quantity * subTotal * 100) / 100
            }
            const upQuantity = itemList.map((item: any) => item.itemName === row.original.itemName ? uplist : item)
            setItemList(upQuantity)
          }
        }} >
          <AiOutlineMinus />
        </button>
        {row.original.quantity}
        <button onClick={() => {
          const update = Items.find((item: any) => item.itemName === row.original.itemName)
          console.log(row.original.discountPer);


          if (row.original.quantity < update.quantity || !isSales) {
            const updateTax = Math.floor(((row.original.tax?.match(/\d+/g)?.map(Number)[0]) / 100 * row.original.price) * 100) / 100;
            const updateDis = Math.floor((row.original.discountPer / 100 * row.original.price) * 100) / 100;
            console.log(updateDis);

            const subTotal = Math.floor(((row.original.taxType).toLowerCase() === "Exclusive".toLowerCase() ? row.original.price + updateTax - updateDis : row.original.price - updateDis) * 100) / 100;

            const uplist = {
              ...row.original,
              quantity: ++row.original.quantity,

              discount: Math.floor(row.original.quantity * updateDis * 100) / 100,
              taxAmount: Math.floor(row.original.quantity * updateTax * 100) / 100,
              subtotal: Math.floor(row.original.quantity * subTotal * 100) / 100,
            }
            const upQuantity = itemList.map((item: any) => item.itemName === row.original.itemName ? uplist : item)
            setItemList(upQuantity)
          }
        }} >
          <AiOutlinePlus />
        </button>
      </span >
    )
  };
  const i_PRICE: columnHeader_dataTable = {
    accessorKey: "price",
    header: "PRICE",
  };
  const i_DISCOUNT: any = {
    accessorKey: "discount",
    header: "DISOUNT",
    cell: (({ row }: any) => (

      <button onClick={() => {
        setModify(row);
        setIsPopUp(true);
      }}>
        {row.original.discount}
      </button>


    ))
  };
  const i_TAX_AMOUNT: columnHeader_dataTable = {
    accessorKey: "taxAmount",
    header: "TAX Amount",
  };

  const [isPopUp, setIsPopUp] = useState<boolean>(false);
  const i_TAX: any = {
    accessorKey: "tax",
    header: "TAX",
    cell: (({ row }: any) => (
      <button onClick={() => {
        setModify(row);
        setIsPopUp(true);
      }}>
        {row.original.tax}
      </button>
    ))
  };
  const i_SUBTOTAL: columnHeader_dataTable = {
    accessorKey: "subtotal",
    header: "SUB TOTAL",
  };
  const i_REMOVE = {
    accessorKey: "REMOVE",
    cell: ({ row }: any) => (
      <button onClick={() => {
        setItemList(itemList.filter((item: any) => row.original.itemName !== item.itemName))
      }} >
        <MdOutlineDelete />
      </button>
    )
  };

  const sales_Column: ColumnDef<any>[] = [
    i_NAME,
    i_QUANTITY,
    i_PRICE,
    i_DISCOUNT,
    i_TAX,
    i_TAX_AMOUNT,
    i_SUBTOTAL,
    i_REMOVE,
  ];
  const pur_Column: ColumnDef<any>[] = [
    i_NAME,
    i_QUANTITY,
    i_PRICE,
    i_DISCOUNT,
    i_TAX,
    i_TAX_AMOUNT,
    i_SUBTOTAL,
    i_REMOVE,
  ]


  const cusRef = useRef<null | any>(null);
  const dateRef = useRef<null | any>(null);
  const itemRef = useRef<null | any>(null);
  useEffect(() => {
    const handleClose = (e: any) => {
      if (!cusRef.current?.contains(e.target)) {
        setCustomerOpen(false);
      }
      /* if (!itemRef.current?.contains(e.target)) {
        setItemOpen(false);
      } */
    }
    document.addEventListener('click', handleClose)
  }, [])
  const [customerOpen, setCustomerOpen] = useState<boolean>(false)
  const { billDate } = data;
  /*   const [itemOpen, setItemOpen] = useState<boolean>(false);
   */
  const [statusValue, setStatusValue] = useState("")
  useEffect(() => {
    setData({ ...data, billStatus: statusValue });
  }, [statusValue]);
  const [taxType, setTaxType] = useState(data.billTaxType || "");
  useEffect(() => {
    setData({ ...data, billTaxType: taxType });
  }, [taxType]);
  const [disType, setDisType] = useState(data.billDiscountType || "");
  useEffect(() => {
    setData({ ...data, billDiscountType: disType });
  }, [disType]);
  const [payType, setPayType] = useState(data.billPaymentType || "");
  useEffect(() => {
    setData({ ...data, billPaymentType: payType });
  }, [payType]);
  let quantity = 0;
  let newSubTotal = 0;
  useEffect(() => {
    console.log(itemList);

    itemList.map((item: any) => (
      newSubTotal += item?.subtotal,
      quantity += item?.quantity
    ))
    const taxPer = (data?.billTaxType && data?.billTaxType.match) ? data?.billTaxType?.match(/\d+/g)!.map(Number)[0] : 0
    const updateCharge = (taxPer * data?.billCharges) / 100 + Number(data?.billCharges)
    const updateDiscount = (data?.billDiscountType).toLowerCase() === "Fixed".toLowerCase() ? data?.billDiscount : (data?.billDiscountType).toLowerCase() === "Percentage".toLowerCase() ? ((newSubTotal + updateCharge) * data.billDiscount) / 100 : 0
    const newTotal = newSubTotal + updateCharge - updateDiscount;
    console.log(quantity);
    setData((prevData: any) => ({
      ...prevData,
      billQuantity: quantity,
      billSubtotal: newSubTotal,
      billOtherCharge: updateCharge || prevData.billOtherCharge,
      billOverallDis: updateDiscount || prevData.billOtherCharge,
      billTotal: Math.floor(newTotal * 100) / 100,
    }));
  }, [itemList])
  useEffect(() => {
    const updateOnChange = () => {
      const taxPer = (data.billTaxType) ? data.billTaxType?.match(/\d+/g)!.map(Number)[0] : 0
      const newOtherCharge = ((data.billCharges * taxPer) / 100) + Number(data.billCharges);
      const subTotal = Math.floor((newOtherCharge + data.billSubtotal) * 100) / 100;
      const newDiscount = Math.floor(((data.billDiscountType).toLowerCase() === "Fixed".toLowerCase() ? data.billDiscount : (data.billDiscountType).toLowerCase() === "Percentage".toLowerCase() ? ((data.billDiscount * subTotal) / 100) : 0) * 100) / 100;
      console.log(data.billCharges);

      setData({
        ...data,
        billOtherCharge: newOtherCharge,
        billOverallDis: newDiscount,
        billTotal: Math.floor((data.billSubtotal + newOtherCharge - newDiscount) * 100) / 100
      })
    }
    updateOnChange();
  }, [data.billCharges, data.billDiscount, data.billDiscountType, data.billTaxType])


  const handleItemClick = (value: any) => {
    let exist = itemList.find((item: any) => item.itemName === value.itemName)
    console.log(value.quantity);
    console.log(isSales);



    if (value.quantity > 0 || !isSales) {
      /*  setItemList({ ...itemList, value }) */
      console.log("done");

      if (!exist) {
        const newItem = { ...value, quantity: 1 }
        setItemList([...itemList, newItem])
        setInputItem("");
      }
      else {
        const updatedQuantity = exist.quantity + 1
        if ((exist.quantity + 1) <= value.quantity || !isSales) {
          const tax = (exist?.tax?.match(/\d+/g)?.map(Number)[0]) / 100 * exist?.price
          console.log(exist.discount);
          const updatedItem = {
            ...exist,
            quantity: exist.quantity + 1,
            discount: Math.floor(((exist.discountPer / 100 * exist.price) * updatedQuantity) * 100) / 100,
            taxAmount: Math.floor(tax * 100) / 100 * updatedQuantity,
            subtotal: Math.floor(value.subtotal * 100) / 100 * updatedQuantity
          };
          const updatedList = itemList.map((item: any) => item.itemName === value.itemName ? updatedItem : item);
          setItemList(updatedList);
          setInputItem("");
        }
      }
    }

  }
  const taxex = [
    {
      label: "GST 5%",
    },
    {
      label: "VAT 10%",
    }
  ]
  const discountType = [
    {
      label: "Fixed",

    },
    {
      label: "Percentage"
    }
  ]
  const framerTemplate = (variants: any) => {
    return (
      {
        initial: "initial",
        animate: "enter",
        exit: "initial",
        variants
      }
    )
  }
  const popBg = {
    initial: {
      opacity: 0,
      Transition: {
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    },
    enter: {
      opacity: 1,
      Transition: {
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    },
  }
  console.log(Items);

  return (
    <div className='mx-10 mt-10 mb-10'>
      <AnimatePresence mode="wait">
        {isPopUp &&
          <motion.div className="fixed inset-0 z-50 flex justify-center items-center backdrop-filter backdrop-blur-md"
            {...framerTemplate(popBg)}
          >
            <PopUp
              framerTemplate={framerTemplate}
              isPopUp={isPopUp}
              setIsPopUp={setIsPopUp}
              modify={modify}
              itemList={itemList}
              setItemList={setItemList}
              placeholder="Type"
              inputData={taxex}
              icon={false}
              Items={Items}

            />
          </motion.div>
        }
      </AnimatePresence>
      <section>
        <div className="grid grid-cols-12 gap-5 md:gap-10">
          <div ref={cusRef} className="  relative  col-start-1 md:col-span-6 col-span-full">
            <div className="flex bg-primary-gray  py-1 px-2 rounded-lg border items-center ">
              <IoMdContact className="mr-2 h-4 w-4 shrink-0  opacity-50" />
              <Input placeholder={placeholder} value={"" || data.customerName}
                onClick={() => {
                  setCustomerOpen(true);
                }}
                onChange={(e) => {
                  setData({ ...data, customerName: e.target.value });
                }}
              />
              <Link href={"/customers/new"}>
                <BsPersonAdd className="ml-2 h-4 w-4 shrink-0  opacity-100" />
              </Link>
            </div>
            {
              customerOpen && data.customerName && (
                <div className="mt-2 z-10 border rounded-lg bg-white absolute w-full">
                  {
                    customerData.map((item: any, index: any) => {
                      console.log(item);

                      return (
                        <div className="">
                          <p key={index}
                            className="px-3 py-1 cursor-pointer"
                            onClick={() => {
                              setData({ ...data, customerName: item.name, customerId: item.id });
                              setCustomerOpen(false);
                            }}>
                            {item.name}
                          </p>
                        </div>
                      )
                    })
                  }
                  {customerData.filter((item: any) => {
                    return (item.name.toLowerCase().includes(data.customerName.toLowerCase()) || item.id.toString().includes(data.customerName) || item.mobile.toLowerCase().includes(data.customerName.toLowerCase()))
                  }).length === 0 && (
                      <div className="">
                        <p className="px-3 py-1 text-center">
                          Customer Not Found
                        </p>
                      </div>
                    )}
                </div>
              )
            }
          </div>
          <div ref={dateRef} className="md:col-start-7 md:col-span-6 col-span-full">
            <div className="flex  py-1 text-w bg-primary-gray px-2 rounded-lg border items-center cursor-pointer "
            >
              <AiOutlineCalendar className="mr-2 cursor-default  h-4 w-4 shrink-0  opacity-50" />
              <Input placeholder='Select Customer' value={billDate ? format(billDate, "PPP") : ''} readOnly onClick={() => {
              }} className="  cursor-default " />
            </div>
          </div>
        </div>
        <div ref={itemRef} className="mt-5 relative">
          <div className="flex items-center border py-1 bg-primary-gray px-2 rounded-lg">
            <BiCart className="mr-2 h-4 w-4 shrink-0  opacity-50" />
            <Input placeholder={searchPlaceholder}
              value={inputItem}
              onClick={() => {
              }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setInputItem(e.target.value)
              }}
            />
          </div>
          {
            inputItem &&
            <div className="mt-2 z-10 border rounded-lg bg-white absolute w-full">
              {
                Items.map((item: any, index: any) => {
                  console.log(item)
                  return (
                    <div className="">
                      <p key={index}
                        className="px-3 py-1 cursor-pointer"
                        onClick={() => {
                          handleItemClick(item)
                        }}>
                        {item.itemName}  {isSales && `- ${item.quantity}`}
                      </p>
                    </div>
                  )
                })
              }
              {Items?.filter((item: any) => {
                return inputItem === "" ? true : item.itemName.toLowerCase().includes(inputItem.toLowerCase())
              }).length === 0 && (
                  <div className="">
                    <p className="px-3 py-1 text-center">
                      Item Not Found
                    </p>
                  </div>
                )}
            </div>
          }
        </div>
      </section>
      <section>
        <DataTable
          columns={isSales ? sales_Column : pur_Column}
          rows={true}
          paginater={true}
          route="/api/Sales"
          data={itemList} />
      </section>
      <div className={`grid grid-cols-12 grid-rows-4 ${itemList.length > 0 ? "" : "pointer-events-none"} grid-flow-col gap-4`}>
        <div className="col-start-1 items-center grid col-span-full md:col-span-6 h-auto rounded-lg bg-primary-gray">
          <div className="grid md:grid-cols-4 gap-20 px-5  ">
            <p className="col-start-1 col-end-3">Quantity</p>
            <p className="col-span-2 col-start-3 "> {data.billQuantity} </p>
          </div>
        </div>
        <div className={`grid items-center grid-cols-subgrid h-auto grid-rows-subgrid gap-2 col-start-1 px-1 bg-primary-gray col-span-12 md:col-span-6 rounded-lg `}>
          <div className={`col-start-1 pl-2 col-end-7 py-2 md:col-end-4 `}>
            <input id="Charges"
              className={` w-full rounded-md ${data.billTaxType ? "" : "pointer-events-none"}  border px-2 h-10 outline-none`}
              type="text"
              value={data?.billCharges || ""}
              onChange={(e) => {
                setData({ ...data, billCharges: e.target.value })
              }}
              onKeyDown={(e) => {
                if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== ".") {
                  e.preventDefault();
                }
              }}
              placeholder="Other Charges" />
          </div>
          <div className="md:col-start-4 col-start-7 h-auto col-end-13 relative md:col-end-7  bg-primary-gray">
            <Selections inputData={taxex} label={taxType} placeholder="Type" setLabel={setTaxType} icon={false} />
          </div>
        </div>
        <div className="grid  items-center grid-cols-subgrid grid-rows-subgrid gap-2 col-start-1 px-1 bg-primary-gray col-span-12 md:col-span-6 rounded-lg ">
          <div className="col-start-1 pl-2 col-end-7 md:col-end-4">
            <input id="overall discount"
              onChange={(e) => { setData({ ...data, billDiscount: Number(e.target.value) }) }}
              value={data?.billDiscount || ""}
              className={` w-full border rounded-md px-2 h-10 outline-none  ${data.billDiscountType ? "" : "pointer-events-none"} `}
              onKeyDown={(e) => {
                if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key) {
                  e.preventDefault();
                }
              }}
              placeholder="Overall Discount" />
          </div>
          <div className="md:col-start-4 col-start-7 col-end-13 relative md:col-end-7  bg-primary-gray">
            {/*   <Selections inputData={[{ laebl: "Cash" }, { label: "Credit Card" }, { label: "Debit Card" }, { label: "Paytm" }]} 
            label={payType} placeholder="Payment Type" setLabel={setPayType} icon={false} payment={true} /> */}

            <Selections inputData={discountType} label={disType} placeholder="Type" setLabel={setDisType} icon={false} />
          </div>
        </div>
        <div className="grid items-center  grid-rows-subgrid gap-2 col-start-1 px-2 bg-primary-gray col-span-12 md:col-span-6 rounded-lg ">
          <div className="py-2">
            <textarea
              id="Charges"
              className=" w-full rounded-md px-2 h-auto resize-none outline-none"
              placeholder="Note"
              value={data.billNote || ""}
              onChange={(e) => { setData({ ...data, billNote: e.target.value }) }}
            />
          </div>
        </div>
        <div className="md:col-end-13  h-auto md:col-span-4 rounded-lg col-span-full grid items-center bg-primary-gray">
          <div className="grid whitespace-nowrap text-ellipsis overflow-clip grid-cols-4 lg:grid-cols-3 py-2 justify-start gap-4  px-5 ">
            <p className="col-start-1 md:text-end col-end-3">Subtotal</p>
            <p className="col-span-2 col-start-3 md-pr-2 "> $ {data.billSubtotal} </p>
          </div>

        </div>
        <div className="md:col-end-13 md:col-span-4 py-2 h-auto rounded-lg col-span-full grid items-center bg-primary-gray">
          <div className="grid grid-cols-4 h-auto lg:grid-cols-3 justify-start gap-4  px-5  ">
            <p className="col-start-1 md:text-end  col-end-3">Other Charges</p>
            <p className="col-span-2 col-start-3 md-pr-2 "> ${data.billOtherCharge} </p>
          </div>
        </div>
        <div className="md:col-end-13 md:col-span-4 h-auto rounded-lg col-span-full grid items-center bg-primary-gray">
          <div className="grid grid-cols-4 justify-start lg:grid-cols-3 py-2 gap-4 px-5  ">
            <p className="col-start-1 md:text-end  col-end-3">Overall Discount</p>
            <p className="col-span-2 col-start-3 md-pr-2">${data.billOverallDis} </p>
          </div>
        </div>
        <div className="md:col-end-13 md:col-span-4 rounded-lg h-auto col-span-full grid items-center bg-primary-gray">
          <div className="grid grid-cols-4 justify-start lg:grid-cols-3 py-2 gap-4 px-5  ">
            <p className="col-start-1 md:text-end  col-end-3">Grand Total</p>
            <p className="col-span-2 col-start-3 md-pr-2 ">${Math.floor(data.billTotal * 100) / 100} </p>
          </div>
        </div>
      </div>
      {/* <section className="pt-5">
        <h2 className="text-green-500">Previous Payment Information :</h2>
        <DataTable
          columns={sales_Column}
          data={sample}
          rows={true}
          paginater={true}
        />
      </section> */}
      <section className="grid grid-cols-12 md:gap-10 gap-5">
        <div className="mt-5 col-start-1 col-span-6 relative ">
          <Selections inputData={[{ laebl: "Cash" }, { label: "Credit Card" }, { label: "Debit Card" }, { label: "Paytm" }]} label={payType} placeholder="Payment Type" setLabel={setPayType} icon={false} payment={true} />
        </div>
        <div className="col-span-6 gird items-center border bg-primary-gray py-1 px-2 rounded-lg col-start-7 mt-5 ">
          <Input type="text"
            placeholder="Amount"
            className="w-full px-2 appearance-none "
            readOnly
            value={Math.floor(data.billTotal * 100) / 100}
          />
        </div>
      </section >
    </div>
  )
}




export default NewSales


