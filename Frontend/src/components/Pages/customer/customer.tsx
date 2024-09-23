import React, { useState, useEffect } from "react";
import { Table, Row, Col, Spin, Button, message, Card, Statistic } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import "./customer.css";
import { GetBookingByID } from "../../../services/https";
import { BookingInterface } from "../../../interfaces/Booking";

function Customer() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [booking, setBooking] = useState<BookingInterface | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [tableName, setTableName] = useState<string>("");
    const [packages, setPackages] = useState<string>("");

    const fetchBookingById = async () => {
        if (!id) {
            message.error("Invalid booking ID!");
            setLoading(false);
            return;
        }

        console.log("Fetching booking for ID:", id); // Add this to check ID

        try {
            const res = await GetBookingByID(id);
            console.log("Response received:", res); // Log the response

            if (res && res.data) {
                console.log("Booking data:", res.data); // Log booking data
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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookingById();
    }, [id]);

    if (loading) {
        return <Spin size="large" />;
    }

    return (
        <div>
            <Row>
                <Col xs={2} span={6}>
                    <Card className="card-white" style={{ marginTop: '7vh', zIndex: "2", marginLeft: '50%', maxHeight: '125px' }}>
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
            </Row>
            <Row>
                <Card style={{ marginTop: '15px', overflowX: 'auto', maxHeight: '150px', maxWidth: '455px', marginLeft: '4%' }}>
                    <div style={{ display: 'flex', whiteSpace: 'nowrap', justifyContent: 'space-between' }}>
                        {/* แสดงเนื้อถ้าไม่ใช่หมูหรือทะเล */}
                        {packages !== "หมู,ไก่" && packages !== "ทะเล" && (
                            <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth:'120px', marginRight: '4px' }}>
                                <Card style={{ textAlign: 'center', width: '100px' }}>เนื้อ</Card>
                            </Col>
                        )}
                        {/* แสดงซีฟู้ดถ้าไม่ใช่แพ็คเกจหมู */}
                        {packages !== "หมู,ไก่" && (
                            <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth:'120px', marginRight: '4px' }}>
                                <Card style={{ textAlign: 'center', width: '100px' }}>ซีฟู้ด</Card>
                            </Col>
                        )}
                        <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth:'120px', marginRight: '4px' }}>
                            <Card style={{ textAlign: 'center', width: '100px' }}>หมู</Card>
                        </Col>
                        <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth:'120px', marginRight: '4px' }}>
                            <Card style={{ textAlign: 'center', width: '100px' }}>ไก่</Card>
                        </Col>
                        <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth:'120px', marginRight: '4px' }}>
                            <Card style={{ textAlign: 'center', width: '100px' }}>ผัก</Card>
                        </Col>
                        <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth:'120px', marginRight: '4px' }}>
                            <Card style={{ textAlign: 'center', width: '100px' }}>ของหวาน</Card>
                        </Col>
                    </div>
                </Card>
            </Row>
        </div>
    );
}

export default Customer;
