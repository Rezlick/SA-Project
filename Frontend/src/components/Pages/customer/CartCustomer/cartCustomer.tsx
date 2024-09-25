import { useEffect, useState } from "react";
import { Table, Col, Row, Button, message, Modal, Card, Divider } from 'antd';
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
            title: <span style={{ fontSize: '20px' }}>ยืนยันการสั่งอาหาร ?</span>, // Adjust title font size
            content: <p style={{ fontSize: '18px' }}>คุณต้องการยืนยันการสั่งอาหารใช่หรือไม่ ?</p>, // Adjust content font size
            centered: true,
            okText: "ยืนยัน",
            cancelText: "ยกเลิก",
            okButtonProps: {
                style: { backgroundColor: 'green', borderColor: 'green', fontSize:'18px', height:'40px',alignContent:'center' }, // Make the OK button green
            },
            cancelButtonProps: {
                style: { color: 'red', borderColor: 'red', fontSize:'18px', height:'40px',alignContent:'center' }, // Make the Cancel button text red
            },
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
                    message.success("ยืนยันออเดอร์เสร็จสิ้น!");
    
                    // Clear cart data after successful order creation
                    setCartData([]);  // Clear table data
                    localStorage.removeItem('cartData');  // Clear localStorage data
    
                    // Optionally add some delay before redirecting or showing additional messages
                    setTimeout(() => {
                        message.success("เคลียร์ข้อมูล");
                        // Redirect to the customer page or another location
                        navigate(`/customer/status/${id}`);
                    }, 1500); // Delay 1.5 seconds before navigating
                } catch (error) {
                    console.error("Error creating order or order products:", error);  // Log the error
                    message.error("Order or order-product creation failed! Please try again.");
                }
            },
            onCancel: () => {
                // Cancel action
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

    const columns = [
        {
            title: <span style={{ fontSize: '16px' }}>ลำดับ</span>, // Increased title font size
            dataIndex: 'ID',
            key: 'ID',
            render: text => <span style={{ fontSize: '17px' }}>{text}</span>, // Font size applied here
        },
        {
            title: <span style={{ fontSize: '16px' }}>ชื่อสินค้า</span>, // Increased title font size
            dataIndex: 'productName',
            key: 'productName',
            render: text => <span style={{ fontSize: '17px' }}>{text}</span>, // Font size applied here
        },
        {
            title: <span style={{ fontSize: '16px' }}>จำนวน</span>, // Increased title font size
            dataIndex: 'quantity',
            key: 'quantity',
            render: text => <span style={{ fontSize: '17px' }}>{text}</span>, // Font size applied here
        },
        {
            title: <span style={{ fontSize: '16px' }}>จัดการ</span>, // Increased title font size
            key: 'action',
            width: 75,
            render: (_, record) => (
                <Button
                    type="danger"
                    icon={<DeleteOutlined style={{ color: 'red' }} />}
                    danger
                    onClick={() => handleDelete(record.index)}
                />
            ),
        },
    ];

    return (
        <div>
            <Card style={{ marginTop: '20px', backgroundColor: '#2C2C2C', border: '3px solid #FFD700' }}>
                <Row>
                    <h2 style={{ color: 'white' }}>ตะกร้าสินค้าสำหรับลูกค้า {id}</h2> {/* Using id instead of undefined bookingId */}
                </Row>
                <Divider style={{ borderColor: '#FFD700', color: '#FFD700' }} />
                <Col xs={24} style={{ overflowY: 'auto' }}> {/* Adjust the height and enable vertical overflow */}
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        pagination={false}
                        scroll={{ y: 350 }}
                    />
                </Col>

                {cartData.length > 0 && (
                    <Row justify="center" style={{ marginTop: '20px' }}>
                        <Button
                            type="primary"
                            style={{ width: '160px', height: '50px', fontSize: '17px' }}
                            onClick={async () => {
                                await onFinish(id);
                            }}
                        >
                            ยืนยันการสั่งอาหาร
                        </Button>
                    </Row>
                )}
            </Card>
        </div>
    );
}

export default CustomerCart;
