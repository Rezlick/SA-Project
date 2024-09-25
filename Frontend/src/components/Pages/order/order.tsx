import { useState, useEffect } from "react";
import { Table, Row, Col, Spin, message, Divider, Empty, Button } from "antd";
import { CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { GetOrders } from "../../../services/https";
import type { ColumnsType } from "antd/es/table";
import { OrderInterface } from "../../../interfaces/Order";
import dayjs from "dayjs";

function Order() {
  const [order, setOrders] = useState<OrderInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  // Function to fetch order data
  const fetchOrderData = async () => {
    try {
      const res = await GetOrders();
      if (res.status === 200) {
        setOrders(res.data);
      } else {
        message.error(res.data.error || "Unable to fetch data");
      }
    } catch (error) {
      message.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // First data load
    fetchOrderData();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      if (autoRefresh) {
        fetchOrderData();  // Fetch new data without resetting the entire component
      }
    }, 20000);  // Set your interval time in milliseconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const columns: ColumnsType<OrderInterface> = [
    {
      title: <span style={{ fontSize: '16px' }}>ลำดับออเดอร์</span>, // 16px title font size
      dataIndex: "ID",
      key: "orderid",
      align: "center",
      render: (text) => <span style={{ fontSize: '16px' }}>{text}</span>, // 16px content font size
    },
    {
      title: <span style={{ fontSize: '16px' }}>เวลาที่สั่ง</span>, // 16px title font size
      key: 'date_time',
      render: (record) => {
        const date = record.CreatedAt;
        return <p style={{ fontSize: '16px' }}>{dayjs(date).format("HH:mm : DD MMM YYYY")}</p>; // 16px content font size
      },
    },
    {
      title: <span style={{ fontSize: '16px' }}>หมายเลขโต๊ะ</span>, // 16px title font size
      key: "table_type",
      align: "center",
      render: (record) => <span style={{ fontSize: '16px' }}>{record.Booking?.table?.table_name || "N/A"}</span>, // 16px content font size
    },
    {
      title: <span style={{ fontSize: '16px' }}>สถานะออเดอร์</span>, // 16px title font size
      key: "status_order_name",
      sorter: (a, b) => a.Status_Order?.status_order_name.localeCompare(b.Status_Order?.status_order_name),
      align: "center",
      render: (record) => {
        return (
          <>
            {record.Status_Order?.status_order_name === "เสิร์ฟเรียบร้อย" ? (
              <div>
                <CheckCircleOutlined style={{ color: "green", fontSize: '20px' }} />
                <div style={{ fontSize: '16px' }}>เสิร์ฟเรียบร้อย</div> {/* Adjust text size to 16px */}
              </div>
            ) : (
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: '20px' }} />}
                tip="รอเสิร์ฟ"
              >
                <div style={{ height: 40, fontSize: '16px' }}></div>
              </Spin>
            )}
          </>
        );
      },
    },
    {
      title: <span style={{ fontSize: '16px' }}>พนักงานยืนยัน</span>, // 16px title font size
      key: "firstname",
      align: "center",
      render: (record) => <span style={{ fontSize: '16px' }}>{record.Employee?.FirstName || ""}</span>, // 16px content font size
    },
    {
      title: <span style={{ fontSize: '16px' }}>จัดการ</span>, // 16px title font size
      key: "action",
      align: "center",
      render: (record) => (
        <Link to={`/order/detail/${record.ID}`}>
          <Button style={{ borderRadius: '20px', fontSize: '16px', height: '40px' }} type="primary">ดูรายละเอียด</Button> {/* 16px button font size */}
        </Link>
      ),
    },
  ];

  return (
    <>
      <Row>
        <Col span={12} style={{ marginTop: "-10px", marginBottom: "-15px" }}>
          <h1>รายการออเดอร์</h1>
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={24} style={{ marginTop: "15px" }}>
          {loading ? (
            <Spin tip="กำลังโหลดข้อมูล..." size="large" />
          ) : order.length > 0 ? (
            <Table dataSource={order} columns={columns} pagination={{ pageSize: 6 }} />
          ) : (
            <Empty description="ไม่มีออเดอร์ที่ต้องแสดง" />
          )}
        </Col>
      </Row>
    </>
  );
}

export default Order;
