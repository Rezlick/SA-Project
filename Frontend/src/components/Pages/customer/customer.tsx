import React, { useState, useEffect } from "react";
import { List, Avatar, Row, Col, message, Card, Statistic } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import "./customer.css";
import { GetBookingByID } from "../../../services/https";
import { BookingInterface } from "../../../interfaces/Booking";
import SliceBeef from "../../../assets/imagesCustomer/Slicebeef.webp"

function Customer() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [booking, setBooking] = useState<BookingInterface | null>(null);
    const [tableName, setTableName] = useState<string>("");
    const [packages, setPackages] = useState<string>("");
    const [selectedCard, setSelectedCard] = useState<string | null>(null); // สถานะของปุ่มที่ถูกคลิก
    const [filteredData, setFilteredData] = useState([]); // สถานะสำหรับข้อมูลที่กรองแล้ว

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
            message.error("Failed to fetch booking data: " + errorMessage);
        }
    };

    useEffect(() => {
        fetchBookingById();
    }, [id]);

    const data = [
        {
            productCode: 'M005',
            title: 'เนื้อวัวสไลด์',
            image: SliceBeef,
            category: 'เนื้อ',
        },
        {
            productCode: 'M006',
            title: 'เนื้อหมูคุโรบูตะ',
            image: 'https://path/to/pork1.png',
            category: 'เนื้อ',
        },
        {
            productCode: 'D001',
            title: 'น้ำอัมพอนสี',
            image: 'https://path/to/drink1.png',
            category: 'น้ำดื่ม',
        },
        {
            productCode: 'D002',
            title: 'น้ำผลไม้รวม',
            image: 'https://path/to/drink2.png',
            category: 'น้ำดื่ม',
        },
        {
            productCode: 'S001',
            title: 'ไอศกรีมรวมมิตร',
            image: 'https://path/to/icecream1.png',
            category: 'ของหวาน',
        },
    ];

    const filterByProductCode = (codePrefix: string) => {
        return data.filter(item => item.productCode.startsWith(codePrefix));
    };

    // ฟังก์ชันจัดการการคลิกที่ Card เพื่อเปลี่ยนสีและกรองข้อมูล
    const handleCardClick = (cardName: string, codePrefix: string) => {
        setSelectedCard(cardName); // จัดการปุ่มที่ถูกคลิก
        const filtered = filterByProductCode(codePrefix); // กรองข้อมูล
        setFilteredData(filtered); // ตั้งค่าข้อมูลที่กรองแล้ว
    };

    return (
        <div>
            <Row >
                <Col xs={2}>
                    <Card className="card-white"  style={{ marginTop: '7vh', zIndex: "2", marginLeft: '50%', maxHeight: '125px' }}>
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
            <Row gutter={[0, 0]}>
                <Card size="small" style={{ marginTop: '15px', overflowX: 'auto', maxHeight: '150px', maxWidth: '455px', marginLeft: '4%' }}>
                    <div style={{ display: 'flex', whiteSpace: 'nowrap' }}>
                        {packages !== "หมู,ไก่" && packages !== "ทะเล" && (
                            <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                <Card
                                    onClick={() => handleCardClick('เนื้อ', 'M')}
                                    style={{
                                        textAlign: 'center',
                                        width: '100px',
                                        backgroundColor: selectedCard === 'เนื้อ' ? 'lightgray' : 'white'
                                    }}
                                >
                                    เนื้อ
                                </Card>
                            </Col>
                        )}
                        {packages !== "หมู,ไก่" && (
                            <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                <Card
                                    onClick={() => handleCardClick('ซีฟู้ด', 'D')}
                                    style={{
                                        textAlign: 'center',
                                        width: '100px',
                                        backgroundColor: selectedCard === 'ซีฟู้ด' ? 'lightgray' : 'white'
                                    }}
                                >
                                    ซีฟู้ด
                                </Card>
                            </Col>
                        )}
                        <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                            <Card
                                onClick={() => handleCardClick('หมู', 'M')}
                                style={{
                                    textAlign: 'center',
                                    width: '100px',
                                    backgroundColor: selectedCard === 'หมู' ? 'lightgray' : 'white'
                                }}
                            >
                                หมู
                            </Card>
                        </Col>
                        <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                            <Card
                                onClick={() => handleCardClick('ไก่', 'M')}
                                style={{
                                    textAlign: 'center',
                                    width: '100px',
                                    backgroundColor: selectedCard === 'ไก่' ? 'lightgray' : 'white'
                                }}
                            >
                                ไก่
                            </Card>
                        </Col>
                        <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                            <Card
                                onClick={() => handleCardClick('ผัก', 'M')}
                                style={{
                                    textAlign: 'center',
                                    width: '100px',
                                    backgroundColor: selectedCard === 'ผัก' ? 'lightgray' : 'white'
                                }}
                            >
                                ผัก
                            </Card>
                        </Col>
                        <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                            <Card
                                onClick={() => handleCardClick('ของหวาน', 'S')}
                                style={{
                                    textAlign: 'center',
                                    width: '100px',
                                    backgroundColor: selectedCard === 'ของหวาน' ? 'lightgray' : 'white'
                                }}
                            >
                                ของหวาน
                            </Card>
                        </Col>
                    </div>
                </Card>
            </Row>
            <Row>
                <Col xs={24}>
                    <Card style={{ margin: '20px' }}>
                        <List
                            itemLayout="horizontal"
                            dataSource={filteredData}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.image} shape="square" size={100} />}
                                        title={<a href="#">{item.title}</a>}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default Customer;
