import { useState, useEffect } from "react";
import { Table, Button, Col, Row, message, Card, Divider, Spin, Form } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigate, useParams, Link } from "react-router-dom";
import { OrderProductInterface } from "../../../../../interfaces/OrderProduct";
import { GetOrderProductsByOrderID, GetOrderByID } from "../../../../../services/https";
import { OrderInterface } from "../../../../../interfaces/Order";

function CustomerDetail() {
    const navigate = useNavigate();
    const [orderproduct, setOrderProductByOrderID] = useState<OrderProductInterface[]>([]);
    const [order, setOrderByID] = useState<OrderInterface[]>([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [form] = Form.useForm(); // Ant Design form
    const { bookingID, id } = useParams<{ bookingID: string, id: string }>(); // Get both bookingID and orderID

    const fetchOrderById = async () => {
        if (!id) {
            message.error("Invalid Order ID!");
            return;
        }

        try {
            setLoading(true); // Set loading before fetching data
            const res = await GetOrderByID(id);
            if (res && res.data) {
                setOrderByID(res.data);
            } else {
                throw new Error("Failed to fetch Order data.");
            }
        } catch (error) {
            const errorMessage =
                (error as Error).message || "An unknown error occurred.";
            console.error("Error fetching Order data:", error);
            message.error("Failed to fetch Order data: " + errorMessage);
        } finally {
            setLoading(false); // Stop loading after fetching data
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
                navigate(`/customer/status/${bookingID}`);
            }, 2000);
        }
    };

    useEffect(() => {
        fetchOrderById();
        if (id) {
            getOrderProductByOrderID(id);
        }
    }, [id]);

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
            render: (record: any) => <>{record.Products?.Category?.category_name || "N/A"}</>,
        },
        {
            title: "ชื่ออาหาร",
            key: "product_id",
            align: "center",
            render: (record: any) => <>{record.Products?.product_name || "N/A"}</>,
        },
        {
            title: "จำนวน",
            dataIndex: "Quantity",
            key: "quantity",
            align: "center",
        },
    ];

    return (
        <>
            <Card style={{ marginTop: '20px', backgroundColor: '#2C2C2C',border: '3px solid #FFD700' }}>
                <Row>
                    <Col span={12} style={{ marginTop: "-10px", marginBottom:'-10px' }}>
                        <h2 style={{ color:'white'}}>รายละเอียดออเดอร์</h2>
                    </Col>
                </Row>
                <Divider style={{ borderColor: '#FFD700', color: '#FFD700' }} />
                <Row>
                    <Col span={24} style={{ marginTop: "20px" }}>
                        {/* Conditional rendering for loading state */}
                        {loading ? (
                            <Spin tip="กำลังโหลดข้อมูล..." size="large" />
                        ) : (
                            <Table
                                dataSource={orderproduct}
                                columns={column} pagination={false} scroll={{ y: 350 }} />
                        )}
                    </Col>
                </Row>
                <Row justify="space-between">
                    <Col>
                        <Link to={`/customer/status/${bookingID}`}>
                            <Button
                                type="primary"
                                style={{ height: '50px', width: '100px', fontSize: '18px', marginTop:'20px' }} // Adjust height, width, and font size
                            >
                                ย้อนกลับ
                            </Button>
                        </Link>

                    </Col>
                </Row>
            </Card>
        </>
    );
}

export default CustomerDetail;
