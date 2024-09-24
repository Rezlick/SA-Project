import { ChangePasswordInterface } from "../../interfaces/ChangePassword";
import { EmployeeInterface } from "../../interfaces/Employee";
import { LoginInterface } from "../../interfaces/Login";
import { MemberInterface } from "../../interfaces/Member";
import { TableInterface } from "../../interfaces/Table";
import { BookingSoupInterface } from "../../interfaces/BookingSoup";
import { BookingInterface } from "../../interfaces/Booking";
import { OrderInterface } from "../../interfaces/Order";
import { ReceiptInterface } from "../../interfaces/Receipt";

import axios from "axios";
import { StockInterface } from "../../interfaces/Stock";

const apiUrl = "http://localhost:8000";
const Authorization = localStorage.getItem("token");
const Bearer = localStorage.getItem("token_type");

const requestOptions = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `${Bearer} ${Authorization}`,
  },
};

async function SignIn(data: LoginInterface) {
  return await axios
    .post(`${apiUrl}/signIn`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateEmployee(data: EmployeeInterface) {
  return await axios
    .post(`${apiUrl}/employee`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetEmployees() {
  return await axios
    .get(`${apiUrl}/employees`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetEmployeeByID(id: string) {
  return await axios
    .get(`${apiUrl}/employee/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateEmployee(id: string | undefined, data: EmployeeInterface) {
  return await axios
    .patch(`${apiUrl}/employee/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteEmployeeByID(id: string | undefined) {
  return await axios
    .delete(`${apiUrl}/employee/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CheckEmail(email: string) {
  return await axios
  .post(`${apiUrl}/checkEmail/${email}`, requestOptions)
  .then((res) => res)
  .catch((e) => e.response);
}
async function GetGenders() {
  return await axios
    .get(`${apiUrl}/genders`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// Member functions

async function GetPositions() {
  return await axios
    .get(`${apiUrl}/positions`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateMember(data: MemberInterface) {
  return await axios
    .post(`${apiUrl}/member`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetMembers() {
  return await axios
    .get(`${apiUrl}/members`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CheckMembers(PhoneNumber: string) {
  return await axios
  .post(`${apiUrl}/api/check-member/${PhoneNumber}`, requestOptions)
  .then((res) => res)
  .catch((e) => e.response);
}

async function CheckPhone(phoneNumber: string) {
  return await axios
  .post(`${apiUrl}/checkPhone/${phoneNumber}`, requestOptions)
  .then((res) => res)
  .catch((e) => e.response);
}

async function GetMemberByID(id: string | undefined) {
  return await axios
  .get(`${apiUrl}/member/${id}`, requestOptions)
  .then((res) => res)
  .catch((e) => e.response);
}

async function UpdateMember(id: string | undefined, data: MemberInterface) {
  return await axios
  .patch(`${apiUrl}/member/${id}`, data, requestOptions)
  .then((res) => res)
  .catch((e) => e.response);
}

async function DeleteMemberByID(id: string | undefined) {
  return await axios
  .delete(`${apiUrl}/member/${id}`, requestOptions)
  .then((res) => res)
  .catch((e) => e.response);
}

async function GetMemberCountByReceiptToday() {
  return await axios
    .get(`${apiUrl}/memberCountByReceiptToday`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
  
async function GetMemberCountForToday() {
    return await axios
      .get(`${apiUrl}/memberCountForToday`, requestOptions)
      .then((res) => res)
      .catch((e) => e.response);
}

async function GetNetIncomeByMemberToday() {
  return await axios
    .get(`${apiUrl}/netIncomeByMemberToday`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
  
async function GetRanks() {
    return await axios
    .get(`${apiUrl}/ranks`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// Dashboard functions
  
async function GetMemberCountForCurrentMonth() {
  return await axios
    .get(`${apiUrl}/memberCountForCurrentMonth`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetCashIncomeForCurrentMonth() {
  return await axios
    .get(`${apiUrl}/cashIncomeForCurrentMonth`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetTranferIncomeForCurrentMonth() {
  return await axios
    .get(`${apiUrl}/tranferIncomeForCurrentMonth`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetDashboardDataForMonth(month: string, year: string) {
  return await axios
    .get(`${apiUrl}/dashboardDataForMonth?month=${month}&year=${year}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetDashboardDataForDay(date: string) {
  return await axios
    .get(`${apiUrl}/dashboardDataForDay?day=${date}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}



async function GetNetIncomeForCurrentMonth() {
  return await axios
    .get(`${apiUrl}/getNetIncomeForCurrentMonth`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// Receipt

async function GetReceipts() {
  return await axios
  .get(`${apiUrl}/receipt`, requestOptions)
  .then((res) => res)
  .catch((e) => e.response);
}

async function CreateReceipt(data: ReceiptInterface) {
  return await axios
    .post(`${apiUrl}/receipt`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteBookingAfterPay(id: string | undefined) {
  return await axios
    .delete(`${apiUrl}/receipt/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// Coupon

async function CheckCoupons(code: string) {
  return await axios
  .post(`${apiUrl}/api/check-coupon/${code}`, requestOptions)
  .then((res) => res)
  .catch((e) => e.response);
}

// TypePayment

async function GetTypePayment() {
  return await axios
  .get(`${apiUrl}/typepayment`, requestOptions)
  .then((res) => res)
  .catch((e) => e.response);
}

async function AddPointsToMember(memberID: string, points: number) {
  return await axios
    .patch(
      `${apiUrl}/member/${memberID}/addPoints`,
      { points }, 
      requestOptions
    )
    .then((res) => res)
    .catch((e) => e.response);
}

async function changePassword(employeeID: string, payload: ChangePasswordInterface) {
  return await axios
    .patch(
      `${apiUrl}/employee/${employeeID}/changePassword`, 
      payload, 
      requestOptions
    )
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetBooking() {
  return await axios
  .get(`${apiUrl}/booking`, requestOptions)
  .then((res) => res)
  .catch((e) => e.response);
}


async function CreateBooking(data: BookingInterface) {
  try {
      const response = await axios.post(`${apiUrl}/booking`, data, requestOptions);
      console.log("CreateBooking Response:", response.data);
      return response.data;
  } catch (error) {
      if (axios.isAxiosError(error)) {
          console.error("Axios Error Response:", error.response?.data);
          return error.response?.data; 
      }
      console.error("An unexpected error occurred:", error);
      return { error: "An unexpected error occurred" };
  }
}

async function CheckBooking(name: string) {
  return await axios
  .post(`${apiUrl}/api/check-booking/${name}`, requestOptions)
  .then((res) => res)
  .catch((e) => e.response);
}

async function GetBookingByID(id: string) {
  return await axios
  .get(`${apiUrl}/booking/${id}`, requestOptions)
  .then((res) => res)
  .catch((e) => e.response);
}

async function UpdateBooking(id: string | undefined, data: BookingInterface) {
  return await axios
  .patch(`${apiUrl}/booking/${id}`, data, requestOptions)
  .then((res) => res)
  .catch((e) => e.response);
}

async function DeleteBookingByID(id: string | undefined) {
  return await axios
  .delete(`${apiUrl}/booking/${id}`, requestOptions)
  .then((res) => res)
  .catch((e) => e.response);
}

// Table functions
async function GetTables() {
  return await axios
  .get(`${apiUrl}/tables`, requestOptions)
  .then((res) => res)
  .catch((e) => e.response);
}

async function UpdateTableStatus(id: number | undefined, data: TableInterface) {
  return await axios
  .patch(`${apiUrl}/tables/${id}`, data, requestOptions)
  .then((res) => res)
  .catch((e) => e.response);
}

async function GetTableCapacity() {
  return await axios
  .get(`${apiUrl}/table_capacity`, requestOptions)
  .then((res) => res)
  .catch((e) => e.response);
}

async function GetTableStatus() {
  return await axios
  .get(`${apiUrl}/table_status`, requestOptions)
  .then((res) => res)
  .catch((e) => e.response);
}

// Soup functions
async function GetSoups() {
  return await axios
  .get(`${apiUrl}/soups`, requestOptions)
  .then((res) => res)
  .catch((e) => e.response);
}

// Package functions
async function GetPackages() {
  return await axios
  .get(`${apiUrl}/packages`, requestOptions)
  .then((res) => res)
  .catch((e) => e.response);
}

async function CreateBookingSoup(data: BookingSoupInterface) {
  return await axios
  .post(`${apiUrl}/booking_soups`, data, requestOptions)
  .then((res) => res)
  .catch((e) => e.response);
}

async function GetBookingSoupByID(id: string) {
  return await axios
  .get(`${apiUrl}/booking_soups/${id}`, requestOptions)
  .then((res) => res)
  .catch((e) => e.response);
}

async function UpdateBookingSoups(id: string | undefined, data: BookingSoupInterface[]) {
  return await axios
      .put(`${apiUrl}/booking_soups/${id}`, data, requestOptions)
      .then((res) => res)
      .catch((e) => e.response);
}

async function GetStatusOrders() {
  return await axios
    .get(`${apiUrl}/order`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetOrders() {
  return await axios
    .get(`${apiUrl}/order`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetOrderByID(id: string | undefined) {
  return await axios
    .get(`${apiUrl}/order/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateOrder(id: string | undefined, data: OrderInterface) {
  return await axios
    .patch(
      `${apiUrl}/order/${id}`, 
      data, 
      requestOptions
    )
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetOrderProducts() {
  return await axios
    .get(`${apiUrl}/order/detail`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetOrderProductsByOrderID(id: string | undefined) {
  return await axios
    .get(`${apiUrl}/order/detail/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetProductsByID(id: string | undefined) {
  return await axios
    .get(`${apiUrl}/order/detail/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

//ของเต้
// ฟังก์ชันสำหรับดึงข้อมูล Stock ตาม categoryId
async function GetStock(categoryId: number) {
  return await axios
    .get(`${apiUrl}/Stock/${categoryId}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// ฟังก์ชันสำหรับดึงข้อมูล Supplier
async function GetDataSupplier() {
  return await axios
    .get(`${apiUrl}/Supplier`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// ฟังก์ชันสำหรับเพิ่มข้อมูล Stock
async function AddStock(newStock: StockInterface) {
  return await axios
    .post(`${apiUrl}/AddStock`, newStock, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// ฟังก์ชันสำหรับอัปเดต Stock
async function UpdateStock(updateStock: StockInterface) {
  return await axios
    .put(`${apiUrl}/UpdateStock`, updateStock, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// ฟังก์ชันสำหรับดึงข้อมูลชื่อ Supplier
async function GetSupplierName() {
  return await axios
    .get(`${apiUrl}/SupplierName`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetProductByCodeID(Product_code_id: string) {
  return await axios
    .get(`${apiUrl}/GetProductByCodeID/${Product_code_id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}


export {
  SignIn,
  CreateEmployee,
  GetEmployees,
  GetEmployeeByID,
  UpdateEmployee,
  DeleteEmployeeByID,
  CreateMember,
  GetMembers,
  CheckMembers,
  GetMemberByID,
  UpdateMember,
  DeleteMemberByID,
  GetGenders,
  GetPositions,
  GetRanks,
  GetMemberCountForCurrentMonth,
  GetReceipts,
  CreateReceipt,
  CheckCoupons,
  GetTypePayment,
  CheckBooking,
  AddPointsToMember,
  changePassword,
  GetDashboardDataForMonth,
  GetTables,
  UpdateTableStatus,
  GetTableCapacity,
  GetTableStatus,
  GetSoups,
  GetPackages,
  CreateBookingSoup,
  GetBookingSoupByID,
  UpdateBookingSoups,
  GetBooking,
  CreateBooking,
  GetBookingByID,
  UpdateBooking,
  DeleteBookingByID,
  GetStatusOrders,
  GetOrders,
  GetOrderByID,
  UpdateOrder,
  GetOrderProducts,
  GetOrderProductsByOrderID,
  GetProductsByID,
  CheckPhone,
  CheckEmail,
  GetDataSupplier,
  GetStock,
  AddStock,
  UpdateStock,
  GetSupplierName,
  GetMemberCountForToday,
  GetProductByCodeID,
  GetMemberCountByReceiptToday,
  GetNetIncomeForCurrentMonth,
  GetDashboardDataForDay,
  GetNetIncomeByMemberToday,
  DeleteBookingAfterPay,
  GetCashIncomeForCurrentMonth,
  GetTranferIncomeForCurrentMonth,
};