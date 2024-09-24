import { useState, useEffect } from "react";
import { Layout, Menu, message, Button } from "antd";
import {
  UserOutlined,
  DashboardOutlined,
  LogoutOutlined,
  DollarOutlined,
  AppstoreOutlined,
  SolutionOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  TeamOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { GetEmployeeByID, GetPositions } from "../../services/https";
import { PositionInterface } from "../../interfaces/Position";
import { EmployeeInterface } from "../../interfaces/Employee";
import "../../App.css"; 

function ITSider() {
  const page = localStorage.getItem("page");
  const { Sider } = Layout;
  const [messageApi, contextHolder] = message.useMessage();
  const [collapsed, setCollapsed] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [positionName, setPositionName] = useState("");
  const [profile, setProfile] = useState("");
  const employeeID = localStorage.getItem("employeeID");

  const getEmployeeById = async () => {
    try {
      const res = await GetEmployeeByID(employeeID || "");
      if (res.status === 200) {
        const employee: EmployeeInterface = res.data;
        setFirstName(employee.FirstName || "");
        setLastName(employee.LastName || "");
        setProfile(employee.Profile || "");
        if (employee.PositionID) {
          getPositionNameById(employee.PositionID);
        } else {
          setPositionName("Unknown Position");
        }
      } else {
        messageApi.error(res.data.error || "ไม่สามารถดึงข้อมูลได้");
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  const getPositionNameById = async (positionID: number) => {
    try {
      const res = await GetPositions();
      if (res.status === 200) {
        const positions: PositionInterface[] = res.data;
        const position = positions.find((pos) => pos.ID === positionID);

        if (position) {
          setPositionName(position.Name || "Unknown Position");
        } else {
          setPositionName("Unknown Position");
        }
      } else {
        messageApi.error(res.data.error || "ไม่สามารถดึงตำแหน่งได้");
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูลตำแหน่ง");
    }
  };

  useEffect(() => {
    getEmployeeById();
  }, []);

  const setCurrentPage = (val: string) => {
    localStorage.setItem("page", val);
  };

  const Logout = () => {
    localStorage.clear();
    messageApi.success("ออกจากระบบสำเร็จ");
    setTimeout(() => {
      location.href = "/login";
    }, 2000);
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      {contextHolder}
      <Sider collapsed={collapsed} className="custom-sider">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <div style={{ position: "relative" }}>
            <Button
              onClick={toggleCollapsed}
              className="toggle-button" 
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>

            <div className="profile-container">
              <img
                src={profile}
                alt="Profile"
                className={`profile-image ${collapsed ? "small" : "large"}`} 
                style={{
                  width: collapsed ? "50px" : "100px",
                  height: collapsed ? "50px" : "100px",
                }}
              />
            </div>

            <div className="profile-info">
              <span style={{ fontSize: "large", color: "black" }}>{firstName} {lastName}</span>
              <span style={{ fontSize: "default", color: "black" }}>({positionName})</span>
              <span>
                <Link to="/profileEdit" style={{ fontSize: "smaller", color: "black", textDecorationLine: "underline" }}>
                  แก้ไขโปรไฟล์
                </Link>
              </span>
            </div>

            <Menu className="menu" defaultSelectedKeys={[page ? page : "dashboard"]} mode="inline" inlineCollapsed={collapsed}>
              <Menu.Item key="dashboard" onClick={() => setCurrentPage("dashboard")}>
                <Link to="/dashboard">
                  <DashboardOutlined />
                  <span>แดชบอร์ด</span>
                </Link>
              </Menu.Item>

              <Menu.Item key="member" onClick={() => setCurrentPage("member")}>
                <Link to="/member">
                  <UserOutlined />
                  <span>สมาชิก</span>
                </Link>
              </Menu.Item>

              <Menu.Item key="table" onClick={() => setCurrentPage("table")}>
                <Link to="/booking">
                  <SolutionOutlined />
                  <span>จองโต๊ะ</span>
                </Link>
              </Menu.Item>

              <Menu.Item key="payment" onClick={() => setCurrentPage("payment")}>
                <Link to="/receipt">
                  <DollarOutlined />
                  <span>ชำระเงิน</span>
                </Link>
              </Menu.Item>

              <Menu.Item key="Order" onClick={() => setCurrentPage("Order")}>
                <Link to="/order">
                  <OrderedListOutlined />
                  <span>รายละเอียดออเดอร์</span>
                </Link>
              </Menu.Item>

              <Menu.Item key="stock" onClick={() => setCurrentPage("stock")}>
                <Link to="/ManageStock">
                  <AppstoreOutlined />
                  <span>จัดการข้อมูลสินค้า</span>
                </Link>
              </Menu.Item>

              <Menu.Item key="employee" onClick={() => setCurrentPage("employee")}>
                <Link to="/employee">
                  <TeamOutlined />
                  <span>พนักงาน</span>
                </Link>
              </Menu.Item>
            </Menu>
          </div>

          <Menu className="menu" mode="inline">
            <Menu.Item key="logout" onClick={Logout}>
              <LogoutOutlined />
              <span>ออกจากระบบ</span>
            </Menu.Item>
          </Menu>
        </div>
      </Sider>
    </>
  );
}

export default ITSider;
