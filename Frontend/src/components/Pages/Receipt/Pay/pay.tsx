import { useState , useEffect } from "react";

import { Link , useNavigate } from 'react-router-dom';

import { message , Card , Row , Col , Form , Input , Button } from "antd";

import { GetBookingByID , CheckCoupons , CreateReceipt , CheckMembers} from "../../../../services/https";

import './pay.css';
import { ReceiptInterface } from "../../../../interfaces/Receipt";

function Pay() {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const [showQR, setShowQR ] = useState(false);
    const [form] = Form.useForm();
    const [coupon, setCoupon] = useState("");
    const [phone, setPhone] = useState("");
    const [FirstName, setFirstName] = useState("");
    const [RankName, setRankName] = useState("");
    const [MemberID, setMemberID] = useState<number>(0);
    const [RDiscount, setRDiscount] = useState<number>(0);
    const [CouponDiscount, setCouponDiscount] = useState<number>(0);
    const [CouponID, setCouponID] = useState<number>(0);
    const [cooldown, setCooldown] = useState(false);  // สถานะ cooldown

    const getBookingById = async (id: string) => {
        let res = await GetBookingByID(id);
        if (res.status === 200) {
          form.setFieldsValue({
            Table: "Table : " + res.data.Table.table_type,
            Booking: "หมายเลขออเดอร์ : " + res.data.ID,
            Package: "Package : " + res.data.Package.name,
            NumberOfCustomer: "จำนวนลูกค้า : " + res.data.number_of_customers + " ท่าน"
          });
        } else {
          message.open({
            type: "error",
            content: "ไม่พบข้อมูลผู้ใช้",
          });
          setTimeout(() => {
            navigate("/member");
          }, 2000);
        }
    };
    
    const CheckCoupon = async () => {
        const res = await CheckCoupons(coupon);
        if (res.data.isValid) {
            message.success("Coupon ถูกต้อง");
            setCouponDiscount(res.data.discount)
            setCouponID(res.data.couponID)
          } else {
            message.error("Coupon ไม่ถูกต้อง");
          }
    }

    const CheckPhone = async () => {
        const res = await CheckMembers(phone);
        if (res.data.isValid) {
            message.success("Member ถูกต้อง");
            setMemberID(res.data.MemberID)
            setFirstName(res.data.FirstName)
            setRankName(res.data.Rank)
            setRDiscount(res.data.Discount)
          } else {
            message.error("Member ไม่ถูกต้อง ");

          }
    }

    const calculator = async (id: string) => {
        let res = await GetBookingByID(id);
        const TotalPrice = res.data.Package.price * res.data.number_of_customers
        const RankDiscount = Math.round(TotalPrice * RDiscount)
        const CDiscount = CouponDiscount
        const TotalDiscount = Math.round(RankDiscount + CDiscount)
        const NetTotal = TotalPrice - TotalDiscount
        form.setFieldsValue({
            RankDiscount: RankDiscount,
            NetTotal: NetTotal,
            CDiscount: CDiscount,
            totalprice: TotalPrice,
            totaldiscount: TotalDiscount,
        })
    }

    const CheckMember = async () => {
        const FName = FirstName
        const RName = RankName
        form.setFieldsValue({
            FirstName: "Member : "+FName,
            RankName: "Rank : "+RName,
        })
    }
   

    useEffect(() => {
        getBookingById("2");
        calculator("2");
        CheckMember();
    }, [CouponDiscount,FirstName]);

    const handleConfirmPayment = () => {
        setShowQR(false);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleQR = () => {
        setShowQR(!showQR);
    };


    const onFinish = async (values: ReceiptInterface) => {
        try {
            // สร้างข้อมูลใบเสร็จ
            const receiptData: ReceiptInterface = {
                BookingID: 2, // สมมุติว่าคุณมีการกำหนด BookingID ไว้
                totalprice: values.totalprice,
                totaldiscount: values.totaldiscount,
                CouponID: CouponID, // ใช้ค่า CouponID ที่ตรวจสอบแล้วจาก Coupon
                MemberID: MemberID, // ดึงข้อมูล MemberID จากผลลัพธ์การเรียก Booking
                EmployeeID: 1, // คุณอาจต้องกำหนดค่า EmployeeID ที่เข้าระบบอยู่
            };
    
            // บันทึกข้อมูลลงในฐานข้อมูลผ่าน API
            const res = await CreateReceipt(receiptData);
    
            if (res.status === 201) {
                message.success("ชำระเงินสำเร็จ");
                setTimeout(() => {
                    navigate("/receipt");
                }, 2000);
            } else {
                message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
            }
        } catch (error) {
            message.error("ไม่สามารถบันทึกข้อมูลได้");
        }
    
        setShowPopup(false);
    };

    const handleEnterPressCoupon = (e: { preventDefault: () => void; }) => {
        e.preventDefault(); // ยกเลิกการ submit ฟอร์ม

        // ถ้าอยู่ในช่วง cooldown ไม่ให้เรียก CheckCoupon
        if (cooldown) {
            message.warning("กรุณารอซักครู่");
            return;
        }

        // ตั้งค่าสถานะ cooldown
        setCooldown(true);
        CheckCoupon(); // เรียกฟังก์ชันตรวจสอบคูปอง

        // ตั้งค่า timeout ให้ cooldown หายไปหลังจาก 3 วินาที
        setTimeout(() => {
            setCooldown(false); // ล้างสถานะ cooldown
        }, 2000); // หน่วงเวลา 3 วินาที (3000 มิลลิวินาที)
    };

    const handleEnterPressPhone = (e: { preventDefault: () => void; }) => {
        e.preventDefault(); // ยกเลิกการ submit ฟอร์ม

        // ถ้าอยู่ในช่วง cooldown ไม่ให้เรียก CheckCoupon
        if (cooldown) {
            message.warning("กรุณารอซักครู่");
            return;
        }

        // ตั้งค่าสถานะ cooldown
        setCooldown(true);
        CheckPhone(); // เรียกฟังก์ชันตรวจสอบคูปอง

        // ตั้งค่า timeout ให้ cooldown หายไปหลังจาก 3 วินาที
        setTimeout(() => {
            setCooldown(false); // ล้างสถานะ cooldown
        }, 2000); // หน่วงเวลา 3 วินาที (3000 มิลลิวินาที)
    };
  
    return (
        <>
        <Row >
            <Col>
                <Card style={{
                    width: '1000px',
                    margin: '30px auto',
                    padding: '15px',
                    borderRadius: '30px',
                }}>
                    {/* ปุ่มกลับ */}
                    <div style={{ marginBottom: '20px',marginTop:'-20px' }}>
                        <Link to="/receipt">
                            <button className="button">
                                กลับ
                            </button>
                        </Link>
                    </div>

                    <Form
                        name="read-only"
                        labelCol={{style: { display: "flex", justifyContent: "center" }}}
                        form={form}
                        className="custom-form"
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        {/* ส่วนหลักของข้อมูล */}
                        <Card style={{
                            borderRadius: '10px',
                        }}>
                            <Row gutter={[8,0]}> 
                                    <Col xs={24} sm={24} md={16} lg={12} xl={6}>
                                        <Form.Item
                                            name="Table"
                                            >
                                        <Input 
                                        readOnly className="centered-input"
                                        onPressEnter={(e) => {
                                            e.preventDefault(); // ยกเลิกการ submit ฟอร์ม
                                        }}
                                        />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={16} lg={12} xl={10}>
                                        <Form.Item
                                            name="Booking"
                                            >
                                        <Input 
                                        readOnly className="centered-input"
                                        onPressEnter={(e) => {
                                            e.preventDefault(); // ยกเลิกการ submit ฟอร์ม
                                        }}
                                        />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={16} lg={12} xl={8}>
                                        <Form.Item
                                            name="Package"
                                            >
                                        <Input 
                                        readOnly className="centered-input"
                                        onPressEnter={(e) => {
                                            e.preventDefault(); // ยกเลิกการ submit ฟอร์ม
                                        }}
                                        />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={16} lg={12} xl={8}>
                                        <Form.Item
                                            label="Phone"
                                            name="input_phone"
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                            help={<div style={{ textAlign: 'center' }}>ถ้า Guest ให้ใส่เบอร์ 0</div>}
                                            >
                                        <Input 
                                            className="centered-input" 
                                            maxLength={10}
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            onPressEnter={handleEnterPressPhone}
                                            onKeyPress={(e) => {
                                                if (!/[0-9]/.test(e.key)) {
                                                    e.preventDefault(); // ป้องกันไม่ให้ป้อนอักขระที่ไม่ใช่ตัวเลข
                                                }
                                            }}
                                        />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={16} lg={12} xl={5}>
                                        <Form.Item
                                            name="FirstName"
                                            >
                                        <Input 
                                        readOnly className="centered-input"
                                        onPressEnter={(e) => {
                                            e.preventDefault(); // ยกเลิกการ submit ฟอร์ม
                                        }}
                                        />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={16} lg={12} xl={5}>
                                        <Form.Item
                                            name="RankName"
                                            >
                                        <Input 
                                        readOnly className="centered-input"
                                        onPressEnter={(e) => {
                                            e.preventDefault(); // ยกเลิกการ submit ฟอร์ม
                                        }}
                                        />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={16} lg={12} xl={6}>
                                        <Form.Item
                                            name="NumberOfCustomer"
                                            >
                                        <Input 
                                        readOnly className="centered-input"
                                        onPressEnter={(e) => {
                                            e.preventDefault(); // ยกเลิกการ submit ฟอร์ม
                                        }}
                                        />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={16} lg={12} xl={6}>
                                        <Form.Item
                                            name="soup"
                                            >
                                        <Input 
                                        readOnly className="centered-input"
                                        onPressEnter={(e) => {
                                            e.preventDefault(); // ยกเลิกการ submit ฟอร์ม
                                        }}
                                        />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={16} lg={12} xl={6}>
                                        <Form.Item
                                            name="soup"
                                            >
                                        <Input 
                                        readOnly className="centered-input"
                                        onPressEnter={(e) => {
                                            e.preventDefault(); // ยกเลิกการ submit ฟอร์ม
                                        }}
                                        />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={16} lg={12} xl={6}>
                                        <Form.Item
                                            name="soup"
                                            >
                                        <Input 
                                        readOnly className="centered-input"
                                        onPressEnter={(e) => {
                                            e.preventDefault(); // ยกเลิกการ submit ฟอร์ม
                                        }}
                                        />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={16} lg={12} xl={6}>
                                        <Form.Item
                                            name="soup"
                                            >
                                        <Input 
                                        readOnly className="centered-input"
                                        onPressEnter={(e) => {
                                            e.preventDefault(); // ยกเลิกการ submit ฟอร์ม
                                        }}
                                        />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={16} lg={12} xl={6}>
                                        <Form.Item
                                            label="Coupon"
                                            name="input_coupon"
                                            >
                                        <Input 
                                            className="centered-input" 
                                            maxLength={10}
                                            value={coupon}
                                            onChange={(e) => setCoupon(e.target.value)}
                                            onPressEnter={handleEnterPressCoupon}
                                        />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={16} lg={12} xl={9}>
                                        <Form.Item
                                            label="ส่วนลด Coupon"
                                            name={"CDiscount"}
                                            >
                                        <Input 
                                        readOnly className="centered-input"
                                        onPressEnter={(e) => {
                                            e.preventDefault(); // ยกเลิกการ submit ฟอร์ม
                                        }}
                                        addonAfter="฿"
                                        />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={16} lg={12} xl={9}>
                                        <Form.Item
                                            label="ส่วนลดบัตรสมาชิก"
                                            name="RankDiscount"
                                            >
                                        <Input 
                                        readOnly className="centered-input"
                                        onPressEnter={(e) => {
                                            e.preventDefault(); // ยกเลิกการ submit ฟอร์ม
                                        }}
                                        addonAfter="฿"
                                        />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={16} lg={12} xl={7}>
                                        <Form.Item
                                            label="รวมเป็นเงิน"
                                            name="totalprice"
                                            >
                                        <Input 
                                        readOnly className="centered-input"
                                        onPressEnter={(e) => {
                                            e.preventDefault(); // ยกเลิกการ submit ฟอร์ม
                                        }}
                                        addonAfter="฿"
                                        />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={16} lg={12} xl={8}>
                                        <Form.Item
                                            label="ส่วนลดทั้งหมด"
                                            name="totaldiscount"
                                            >
                                        <Input 
                                        readOnly className="centered-input"
                                        onPressEnter={(e) => {
                                            e.preventDefault(); // ยกเลิกการ submit ฟอร์ม
                                        }}
                                        addonAfter="฿"
                                        />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={16} lg={12} xl={9}>
                                        <Form.Item
                                            label="ยอดสุทธิ"
                                            name="NetTotal"
                                            >
                                        <Input 
                                        readOnly className="centered-input"
                                        onPressEnter={(e) => {
                                            e.preventDefault(); // ยกเลิกการ submit ฟอร์ม
                                        }}
                                        addonAfter="฿"
                                        />
                                        </Form.Item>
                                    </Col>
                            </Row>
                        </Card>

                    {/* Pop-up ยืนยันการชำระเงิน */}
                    {showPopup && (
                        <Card className="popup-overlay">
                            <div className="popup">
                                <h2>ยืนยันการชำระเงิน</h2>
                                <div className="popup-buttons">
                                    <Button className="confirm-button" htmlType="submit" >ยืนยัน</Button>
                                    <Button className="cancel-button" onClick={handleClosePopup}>ยกเลิก</Button>
                                </div>
                            </div>
                        </Card>
                    )}
                    </Form>
                        {/* ปุ่มแสดง QR และยืนยันการชำระเงิน */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                {/* <Link to="/receipt/pay/qr"> */}
                                    <button className="qr-button" onClick={handleQR}>
                                        แสดง QR
                                    </button>
                                {/* </Link> */}
                            <button className="payment-button" onClick={handleConfirmPayment}>
                                ยืนยัน (การชำระเงิน)
                            </button>
                        </div>

                </Card>
            </Col>    
            <Col>
                {showQR && (
                    <Card style={{
                        padding: '25px',
                        margin: '40px auto',
                        borderRadius: '30px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: 'flex',
                    }}>
                        <h1 style={{marginTop:'-3px' , justifyContent:'center' , display:'flex' }}>QR สำหรับชำระเงิน </h1>
                        <Card>
                        <img src={"https://promptpay.io/0612169735/5"} style={{ width: '400px', height: '400px', borderRadius: '10px' }}/>
                        </Card>
                    </Card>
                )}
            </Col>
        </Row>
        </>
    );
}

export default Pay;