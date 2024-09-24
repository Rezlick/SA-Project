import React, { useEffect, useState } from "react";
import { Table, Col } from 'antd'; 
import { useParams } from "react-router-dom";

function CustomerCart() {
    const { id } = useParams(); // Get the customer ID from the URL parameters
    const [cartData, setCartData] = useState([]);

    useEffect(() => {
        const storedCartData = JSON.parse(localStorage.getItem('cartData')) || []; // Fetch data from localStorage
        setCartData(storedCartData); // Set state with the cart data
    }, []);

    // Prepare the data source for the table
    const dataSource = cartData.map((item, index) => ({
        key: index, // Use index as key
        ID: index + 1, // Sequential ID starting from 1
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity
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
    ];

    return (
        <div>
            <h1>ตะกร้าสินค้าสำหรับลูกค้า {id}</h1>
            <Col xs={24} style={{  overflowY: 'auto' }}> {/* Adjust the height and enable vertical overflow */}
                <Table 
                    dataSource={dataSource} 
                    columns={columns} 
                    pagination={false} 
                    scroll={{ y: 300 }} // Optional: set fixed height for the table body
                />
            </Col>
        </div>
    );
}

export default CustomerCart;
