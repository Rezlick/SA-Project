import React, { useState, useEffect } from "react";
import { Table, Row, Col, Spin, Button, message, Card, Statistic, Form } from "antd";
import { CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { useNavigate, Link, useParams } from "react-router-dom";
import Background from "../../../assets/background_customer.webp"
import "./customer.css"
import logo from "../../../assets/logo.png"
import { GetBookingByID, GetPackages } from "../../../services/https";
import { BookingInterface } from "../../../interfaces/Booking";
import { PackageInterface } from "../../../interfaces/Package";

function Customer() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); // Check if `id` is valid
    const [booking, setBooking] = useState<BookingInterface | null>(null);
    const [tableName, setTableName] = useState<string>("");
    const [packages, setPackages] = useState<PackageInterface[]>([]);
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
            form.setFieldsValue({
              number_of_customer: res.data.number_of_customer,
              package_id: res.data.package_id,
            });
    
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

      const fetchPackages = async () => {
        try {
          const res = await GetPackages();
          if (res.status === 200) {
            setPackages(res.data);
          } else {
            setPackages([]);
            message.error(res.data.error || "Cannot fetch packages.");
          }
        } catch (error) {
          setPackages([]);
          message.error("Error fetching packages.");
        }
      };

      useEffect(() => {
        fetchPackages();
        fetchBookingById();
      }, [id]);
      
    return (
        <div>
            <img className="img-background" src={Background} alt="Background" />
            <div className="customer-page">
                <Card className="card" style={{ justifyContent: 'center', justifyItems: 'center' }}>
                    <Row>
                        <img className="logo" src={logo} alt="Logo" />
                    </Row>
                    <Row>

                        <Card className="card-white">
                            <Col xs={24}>
                                <Card style={{ marginTop: '50px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
                                    <Statistic
                                        value={booking?.ID}
                                        prefix="หมายเลขออเดอร์ : "
                                        valueStyle={{ fontSize: '16px' }}
                                    />
                                    <Statistic
                                        value={booking.table?.table_name}
                                        prefix="หมายเลขโต๊ะ : "
                                        valueStyle={{ fontSize: '16px' }}
                                    />
                                    <Statistic
                                        value={booking.package?.name}
                                        prefix="แพ็คเกจอาหาร : "
                                        valueStyle={{ fontSize: '16px' }}
                                    />
                                </Card>
                            </Col>
                        </Card>
                    </Row>

                </Card>
            </div>
        </div>
    );
}

export default Customer;