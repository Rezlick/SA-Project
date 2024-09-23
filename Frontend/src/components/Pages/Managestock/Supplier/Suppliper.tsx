import { useState, useCallback } from 'react';
import { Layout, Input, Button, Table, Row, Col } from 'antd';
import { Link } from "react-router-dom";
import './Supplier.css'; // Import the CSS file

import useSupplierData from '../../../../Hook/useSupplierData';

import { debounce } from 'lodash';
//npm install --save-dev @types/lodash


const { Header, Content } = Layout;
const { Search } = Input;

// Create a debounced search function
const debouncedSearch = debounce((value, callback) => {
    callback(value);
}, 300); // Wait 300ms after typing stops

export default function Supplier() {
    
    const SupplierData = useSupplierData();

    const [searchTerm, setSearchTerm] = useState('');
    console.log("SupplierData",SupplierData);
    

    const columns = [
        { title: 'ชื่อผู้จัดจำหน่าย', dataIndex: 'name', key: 'name' },
        { title: 'เบอร์โทร', dataIndex: 'phone', key: 'phone' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'ที่อยู่', dataIndex: 'address', key: 'address' },
    ];

    // Use useCallback to ensure the debounced function is only created once
    const handleSearch = useCallback((value) => {
        debouncedSearch(value, setSearchTerm);
    }, []);

    const filteredSupplierData = SupplierData.filter(supplier =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout>
            <Header className="header">
                <h1 className='header-title'>ข้อมูลผู้จัดจำหน่าย</h1>
                <Search 
                    placeholder="ค้นหาชื่อผู้จัดจำหน่าย" 
                    className="search-bar"
                    onChange={e => handleSearch(e.target.value)}
                />
            </Header>
            <Content style={{ padding: '20px' }}>
                <>
                    <Row className="button-group" justify="space-between">
                        <Col>
                            <Button type="primary">
                                <Link to="/ManageStock">ย้อนกลับ</Link>
                            </Button>
                        </Col>
                    </Row>
                    <Table dataSource={filteredSupplierData} columns={columns} />
                </>
            </Content>
        </Layout>
    );
}

