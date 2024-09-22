import React, { useState, useEffect } from "react";
import { Table, Row, Col, Spin, Button, message, Card, Statistic, Form } from "antd";
import { CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { useNavigate, Link, useParams } from "react-router-dom";
import Background from "../../../assets/background_customer.webp"
import "./customer.css"
import logo from "../../../assets/logo.png"
import { GetBookingByID } from "../../../services/https";
import { BookingInterface } from "../../../interfaces/Booking";

function Customer() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); // Check if `id` is valid
    const [booking, setBooking] = useState<BookingInterface | null>(null);
    const [tableName, setTableName] = useState<string>("");
    const [packages, setPackages] = useState<string>("");
    const [form] = Form.useForm();

    const fetchBookingById = async () => {
        if (!id) {
            message.error("Invalid booking ID!");
            return;
        }

        try {
            const res = await GetBookingByID(id);
            if (res && res.data) {
                setBooking(res.data);
                setTableName(res.data.table?.table_name ?? "N/A");
                setPackages(res.data.package?.name ?? "N/A");
            } else {
                throw new Error("Failed to fetch booking data.");
            }
        } catch (error) {
            const errorMessage =
                (error as Error).message || "An unknown error occurred.";
            console.error("Error fetching booking data:", error);
            message.error("Failed to fetch booking data: " + errorMessage);
        }
    };


    useEffect(() => {
        fetchBookingById();
    }, [id]);

    return (
        <>
            <img className="img-background" src={Background} alt="Background" />
            <div className="customer-page">
                <Card className="card" style={{ justifyContent: 'center', justifyItems: 'center' }}>
                    <Row>
                        <img className="logo" src={logo} alt="Logo" />
                    </Row>
                    <Row>
                        <Card className="card-white">
                            <Col xs={24}>
                                <Card style={{ marginTop: '45px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
                                    <Statistic
                                        value={booking?.ID}
                                        prefix="หมายเลขออเดอร์ : "
                                        valueStyle={{ fontSize: '16px' }}
                                    />
                                    <Statistic
                                        value={tableName}
                                        prefix="หมายเลขโต๊ะ : "
                                        valueStyle={{ fontSize: '16px' }}
                                    />
                                    <Statistic
                                        value={packages}
                                        prefix="แพ็คเกจอาหาร : "
                                        valueStyle={{ fontSize: '16px' }}
                                    />
                                </Card>
                            </Col>
                            <Row>
                                <Card  style={{ marginTop: '15px'}}>
                                    
                                </Card>
                            </Row>
                        </Card>
                    </Row>

                </Card>
            </div>
        </>
    );
}

export default Customer;