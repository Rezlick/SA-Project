import React, { useEffect, useState } from "react";
import { Table, Col, Row, Button, message, Modal } from 'antd';
import { useParams, useNavigate } from "react-router-dom";
import { DeleteOutlined } from '@ant-design/icons';
import { OrderInterface } from "../../../../interfaces/Order";
import { CreateOrder, CreateOrderProducts } from "../../../../services/https";

function CustomerCart() {
    const { id } = useParams<{ id: string }>();
    const [cartData, setCartData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedCartData = JSON.parse(localStorage.getItem('cartData')) || []; // Fetch data from localStorage
        setCartData(storedCartData); // Set state with the cart data
    }, [id]);

    // Function to handle delete action
    const handleDelete = (index) => {
        const updatedCartData = cartData.filter((_, i) => i !== index); // Remove the item at the given index
        setCartData(updatedCartData); // Update state
        localStorage.setItem('cartData', JSON.stringify(updatedCartData)); // Update localStorage
    };

    const onFinish = async (id: string) => {
        Modal.confirm({
            title: "Confirm Order",
            content: "Are you sure you want to confirm this order?",
            centered: true,
            onOk: async () => {
                if (!id || isNaN(Number(id))) {
                    message.error("Invalid or missing booking ID.");
                    return;
                }
    
                const orderPayload: OrderInterface = {
                    BookingID: id,
                };
    
                try {
                    // Create Order
                    const orderRes = await CreateOrder(orderPayload.BookingID);
                    console.log("CreateOrder Response:", orderRes);  // Log the order creation response
                    const orderId = orderRes?.order_id;  // Make sure this matches the response
                    if (!orderId) throw new Error("Order ID is missing from the response");
    
                    // Prepare the payload for order products
                    const orderProductPayload = cartData.map((item) => ({
                        OrderID: orderId,
                        Product_Code_ID: item.productId,
                        Quantity: item.quantity,
                    }));
                    console.log("Order Product Payload:", orderProductPayload);  // Log the payload
    
                    // Send order products request
                    await Promise.all(orderProductPayload.map(CreateOrderProducts));
    
                    // Show success message
                    message.success("Order and products confirmed!");
    
                    // Clear cart data after successful order creation
                    setCartData([]);  // Clear table data
                    localStorage.removeItem('cartData');  // Clear localStorage data
    
                    // Optionally add some delay before redirecting or showing additional messages
                    setTimeout(() => {
                        message.success("Clearing cart data and navigating...");
                        // Redirect to the customer page or another location
                        navigate(`/customer/status/${id}`);
                    }, 1500); // Delay 1.5 seconds before navigating
                } catch (error) {
                    console.error("Error creating order or order products:", error);  // Log the error
                    message.error("Order or order-product creation failed! Please try again.");
                }
            },
            onCancel: () => {
                message.info("Order was cancelled.");
            },
        });
    };
    
    

    // Prepare the data source for the table
    const dataSource = cartData.map((item, index) => ({
        key: index,
        ID: index + 1,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        index: index,
    }));

    // Define columns for the Table
    const columns = [
        {
            title: 'ลำดับ',
            dataIndex: 'ID',
            key: 'ID',
        },
        {
            title: 'ชื่อสินค้า',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'จำนวน',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'จัดการ',
            key: 'action',
            width: 75,
            render: (_, record) => (
                <Button
                    type="danger"
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => handleDelete(record.index)}
                />
            ),
        },
    ];

    return (
        <div>
            <Row>
                <h1>ตะกร้าสินค้าสำหรับลูกค้า {id}</h1> {/* Using id instead of undefined bookingId */}
            </Row>
            <Col xs={24} style={{ overflowY: 'auto' }}> {/* Adjust the height and enable vertical overflow */}
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                    scroll={{ y: 350 }} // Optional: set fixed height for the table body
                />
            </Col>

            {cartData.length > 0 && (
                <Row justify="center" style={{ marginTop: '20px' }}>
                    <Button
                        type="primary"
                        onClick={async () => {
                            await onFinish(id);  // Pass the id directly
                        }}
                    >
                        ยืนยันการสั่งอาหาร
                    </Button>
                </Row>
            )}
        </div>
    );
}

export default CustomerCart;
