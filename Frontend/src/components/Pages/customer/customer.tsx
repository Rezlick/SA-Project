import React, { useState, useEffect } from "react";
import { Table, Row, Col, Spin, Button, message, Card, Statistic, Form } from "antd";
import { useNavigate, Link, useParams } from "react-router-dom";
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
            <Card className="card">
                <Row>
                    <Card className="card-white" style={{ marginTop: '45px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', zIndex: "2" }}>
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
                </Row>
                <Row>
                    <Card style={{ marginTop: '15px' }}>
                        {/* Additional content can go here */}
                    </Card>
                </Row>
            </Card>
        </div>
    );
}

export default Customer;
