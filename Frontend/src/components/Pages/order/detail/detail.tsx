import React, { useState, useEffect } from "react";
import { Table, Button, Col, Row, Modal, message, Form, Card, Statistic } from "antd";
import { DatabaseOutlined, ContainerOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useNavigate, useParams, Link } from "react-router-dom";
import { OrderProductInterface } from "../../../../interfaces/OrderProduct";
import { GetOrderProductsByOrderID } from "../../../../services/https";
import { OrderInterface } from "../../../../interfaces/Order";
import { ProductInterface } from "../../../../interfaces/Product";
import { GetProductsByID, UpdateOrder, GetOrderByID } from "../../../../services/https";

function OrderDetail() {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orderproduct, setOrderProductByOrderID] = useState<OrderProductInterface[]>([]);
  const [product, setProductsByID] = useState<ProductInterface[]>([]);
  const [order, setOrderByID] = useState<OrderInterface[]>([]);
  const [form] = Form.useForm(); // Ant Design form
  const { id } = useParams<{ id: string }>();
  const employeeID = localStorage.getItem("id");
  const [isSubmitting, setIsSubmitting] = useState(false); // Track button state

  const onFinish = async (values: OrderInterface) => {
    values.EmployeeID = Number(employeeID); // Ensure EmployeeID is a valid number
    setIsSubmitting(true); // Disable the button after the first click

    try {
      const res = await UpdateOrder(id, values);
      if (res && res.status === 200) {
        message.open({
          type: "success",
          content: res.data.message || "Order updated successfully",
        });
        setTimeout(() => {
          navigate("/order"); // Navigate to order list
        }, 2000);
      } else {
        message.open({
          type: "error",
          content: res.data?.error || "Error updating the order",
        });
        setIsSubmitting(false); // Re-enable the button in case of error
      }
    } catch (error) {
      message.open({
        type: "error",
        content: "Cannot connect to the server",
      });
      setIsSubmitting(false); // Re-enable the button in case of error
    }
  };

  const getOrderByID = async (id: string) => {
    let res = await GetOrderByID(id);
    if (res.status === 200) {
      form.setFieldsValue({
        StatusOrderID: res.data.StatusOrderID,
        BookingID: res.data.BookingID,
      });
      setOrderByID(res.data);
    } else {
      message.error("ไม่พบข้อมูล");
      setTimeout(() => {
        navigate("/order");
      }, 2000);
    }
  };

  const getProductByID = async (id: string) => {
    let res = await GetProductsByID(id);
    if (res.status === 200) {
      form.setFieldsValue({
        ProductName: res.data.ProductName,
        CategoryID: res.data.CategoryID,
      });
      setProductsByID(res.data);
    } else {
      message.error("ไม่พบข้อมูล");
      setTimeout(() => {
        navigate("/order");
      }, 2000);
    }
  };

  const getOrderProductByOrderID = async (id: string) => {
    let res = await GetOrderProductsByOrderID(id);
    if (res.status === 200) {
      form.setFieldsValue({
        Quantity: res.data.Quantity,
      });
      setOrderProductByOrderID(res.data);
    } else {
      message.error("ไม่พบข้อมูล");
      setTimeout(() => {
        navigate("/order");
      }, 2000);
    }
  };

  useEffect(() => {
    if (id) {
      getOrderProductByOrderID(id);
      getProductByID(id);
      getOrderByID(id);
    }
  }, [id, order.Status_Order?.ID]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsSubmitting(false); // Reset submit state in case of cancel
  };

  const column: ColumnsType<OrderProductInterface> = [
    {
      title: "ลำดับ",
      key: "id",
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "ประเภทสินค้า",
      key: "category_id",
      align: "center",
      render: (record: any) => <>{record.Products?.Category_id || "N/A"}</>,
    },
    {
      title: "ชื่ออาหาร",
      key: "product_id",
      align: "center",
      render: (record: any) => <>{record.Products?.Product_name || "N/A"}</>,
    },
    {
      title: "จำนวน",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
  ];

  return (
    <>
      <Form form={form} onFinish={onFinish}>
        <Row>
          <Col style={{ marginTop: "-20px" }}>
            <h2>รายละเอียดออเดอร์</h2>
          </Col>

        </Row>
        <Row>
          <Col>
            <Card
              style={{
                boxShadow: "rgba(100, 100, 111, 0) 0px 7px 29px 0px",
                borderRadius: '20px',
                width: '150px'
              }}>
              <Statistic
                title="ออเดอร์ที่"
                value={id}
                valueStyle={{ color: "black" }}
                prefix={<ContainerOutlined />}
              />
            </Card>
          </Col>
          <Col>
            <Card
              style={{
                boxShadow: "rgba(100, 100, 111, 0) 0px 7px 29px 0px",
                borderRadius: '20px',
                width: '150px',
                marginLeft: '20px'
              }}>
              <Statistic
                title="หมายเลขโต๊ะ"
                value={order.Booking?.table?.table_name}
                valueStyle={{ color: "black" }}
                prefix={<DatabaseOutlined />}
              />
            </Card>
          </Col>

        </Row>
        <Row>
          <Col span={24} style={{ marginTop: "20px" }}>
            <Table dataSource={orderproduct} columns={column} pagination={{ pageSize: 6 }} />
          </Col>
        </Row>

        <Row justify="space-between">
          <Col>
            <Link to="/order">
              <Button type="primary" style={{ height: '40px', width: '80px' }}>ย้อนกลับ</Button>
            </Link>
          </Col>

          <Col>
            <Button
              type="primary"
              size="large"
              style={{
                backgroundColor: order.Status_Order?.ID === 1 ? 'rgba(255, 255, 255, 0.8)' : '#4CAF50', 
                borderColor: order.Status_Order?.ID === 1 ? 'rgba(204, 204, 204, 0.8)' : '#4CAF50', 
                color: order.Status_Order?.ID === 1 ? 'rgba(0, 0, 0, 0.5)' : '#FFFFFF', 
                opacity: order.Status_Order?.ID === 1 ? 0.5 : 1, 
              }}
              onClick={showModal}
              disabled={order.Status_Order?.ID === 1} // Disable the button if Status_order?.ID is 1
            >
              ยืนยันการเสิร์ฟอาหาร
            </Button>
          </Col>
        </Row>

        <Modal
          title="ยืนยันการเสิร์ฟ"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key="back" size="small" onClick={handleCancel} style={{ height: '40px', width: '80px', marginTop: '5px' }}>
              ยกเลิก
            </Button>,
            <Button
              key="submit"
              type="primary"
              size="small"
              style={{ height: '40px', width: '80px' }}
              onClick={() => form.submit()}  // Submit the form
              disabled={isSubmitting}  // Disable if it's submitting
            >
              ยืนยัน
            </Button>,
          ]}
        >
          <p>ยืนยันการเสิร์ฟอาหารหรือไม่?</p>
        </Modal>
      </Form>
    </>
  );
}

export default OrderDetail;
