import { useState, useEffect } from "react";
import { Table, Row, Col, Spin, Button, message, Divider, Empty } from "antd";
import { CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { GetOrderByBookingID } from "../../../../services/https";
import type { ColumnsType } from "antd/es/table";
import { useParams } from "react-router-dom";
import { OrderInterface } from "../../../../interfaces/Order";
import dayjs from "dayjs";

function CustomerStatus() {
  const [orders, setOrders] = useState<OrderInterface[]>([]); // แก้ให้เป็น array แทนที่จะเป็น object หรือ null
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();

  const fetchOrderByBooking = async () => {
    if (!id) {
      message.error("Invalid booking ID!");
      return;
    }

    try {
      setLoading(true);  // แสดง loading ก่อนเริ่ม fetch ข้อมูล
      const res = await GetOrderByBookingID(id);
      if (res && res.data) {
        setOrders(res.data);  // ตรวจสอบว่าข้อมูลที่ได้รับเป็น array และจัดเก็บใน state
      }
    } catch (error) {
      const errorMessage =
        (error as Error).message || "An unknown error occurred.";
      console.error("Error fetching order data:", error);
      message.error("Failed to fetch order data: " + errorMessage);
    } finally {
      setLoading(false);  // ปิด loading หลังจากดึงข้อมูลเสร็จสิ้น
    }
  };
  console.log(orders);
  

  useEffect(() => {
    fetchOrderByBooking();
  }, [id]);
  
  const columns: ColumnsType<OrderInterface> = [
    {
      title: "ลำดับออเดอร์",
      dataIndex: "ID",
      key: "id",
      align: "center",
    },
    {
      title: "เวลาที่สั่ง",
      key: "date_time",
      render: (record) => {
        const date = record.CreatedAt; 
        return <p>{dayjs(date).format("HH:mm : DD MMM YYYY")}</p>;
      },
    },
    {
      title: "สถานะออเดอร์",
      key: "status_order_name",
      align: "center",
      render: (record) => {
        return (
          <>
            {record.Status_Order?.status_order_name === "เสิร์ฟเรียบร้อย" ? (
              <div>
                <CheckCircleOutlined style={{ color: "green", fontSize: "20px" }} />
                <div>เสิร์ฟเรียบร้อย</div>
              </div>
            ) : (
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: "20px" }} />}
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
      <Divider />
      <Row>
        <Col span={24} style={{ marginTop: "15px" }}>
          {loading ? (
            <Spin tip="กำลังโหลดข้อมูล..." size="large" />
          ) : orders.length > 0 ? ( // ตรวจสอบว่า orders เป็น array ที่มีข้อมูลมากกว่า 0
            <Table dataSource={orders} columns={columns} pagination={{ pageSize: 6 }} />
          ) : (
            <Empty description="ไม่มีออเดอร์ที่ต้องแสดง" />
          )}
        </Col>
      </Row>
    </>
  );
}

export default CustomerStatus;
