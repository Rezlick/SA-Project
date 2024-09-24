import React, { useEffect, useState } from "react";
import { Table, Col, Row, Button } from 'antd';
import { useParams } from "react-router-dom";
import { DeleteOutlined } from '@ant-design/icons';

function CustomerCart() {
    const { id } = useParams(); // Get the customer ID from the URL parameters
    const [cartData, setCartData] = useState([]);

    useEffect(() => {
        const storedCartData = JSON.parse(localStorage.getItem('cartData')) || []; // Fetch data from localStorage
        setCartData(storedCartData); // Set state with the cart data
    }, []);

    // Function to handle delete action
    const handleDelete = (index) => {
        const updatedCartData = cartData.filter((_, i) => i !== index); // Remove the item at the given index
        setCartData(updatedCartData); // Update state
        localStorage.setItem('cartData', JSON.stringify(updatedCartData)); // Update localStorage
    };

    // Prepare the data source for the table
    const dataSource = cartData.map((item, index) => ({
        key: index, // Use index as key
        ID: index + 1, // Sequential ID starting from 1
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        index: index, // Keep the index for the delete button
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
                    className="table-list-delete-button"
                    onClick={() => handleDelete(record.index)}
                >
                </Button>
            ),
        },
    ];

    return (
        <div>
            <Row>
                <h1>ตะกร้าสินค้าสำหรับลูกค้า {id}</h1>
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
                    <Button type="primary" onClick={() => alert('Order Confirmed!')}>
                        ยืนยันการสั่งอาหาร
                    </Button>
                </Row>
            )}
        </div>
    );
}

export default CustomerCart;
