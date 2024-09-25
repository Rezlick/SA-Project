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
    const [orders, setOrders] = useState<OrderInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const { id: bookingID } = useParams<{ id: string }>(); // ดึง bookingID จาก path

    const fetchOrderByBooking = async () => {
        if (!bookingID) {
            message.error("Invalid booking ID!");
            return;
        }

        try {
            setLoading(true); // แสดง loading ก่อนเริ่ม fetch ข้อมูล
            const res = await GetOrderByBookingID(bookingID); // ส่ง bookingID ไปเพื่อดึงข้อมูล order
            if (res && res.data) {
                setOrders(res.data); // จัดเก็บข้อมูล orders
            }
        } catch (error) {
            const errorMessage =
                (error as Error).message || "An unknown error occurred.";
            console.error("Error fetching order data:", error);
            message.error("Failed to fetch order data: " + errorMessage);
        } finally {
            setLoading(false); // ปิด loading หลังจากดึงข้อมูลเสร็จสิ้น
        }
    };
    console.log(orders);
    

    useEffect(() => {
        const interval = setInterval(() => {
            fetchOrderByBooking();
        }, 5000);
    
        return () => clearInterval(interval); // ล้าง interval เมื่อคอมโพเนนต์ถูกถอดออก
    }, [bookingID]);
    

    const columns: ColumnsType<OrderInterface> = [
        {
            title: "ลำดับ",
            key: "id",
            render: (text, record, index) => index + 1,
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
            title: "สถานะ",
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
            render: (orders) => (
                // เปลี่ยนเส้นทางไปยัง order detail page พร้อมส่ง orderID ไปใน URL path
                <Link to={`/customer/detail/${bookingID}/${orders?.ID}`}>
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
                    ) : orders.length > 0 ? (
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
