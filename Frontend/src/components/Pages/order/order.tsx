import React, { useState, useEffect } from "react";
import { Table, Row, Col, Spin, Button, message } from "antd";
import { CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { GetStatusOrders, GetOrders } from "../../../services/https";
import type { ColumnsType } from "antd/es/table";
import { OrderInterface } from "../../../interfaces/Order";
import { StatusOrderInterface } from "../../../interfaces/StatusOrder";

function Order() {
  const [statusorder, setStatusOrders] = useState<StatusOrderInterface[]>([]);
  const [order, setOrders] = useState<OrderInterface[]>([]);

  const getOrders = async () => {
    try {
      const res = await GetOrders(); // ดึงข้อมูลจาก API
      if (res.status === 200) {
        setOrders(res.data); // เซ็ตข้อมูลที่ได้จาก API
      } else {
        setOrders([]);
        message.error(res.data.error || "ไม่สามารถดึงข้อมูลได้");
      }
    } catch (error) {
      setOrders([]);
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  const getStatusOrders = async () => {
    try {
      const res = await GetStatusOrders(); // ดึงข้อมูลสถานะจาก API
      if (res.status === 200) {
        console.log("API Response:", res.data); // ตรวจสอบข้อมูลที่ได้จาก API
        setStatusOrders(res.data.StatusName); // เซ็ตข้อมูลจาก API
      } else {
        setStatusOrders([]);
        message.error(res.data.error || "ไม่สามารถดึงข้อมูลได้");
      }
    } catch (error) {
      setStatusOrders([]);
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  useEffect(() => {
    getStatusOrders();
    getOrders();
  }, []);

  const columns: ColumnsType<OrderInterface> = [
    {
      title: "ลำดับออเดอร์",
      dataIndex: "ID",
      key: "orderid",
      align: "center",
    },
    {
      title: "หมายเลขโต๊ะ",
      key: "table_type",
      align: "center",
      render: (record) => <>{record.Booking?.table?.table_name || "N/A"}</>,
    },
    {
      title: "สถานะออเดอร์",
      key: "status_order_name",
      sorter: (a, b) => a.Status_Order?.status_order_name.localeCompare(b.Status_Order?.status_order_name),
      align: "center",
      render: (record) => {
        return (
          <>
            {record.Status_Order?.status_order_name === "เสิร์ฟเรียบร้อย" ? (
              <div>
                <CheckCircleOutlined style={{ color: "green", fontSize: '20px' }} />
                <div>เสิร์ฟเรียบร้อย</div>
              </div>
            ) : (
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: '20px' } } />}
                tip="รอเสิร์ฟ..."
              >
                <div style={{ height: 40 }}></div>
              </Spin>
            )}
          </>
        );
      },
    },
    {
      title: "พนักงานยืนยัน",
      key: "firstname",
      align: "center",
      render: (record) => <>{record.Employee?.FirstName || ""}</>,
    },
    {
      title: "จัดการ",
      key: "action",
      align: "center",
      render: (text, record) => (
        <Link to={`/order/detail/${record.ID}`}>
          <Button type="primary">ดูรายละเอียด</Button>
        </Link>
      ),
    },
  ];

  const navigate = useNavigate();

  return (
    <>
      <Row>
        <Col style={{ marginTop: "-20px" }}>
          <h2>การเสิร์ฟออเดอร์</h2>
        </Col>
      </Row>

      <Table dataSource={order} columns={columns} pagination={{ pageSize: 6 }} />
    </>
  );
}

export default Order;
