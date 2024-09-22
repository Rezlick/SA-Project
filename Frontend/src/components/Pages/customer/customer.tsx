import React, { useState, useEffect } from "react";
import { Table, Row, Col, Spin, Button, message, Card } from "antd";
import { CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import Background from "../../../assets/background_customer.webp"
import "./customer.css"
import logo from "../../../assets/logo.png"

function Customer() {
    const navigate = useNavigate();

    return (
        <div>
            <img className="img-background" src={Background} alt="Background" />
            <div className="customer-page">
                <Card className="card" style={{ justifyContent: 'center', justifyItems: 'center' }}>
                    <Row>
                        <Col>
                            <img className="logo" src={logo} alt="Logo" />
                        </Col>
                        <Card className="card-white">

                        </Card>
                    </Row>
                </Card>
            </div>
        </div>
    );
}

export default Customer;