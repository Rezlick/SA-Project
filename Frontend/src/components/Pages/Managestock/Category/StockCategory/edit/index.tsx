import { useLocation, useNavigate } from "react-router-dom";
import { Input, Button, Form, Select, Divider, notification,Card,Row } from "antd";
import { useState, useEffect } from "react";
import { UpdateStock } from "../../../../../../services/https";
import { StockInterface } from "../../../../../../interfaces/Stock";


const { Option } = Select;

export default function StockEdit() {
  const employeeID = localStorage.getItem("employeeID") || "No ID found";
  const location = useLocation();
  const navigate = useNavigate();
  const { record, path, suppliers, categoryID } = location.state || {};
  const [form] = Form.useForm();

  useEffect(() => {
    if (record) {
      form.setFieldsValue(record);
    }
  }, [record, form]);
  console.log("record", record);
  const handleFinish = async (values) => {
    console.log("values-handleFinish", values);
    const supplierData = suppliers.find(
      (supplier) => supplier.id === values.supplier
    );
    const supplierID = supplierData
      ? supplierData.id
      : suppliers.find((supplier) => supplier.name === record.supplier)?.id;

    console.log("supplierID", supplierID);

    if (!supplierID) {
      notification.error({
        message: "Error",
        description: "Invalid supplier selected.",
      });
      return;
    }

    const updatedItem: StockInterface = {
      stock_id: record.stock,
      category_id: Number(categoryID),
      product_code_id: String(values.code),
      product_name: String(values.name),
      quantity: Number(values.quantity),
      price: Number(values.price),
      supplier_id: Number(supplierID),
      employee_id: Number(employeeID),
    };

    try {
      await UpdateStock(updatedItem);
      console.log("UpdateStock", updatedItem);

      notification.success({
        message: "Success",
        description: "บันทึกข้อมูลสำเร็จ",
      });
      navigate(`/ManageStock/${path}`);
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error.message || "Failed to update product details.",
      });
    }
  };

  const Cancel = () => {
    navigate(`/ManageStock/${path}`);
  };

  return (
    <div>
      <div
        style={{
          background: "linear-gradient(to right, #f1f1f0, #434343)",
          padding: "0 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "120px",
        }}
      >
        <h1>แก้ไขข้อมูล สินค้า</h1>
      </div>
      <Divider />

      <Row justify="center" >
      <Card style={{width: "800px", height:"600px" , boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"  }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          style={{ maxWidth: 600, margin: "auto" }}
        >
          <Form.Item
            label="รหัสรายการ"
            name="stock"
            rules={[{ required: true}]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="รหัสสินค้า"
            name="code"
            rules={[{ required: true }]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="ชื่อสินค้า"
            name="name"
            rules={[{ required: true, message: "กรุณากรอกชื่อสินค้า" }]}
          >
            <Input placeholder="กรอกชื่อสินค้า" />
          </Form.Item>

          <Form.Item
            label="จำนวน"
            name="quantity"
            rules={[{ required: true, message: "กรุณากรอกจำนวน" }]}
          >
            <Input
              type="number"
              min={1}
              placeholder="กรอกจำนวน"
              onChange={(e) => {
                const value = e.target.value;
                if (value < 1) {
                  form.setFieldsValue({ quantity: "" });
                }
              }}
            />
          </Form.Item>

          <Form.Item
            label="ราคา (บาท)"
            name="price"
            rules={[{ required: true, message: "กรุณากรอกราคา" }]}
          >
            <Input
              type="number"
              min={1}
              placeholder="กรอกราคา (บาท)"
              onChange={(e) => {
                const value = e.target.value;
                if (value < 1) {
                  form.setFieldsValue({ price: "" });
                }
              }}
            />
          </Form.Item>

          <Form.Item
            label="ผู้จัดจำหน่าย"
            name="supplier"
            rules={[{ required: true, message: "กรุณาเลือกผู้จัดจำหน่าย" }]}
          >
            <Select placeholder="เลือกผู้จัดจำหน่าย">
              {suppliers.map((supplier) => (
                <Option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              บันทึก
            </Button>
            <Button
              type="default"
              onClick={Cancel}
              style={{ marginLeft: "10px" }}
            >
              ยกเลิก
            </Button>
          </Form.Item>
        </Form>
        </Card>
      </Row>
    </div>
  );
}
