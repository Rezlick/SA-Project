import React, { useState } from "react";
import { Layout, Card, message } from "antd";
import { Routes, Route } from "react-router-dom";
import Customer from "../Pages/customer/customer";
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
            <Layout style={{ minHeight: "100vh" }}>
                <Layout style={{ backgroundColor: "#FEFFD2", minHeight: "100vh" }}>
                    <Content>
                        <div>
                            <img
                                style={{ zIndex: 0, maxHeight: "100vh", minWidth: "100%" }}
                                src={Background}
                                alt="Background"
                            />
                            <img
                                className="logo"
                                src={logo}
                                alt="Logo"
                                style={{ zIndex: 1, marginTop: "-760px" }}
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
                                marginLeft: '25px',
                                marginTop: '-60px',
                                zIndex: 1,
                                overflowY: 'auto',
                            }}
                        >
                            <div>
                                <Routes>
                                    <Route path="/customer/:id" element={<Customer />} />
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
