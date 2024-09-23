import { useState, useEffect } from "react";
import { Table, Button, Col, Row, Modal, message, Form, Card, Statistic, Divider } from "antd";
import { DatabaseOutlined, ContainerOutlined } from "@ant-design/icons";
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
    const [productcode, setProductCode] = useState<string>("");
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
    console.log("awdvwa = ", orderproduct);
    

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
            <Form form={form} onFinish={onFinish}>
                <Row>
                    <Col span={24} style={{ marginTop: "-20px" }}>
                        <Card>
                            <h2>รายละเอียดออเดอร์</h2>
                            <Row>
                                <Col span={5}>
                                    <Card
                                        style={{
                                            boxShadow: "rgba(100, 100, 111, 0) 0px 7px 29px 0px",
                                            borderRadius: '20px',
                                        }}>
                                        <Statistic
                                            // title="หมายเลขออเดอร์"
                                            value={"เลขออเดอร์: " +(order?.ID)}
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
                                            // title="หมายเลขโต๊ะ"
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
                            <Button type="primary" style={{ height: '40px', width: '80px' }}>ย้อนกลับ</Button>
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
                            }}
                            onClick={showModal}
                            disabled={statusorder === 1} // Disable the button if Status_order?.ID is 1
                        >
                            ยืนยันการเสิร์ฟอาหาร
                        </Button>
                    </Col>
                </Row>

                <Modal
                    title="ยืนยันการเสิร์ฟอาหาร?"
                    open={isModalVisible}
                    onOk={() => form.submit()}
                    onCancel={handleCancel}
                    okText="ยืนยัน"
                    cancelText="ยกเลิก"
                    okButtonProps={{ disabled: isSubmitting }}>
                    <p>ยืนยันการเสิร์ฟใช่หรือไม่</p>
                </Modal>

            </Form>
        </>
    );
}

export default OrderDetail;
