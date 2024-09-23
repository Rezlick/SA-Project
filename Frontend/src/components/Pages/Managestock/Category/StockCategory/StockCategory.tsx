import { useState, useEffect } from "react";
import {Layout,Input,Button,Form,Select,DatePicker,Table,Row,Col,} from "antd";
import {SearchOutlined,EditOutlined,PlusSquareOutlined,} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { StockInterface } from "../../../../../interfaces/Stock.ts";
import useSupplierName from "../../../../../Hook/useSupplierName.tsx";
import {AddStock,} from "../../../../../services/https/index.tsx";

const { Header, Content } = Layout;
const { Option } = Select;

export default function StockCategory({categoryTitle,initialData,categoryID,path,}) {
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false); // แสดง/ไม่แสดง ของ form หลัก
  const [form] = Form.useForm();
  //const [data] = useState(initialData); //รับข้อมูลมา
  const [query, setQuery] = useState(""); // การค้นหา
  const [filteredData, setFilteredData] = useState(initialData); // ข้อมูลที่ฟิวเตอร์แล้ว
  const [editingRecord, setEditingRecord] = useState(null); // ข้อมูลที่กำลังแก้ไข
  const suppliersNameData = useSupplierName(); 
  const [suppliers, setSuppliers] = useState<{ id: number; name: string }[]>([]); // รายชื่อผู้จัดจำหน่าย
  const [products, setProducts] = useState([]); // รายชื่อสินค้า
  const [formDisabled, setFormDisabled] = useState(false); //
  const [open, setOpen] = useState(false); //  42 and 43 เป็นลูกเล่นเปิดปิด form
  const [searchTimeout, setSearchTimeout] = useState(null); //ดีเลเวลานะจ๊ะ

  useEffect(() => {
    setFilteredData(initialData);
  }, [initialData]);

  useEffect(() => {
    if (suppliersNameData && suppliersNameData.length > 0) {
       setSuppliers(
         suppliersNameData.map((supplier: { SupplierID: number; supplier_name: string }) => ({
           id: supplier.SupplierID,
           name: supplier.supplier_name,
         }))
       );
    }
}, [suppliersNameData]);


  useEffect(() => {
    if (filteredData.length > 0) {
      // กรองสินค้าที่ไม่ซ้ำจากข้อมูลที่กรองแล้ว
      const uniqueCodes = new Set();
      const mappedProducts = filteredData.reduce((acc, item) => {
        if (!uniqueCodes.has(item.code)) {
          uniqueCodes.add(item.code);
          acc.push({ code: item.code, name: item.name });
        }
        return acc;
      }, []);
      setProducts(mappedProducts);
    }
  }, [filteredData]);


  


   const handleQueryChange = (value) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      const lowercasedQuery = value.toLowerCase();
      const filtered = initialData.filter((item) =>
        item.name.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredData(filtered);
    }, 500); // หน่วงเวลา 500ms

    setSearchTimeout(timeout);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    handleQueryChange(value);
  };

  const handleBackClick = () => {
    navigate("/ManageStock");
  };

  const handleProductSelect = (value : any) => {
    const selectedProduct = products.find((product) => product.code === value); // ฟังก์ชันจัดการเมื่อเลือกสินค้า
    if (selectedProduct) {
      form.setFieldsValue({
        code: selectedProduct.code,
        name: selectedProduct.name,
      });
      setFormDisabled(true);
    }
  };

  const handleEditClick = (record : any) => {
    console.log("record",record);
    setEditingRecord(record);

    navigate(`/ManageStock/${path}/EditStock`,{state : {record,path,suppliers,categoryID,}})
  };

  const handleAdd = () => {
    form.resetFields();
    setOpen(false);
    setIsAdding(true);
  };

  const handleFinish = async (values : any) => {
    const newItem: StockInterface = {
      category_id: categoryID,
      product_code_id: values.code,
      product_name: values.name,
      quantity: Number(values.quantity),
      price: Number(values.price),
      date_in: values.importDate.format("YYYY-MM-DDTHH:mm:ssZ"),
      expiration_date: values.expiryDate.format("YYYY-MM-DDTHH:mm:ssZ"),
      supplier_id: Number(values.supplier), // แปลงเป็น number
      employee_id: 1, //ยังไม่ได้เชื่อมกับเพื่อน
    };

    try {
      if (newItem) {
        const result = await AddStock(newItem);
        if (result) {
          setIsAdding(false);
          window.location.reload()
        }
      }
    } catch (error) {
      console.error("Error in submitting stock:", error);
    }
  };

  const openForm = () => {
    setIsAdding(true);
    setFormDisabled(false);
    form.resetFields();
    setOpen(true);
    form.setFieldsValue({ code: "เพิ่มสินค้าใหม่" });
  };

  const columns = [
  { title: "รหัสรายการ", dataIndex: "key", key: "key" }, 
  { title: "รหัสสินค้า", dataIndex: "code", key: "code" },
  { title: "ชื่อสินค้า", dataIndex: "name", key: "name" },
  { title: "จำนวน", dataIndex: "quantity", key: "quantity" },
  { title: "ราคา (บาท)", dataIndex: "price", key: "price" },
  { title: "ผู้จัดจำหน่าย", dataIndex: "supplier", key: "supplier" },
  { title: "วันที่นำเข้า", dataIndex: "importDate", key: "importDate" },
  { title: "วันหมดอายุ", dataIndex: "expiryDate", key: "expiryDate" },
    {
      title: "แก้ไขข้อมูล",
      key: "activity",
      render: (record) => (
        <Button onClick={() => handleEditClick(record)}>
          <EditOutlined />
        </Button>
      ),
    },
  ];

  return (
    <Layout>
      <Header
        className="header"
        style={{
          backgroundColor: "#fff",
          padding: "0 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "24px" }}>
          สินค้าประเภท {categoryTitle}
        </h1>
        <Input
          placeholder="ค้นหาชื่อสินค้า"
          style={{ width: 300 }}
          value={query}
          onChange={handleInputChange}
          suffix={<SearchOutlined />}
        />
      </Header>
      <Content style={{ padding: "20px", background:"#fff"}}>
        {!isAdding ? (
          <>
            <Row style={{ marginBottom: "20px" }} justify="space-between">
              <Col>
                <Button type="primary" onClick={handleBackClick}>
                  ย้อนกลับ
                </Button>
              </Col>
              <Col>
                <Button type="primary" onClick={handleAdd}>
                  เพิ่ม
                </Button>
              </Col>
            </Row>
            <Table 
            dataSource={filteredData}
             columns={columns} 
             pagination={{
              pageSize: 5,
              
            }}
             />
          </>
        ) : (
          <Row gutter={16}>
            <Col span={18}>
            <Table 
            dataSource={filteredData}
             columns={columns} 
             pagination={{
              pageSize: 5,
             
            }}
             />
            </Col>
            <Col
              span={6}
              style={{
                background: "#ffffff",
                borderRadius: "8px",
                padding: "20px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                style={{ maxWidth: 600, margin: "auto" }}
              >
                <Form.Item
                  label="รหัสสินค้า"
                  name="code"
                  rules={[{ required: true, message: "กรุณากรอกรหัสสินค้า" }]}
                >
                  <Row>
                    <Col span={ 12 }>
                      <Select
                        placeholder="เลือกรหัสสินค้า"
                        onChange={handleProductSelect}
                        disabled={open}
                        value={form.getFieldValue("code")}
                      >
                        {products.map((product) => (
                          <Option key={product.code} value={product.code}>
                            {product.code} - {product.name}
                          </Option>
                        ))}
                      </Select>
                    </Col>
                      <Col span={12}>
                        <Button
                          onClick={openForm}
                          type="primary"
                          style={{ marginLeft: 10 }}
                        >
                          <PlusSquareOutlined />
                          ไม่มีรหัส ? คลิกเพื่อเพิ่ม
                        </Button>
                      </Col>
                    
                  </Row>
                </Form.Item>

                <Form.Item
                  label="ชื่อสินค้า"
                  name="name"
                  rules={[{ required: true, message: "กรุณากรอกชื่อสินค้า" }]}
                >
                  <Input placeholder="กรอกชื่อสินค้า" disabled={formDisabled} />
                </Form.Item>

                <Form.Item
                  label="จำนวน"
                  name="quantity"
                  rules={[{ required: true, message: "กรุณากรอกจำนวน" }]}
                >
                  <Input type="number" placeholder="กรอกจำนวน" />
                </Form.Item>

                <Form.Item
                  label="ราคา (บาท)"
                  name="price"
                  rules={[{ required: true, message: "กรุณากรอกราคา" }]}
                >
                  <Input type="number" placeholder="กรอกราคา (บาท)" />
                </Form.Item>

                <Form.Item
                  label="ผู้จัดจำหน่าย"
                  name="supplier"
                  rules={[
                    { required: true, message: "กรุณาเลือกผู้จัดจำหน่าย" },
                  ]}
                >
                  <Select placeholder="เลือกผู้จัดจำหน่าย">
                    {suppliers.map((supplier) => (
                      <Option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="วันที่นำเข้า"
                  name="importDate"
                  rules={[
                    { required: true, message: "กรุณาเลือกวันที่นำเข้า" },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    showTime={{ format: "HH:mm" }}
                    format="M/D/YYYY HH:mm"
                  />
                </Form.Item>

                <Form.Item
                  label="วันหมดอายุ"
                  name="expiryDate"
                  rules={[{ required: true, message: "กรุณาเลือกวันหมดอายุ" }]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    showTime={{ format: "HH:mm" }}
                    format="M/D/YYYY HH:mm"
                  />
                </Form.Item>
                
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    {editingRecord ? "บันทึก" : "เพิ่ม"}
                  </Button>
                  <Button
                    type="default"
                    onClick={() => setIsAdding(false)}
                    style={{ marginLeft: "10px" }}
                  >
                    ยกเลิก
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        )}
      </Content>
    </Layout>
  );
}