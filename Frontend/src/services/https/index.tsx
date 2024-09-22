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

async function GetGenders() {
  return await axios
    .get(`${apiUrl}/genders`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetPositions() {
  return await axios
    .get(`${apiUrl}/positions`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetRanks() {
  return await axios
    .get(`${apiUrl}/ranks`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetMemberCountForCurrentMonth() {
  return await axios
    .get(`${apiUrl}/memberCountForCurrentMonth`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetMemberCountForMonth(month: string, year: string) {
  return await axios
    .get(`${apiUrl}/memberCountForMonth?month=${month}&year=${year}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetMemberCountForDay(date: string) {
  return await axios
    .get(`${apiUrl}/memberCountForDay?day=${date}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

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

async function CheckCoupons(code: string) {
  return await axios
  .post(`${apiUrl}/api/check-coupon/${code}`, requestOptions)
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
  CheckBooking,
  AddPointsToMember,
  changePassword,
  GetMemberCountForMonth,
  GetMemberCountForDay,
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
};