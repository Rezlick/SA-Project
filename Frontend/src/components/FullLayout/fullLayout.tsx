import React from "react";
import { Routes, Route } from "react-router-dom";
import "../../App.css";
import { Breadcrumb, Layout, theme, message } from "antd";
import Dashboard from "../Pages/dashboard/dashboard";
import Member from "../Pages/member/member";
import MemberCreate from "../Pages/member/create/createMember";
import MemberEdit from "../Pages/member/edit/editMember";
import Employee from "../Pages/Employee/employee";
import EmployeeCreate from "../Pages/Employee/create/createEmployee";
import EmployeeEdit from "../Pages/Employee/edit/editEmployee";
import ITSider from "../Sider/ITSider";
import ManagerSider from "../Sider/ManagerSider";
import CommonSider from "../Sider/sider";
import ProfileEdit from "../Pages/ProfileEdit/profileEdit";
import Receipt from "../Pages/Receipt/receipt";
import Pay from "../Pages/Receipt/Pay/pay";
import ChangePassword from "../Pages/ProfileEdit/changePassword";
import Table from "../Pages/Booking/booking";
import TableBooking from "../Pages/Booking/Create/createBooking";
import EditBookingTable from "../Pages/Booking/Edit/editBooking";
import TableList from "../Pages/Booking/BookingList/bookingList";
import Order from "../Pages/order/order";
import OrderDetail from "../Pages/order/detail/detail"

import ManageStock from "../Pages/Managestock/Managestock";
import StockBeveragesAndDesserts from "../Pages/Managestock/stock-data/StockBeveragesAndDesserts";
import StockCondimentsAndSauce from "../Pages/Managestock/stock-data/StockCondimentsAndSauce";
import StockMeat from "../Pages/Managestock/stock-data/StockMeat";
import StockNoodlesAndDough from "../Pages/Managestock/stock-data/StockNoodlesAndDough";
import StockSeafood from "../Pages/Managestock/stock-data/StockSeafood";
import StockVegetable from "../Pages/Managestock/stock-data/StockVegetable";
import Supplier from "../Pages/Managestock/Supplier/Suppliper";

import EditStock from "../Pages/Managestock/Category/StockCategory/edit/index"







const {Content} = Layout;

const FullLayout: React.FC = () => {

  const [messageApi, contextHolder] = message.useMessage();

  const positionID = localStorage.getItem("positionID"); 
  let role = "";
  if (positionID === '1') {
    role = "IT"
  } else if (positionID === '2'){
    role = "Manager"
  } else {
    role = "Common"
  }

  const renderSider = () => {
    if (role === "IT") {
      return <ITSider />;
    } else if (role === "Manager") {
      return <ManagerSider />;
    } else {
      return <CommonSider />;
    }
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <>
    {contextHolder}
    <Layout style={{ minHeight: "100vh", maxHeight:"100vh"}}>
      {renderSider()}

      <Layout style={{backgroundColor:"#FEFFD2", minHeight: "100vh", maxHeight:"100vh"}}> 
        <Content style={{ margin: "0 30px" }}>
          <Breadcrumb style={{ margin: "16px 0" }} />
          <div
            style={{
              padding: 24,
              minHeight: "93%",
              maxHeight: "93%",
              background: colorBgContainer,
            }}
          >
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/member" element={<Member />} />
              <Route path="/member/create" element={<MemberCreate />} />
              <Route path="/member/edit/:id" element={<MemberEdit />} />
              <Route path="/employee" element={<Employee />} />
              <Route path="/employee/create" element={<EmployeeCreate />} />
              <Route path="/employee/edit/:id" element={<EmployeeEdit />} />
              <Route path="/profileEdit" element={<ProfileEdit />} />
              <Route path="/changePassword" element={<ChangePassword />} />
              <Route path="/receipt" element={<Receipt />} />
//            <Route path="/receipt/pay" element={<Pay />} />
              <Route path="/booking" element={<Table />} />
              <Route path="/booking/create" element={<TableBooking />} />
              <Route path="/booking/edit/:id" element={<EditBookingTable />} />
              <Route path="/booking/booking_list" element={<TableList />} />
              <Route path="/order" element={<Order />} />
              <Route path="/order/detail/:id" element={<OrderDetail />} />

              <Route path="/ManageStock" element={<ManageStock />} />
              <Route path="/ManageStock/Meat" element={<StockMeat />} />
              <Route path="/ManageStock/Vegetable" element={<StockVegetable />} />
              <Route path="/ManageStock/CondimentsAndSauce" element={<StockCondimentsAndSauce />} />
              <Route path="/ManageStock/Seafood" element={<StockSeafood />} />
              <Route path="/ManageStock/NoodlesAndDough" element={<StockNoodlesAndDough />} />
              <Route path="/ManageStock/BeveragesAndDesserts" element={<StockBeveragesAndDesserts />} />
              <Route path="/ManageStock/Supplier" element={<Supplier />} />

              <Route path="/ManageStock/Meat/EditStock" element={<EditStock />} />
              <Route path="/ManageStock/Vegetable/EditStock" element={<EditStock />} />
              <Route path="/ManageStock/CondimentsAndSauce/EditStock" element={<EditStock />} />
              <Route path="/ManageStock/Seafood/EditStock" element={<EditStock />} />
              <Route path="/ManageStock/NoodlesAndDough/EditStock" element={<EditStock />} />
              <Route path="/ManageStock/BeveragesAndDesserts/EditStock" element={<EditStock />} />
              
            </Routes>
          </div>
        </Content>
      </Layout>

    </Layout>
  </>
  );
};

export default FullLayout;