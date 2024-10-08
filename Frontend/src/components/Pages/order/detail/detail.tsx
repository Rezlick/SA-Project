import { useState, useEffect } from "react";
import { Table, Button, Col, Row, Modal, message, Form, Card, Statistic, Divider } from "antd";
import { DatabaseOutlined, ContainerOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useNavigate, useParams, Link } from "react-router-dom";
import { OrderProductInterface } from "../../../../interfaces/OrderProduct";
import { GetOrderProductsByOrderID } from "../../../../services/https";
import { OrderInterface } from "../../../../interfaces/Order";
import { UpdateOrder, GetOrderByID } from "../../../../services/https";

function OrderDetail() {
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [orderproduct, setOrderProductByOrderID] = useState<OrderProductInterface[]>([]);
    const [statusorder, setStatusOrder] = useState<number>();
    const [tableName, setTableName] = useState<string>("");
    const [order, setOrderByID] = useState<OrderInterface[]>([]);
    const [form] = Form.useForm(); // Ant Design form
    const { id } = useParams<{ id: string }>(); // Check if `id` is valid
    const employeeID = localStorage.getItem("employeeID") || "No ID found";
    const [isSubmitting, setIsSubmitting] = useState(false); // Track button state


    const onFinish = async (values: OrderInterface) => {
        values.EmployeeID = Number(employeeID);
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

    const fetchOrderById = async () => {
        if (!id) {
            message.error("Invalid Order ID!");
            return;
        }

        try {
            const res = await GetOrderByID(id);
            if (res && res.data) {
                setOrderByID(res.data);
                setStatusOrder(res.data.Status_Order?.ID ?? "N/A");
                setTableName(res.data.Booking?.table?.table_name ?? "N/A");
            } else {
                throw new Error("Failed to fetch Order data.");
            }
        } catch (error) {
            const errorMessage =
                (error as Error).message || "An unknown error occurred.";
            console.error("Error fetching Order data:", error);
            message.error("Failed to fetch Order data: " + errorMessage);
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
        fetchOrderById()
        if (id) {
            getOrderProductByOrderID(id);
        }
    }, [id, statusorder]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setIsSubmitting(false); // Reset submit state in case of cancel
    };

    const column: ColumnsType<OrderProductInterface> = [
        {
            title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>ลำดับ</span>, // Increased title font size
            key: "id",
            align: "center",
            render: (text, record, index) => (
                <span style={{ fontSize: '16px' }}>{index + 1}</span>
            ),
        },
        {
            title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>ประเภทสินค้า</span>, // Increased title font size
            key: "category_id",
            align: "center",
            render: (record: any) => (
                <span style={{ fontSize: '16px' }}>
                    {record.Products?.Category?.category_name || "N/A"}
                </span>
            ),
        },
        {
            title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>ชื่ออาหาร</span>, // Increased title font size
            key: "product_id",
            align: "center",
            render: (record: any) => (
                <span style={{ fontSize: '16px' }}>
                    {record.Products?.product_name || "N/A"}
                </span>
            ),
        },
        {
            title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>จำนวน</span>, // Increased title font size
            dataIndex: "Quantity",
            key: "quantity",
            align: "center",
            render: (text: any) => (
                <span style={{ fontSize: '16px' }}>
                    {text}
                </span>
            ),
        },
    ];


    return (
        <>
            <Form form={form} onFinish={onFinish}>
                <Row>
                    <Col span={24}>
                        <Card style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                            <h1 style={{ marginTop: '10px' }}>รายละเอียดออเดอร์</h1>
                            <Row>
                                <Col span={5}>
                                    <Card
                                        style={{
                                            boxShadow: "rgba(100, 100, 111, 0) 0px 7px 29px 0px",
                                            borderRadius: '20px',
                                        }}>
                                        <Statistic
                                            // title="หมายเลขออเดอร์"
                                            value={"เลขออเดอร์: " + (order?.ID)}
                                            valueStyle={{ color: "black" }}
                                            suffix={
                                                <span style={{ marginLeft: '5px' }}>
                                                    <ContainerOutlined />
                                                </span>
                                            }

                                        />
                                    </Card>
                                </Col>
                                <Col span={5}>
                                    <Card
                                        style={{
                                            boxShadow: "rgba(100, 100, 111, 0) 0px 7px 29px 0px",
                                            borderRadius: '20px',
                                            marginLeft: '20px'
                                        }}>
                                        <Statistic
                                            value={"เลขโต๊ะ: " + (tableName)}
                                            valueStyle={{ color: "black" }}
                                            suffix={
                                                <span style={{ marginLeft: '5px' }}>
                                                    <DatabaseOutlined />
                                                </span>
                                            }
                                        />
                                    </Card>
                                </Col>
                            </Row>

                        </Card>

                    </Col>

                </Row>
                <Divider />
                <Row>
                    <Col span={24} style={{ marginTop: "20px" }}>
                        <Table dataSource={orderproduct} columns={column} pagination={{ pageSize: 5 }} />
                    </Col>
                </Row>

                <Row justify="space-between">
                    <Col>
                        <Link to="/order">
                            <Button type="primary" icon={<ArrowLeftOutlined />} style={{ height: '50px', width: '120px', fontSize: '18px' }}>ย้อนกลับ</Button>
                        </Link>
                    </Col>

                    <Col>
                        <Button
                            type="primary"
                            size="large"
                            style={{
                                backgroundColor: statusorder === 1 ? 'rgba(255, 255, 255, 0.8)' : '#4CAF50',
                                borderColor: statusorder === 1 ? 'rgba(204, 204, 204, 0.8)' : '#4CAF50',
                                color: statusorder === 1 ? 'rgba(0, 0, 0, 0.5)' : '#FFFFFF',
                                opacity: statusorder === 1 ? 0.5 : 1,
                                fontSize: '18px',
                                height: '50px'
                            }}
                            onClick={showModal}
                            disabled={statusorder === 1} // Disable the button if Status_order?.ID is 1
                        >
                            ยืนยันการเสิร์ฟอาหาร
                        </Button>
                    </Col>
                </Row>

                <Modal
                    title={<span style={{ fontSize: '20px' }}>ยืนยันการเสิร์ฟอาหาร?</span>}
                    open={isModalVisible}
                    onOk={() => form.submit()}
                    onCancel={handleCancel}
                    footer={[
                        <Button
                            key="cancel"
                            onClick={handleCancel}
                            style={{ marginRight: '10px', height: '50px', width: '120px' }}>
                            ยกเลิก
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            disabled={isSubmitting}
                            onClick={() => form.submit()}
                            style={{ height: '50px', width: '120px', backgroundColor: 'green', borderColor: 'green' }}>
                            ยืนยัน
                        </Button>,
                    ]}
                >
                    <p style={{ textAlign: 'left', fontSize: '18px' }}>ยืนยันการเสิร์ฟใช่หรือไม่</p>
                </Modal>

            </Form>
        </>
    );
}

export default OrderDetail;
