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
      title: "ลำดับออเดอร์",
      dataIndex: "ID",
      key: "orderid",
      align: "center",
    },
    {
      title: 'เวลาที่สั่ง',
      key: 'date_time',
      render: (record) => {
        const date = record.CreatedAt;
        return <p>{dayjs(date).format("HH:mm : DD MMM YYYY")}</p>;
      },
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
                indicator={<LoadingOutlined style={{ fontSize: '20px' }} />}
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
      render: (record) => (
        <Link to={`/order/detail/${record.ID}`}>
          <Button type="primary">ดูรายละเอียด</Button>
        </Link>
      ),
    },
  ];

  return (
    <>
      <Row>
        <Col span={12} style={{ marginTop: "-10px", marginBottom: "-15px" }}>
          <h2>รายการออเดอร์</h2>
        </Col>
      </Row>
      <Divider/>
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
