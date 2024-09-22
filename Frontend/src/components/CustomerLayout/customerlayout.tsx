import React from "react";
import { Layout, Breadcrumb, message } from "antd";
import { Routes, Route, Outlet } from "react-router-dom"; // Import Outlet for nested routes
import Customer from "../Pages/customer/customer"; // Your Customer component

const { Content } = Layout;

const CustomerLayout: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();

    return (
        <>
            {contextHolder}
            <Layout style={{ minHeight: "100vh" }}>
                <Layout>
                    <Content style={{ margin: "0 16px" }}>
                        <Breadcrumb style={{ margin: "16px 0" }} />
                        <div
                            style={{
                                padding: 24,
                                minHeight: "93%",
                                // background: colorBgContainer,
                            }}
                        >
                            <Routes>
                                <Route path="/customer" element={<Customer />} />
                            </Routes>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </>
    );
};

export default CustomerLayout;
