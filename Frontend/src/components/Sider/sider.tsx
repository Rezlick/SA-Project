import { useState, useEffect } from "react";
import { Layout, Menu, message, Button } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  DollarOutlined,
  AppstoreOutlined,
  SolutionOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  OrderedListOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { GetEmployeeByID, GetPositions } from "../../services/https";
import { PositionInterface } from "../../interfaces/Position";
import { EmployeeInterface } from "../../interfaces/Employee";

function Sider() {
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
        setPositionName("Unknown Position");
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
      setPositionName("Unknown Position");
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
    messageApi.success("Logout successful");
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
      <Sider collapsed={collapsed} style={{ backgroundColor: '#f5f5dc' }}> {/* Light beige background */}
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
              style={{
                position: "absolute",
                top: 0,
                right: -46,
                zIndex: 1,
              }}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 50,
                marginBottom: 20,
              }}
            >
              <img
                src={profile}
                alt="Profile"
                style={{
                  objectFit: "cover",
                  width: collapsed ? "50px" : "100px",
                  height: collapsed ? "50px" : "100px",
                  borderRadius: "50%",
                  transition: "width 0.3s ease, height 0.3s ease",
                  border: "2px solid #8FBC8F", // Olive green border
                  backgroundColor: "white",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                marginTop: 20,
                marginBottom: 20,
                overflowWrap: "break-word",
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: "large", color: "#001529" }}>{firstName} {lastName}</span> {/* Dark text for readability */}
              <span style={{ fontSize: "default", color: "#001529" }}>({positionName})</span> {/* Dark text for readability */}
              <span>
                <Link to="/profileEdit" style={{ fontSize: "smaller", color: "#001529", textDecorationLine: "underline" }}>แก้ไขโปรไฟล์</Link>
              </span>
            </div>

            <Menu
              style={{ backgroundColor: "transparent" }} // Changed background color to transparent
              defaultSelectedKeys={["member"]}
              mode="inline"
              inlineCollapsed={collapsed}
            >
              <Menu.Item key="member" onClick={() => setCurrentPage("member")}>
                <Link to="/member">
                  <UserOutlined />
                  <span>สมาชิก</span>
                </Link>
              </Menu.Item>

              <Menu.Item key="table" onClick={() => setCurrentPage("table")}>
                <Link to="/">
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
            </Menu>
          </div>

          <Menu style={{ backgroundColor: "transparent" }} mode="inline"> {/* Changed background color to transparent */}
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

export default Sider;
