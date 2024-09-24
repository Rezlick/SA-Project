import React from "react";
import { Layout, Card, message } from "antd";
import { Routes, Route } from "react-router-dom";
import Customer from "../Pages/customer/customer";
import CustomerCart from "../Pages/customer/CartCustomer/cartCustomer";
import CustomerSider from "../Sider/CustomerSider"; // Import CustomerSider ที่ถูกต้อง
import logo from "../../assets/logo.png";
import Background from "../../assets/background_customer.webp";
import "../../App.css";

const { Content } = Layout;

const CustomerLayout: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();

    return (
        <>
            {contextHolder}
            <Layout style={{ maxHeight: "100%", maxWidth:'100vh' }}>
                <Layout style={{ backgroundColor: "#FEFFD2", maxHeight: "100%", maxWidth:'95vh'  }}>
                    <Content>
                        <div style={{ position: "relative" }}>
                            <img
                                style={{ zIndex: 1, maxHeight: "100vh", width: "590px", marginLeft:'-10px' }}
                                src={Background}
                                alt="Background"
                            />
                            <img
                                className="logo"
                                src={logo}
                                alt="Logo"
                                style={{
                                    zIndex: 2, // เพิ่มค่า z-index ให้มากกว่า Card
                                    position: "absolute",
                                    top: "20px", // ปรับตำแหน่งจากด้านบน
                                    width: '100px',
                                    height: '100px'
                                }}
                            />
                        </div>
                        <Card
                            style={{
                                border: '2px solid rgba(255, 255, 255, 0.2)',
                                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                backdropFilter: 'blur(12px)',
                                width: '90%',
                                height: '85vh',
                                overflow: 'auto',
                                display: 'flex',
                                marginLeft: '4vh',
                                marginTop: '-93vh',
                                zIndex: 1, // z-index น้อยกว่า logo
                                overflowY: 'scroll',
                            }}
                        >
                            <div>
                                <Routes>
                                    <Route path="/customer/:id" element={<Customer />} />
                                    <Route path="/customer/cart/:id" element={<CustomerCart />} />
                                </Routes>
                            </div>
                        </Card>
                    </Content>
                    <CustomerSider />
                </Layout>
            </Layout>
        </>
    );
};

export default CustomerLayout;
