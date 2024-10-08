import { useState , useEffect } from "react";
import { Link , useNavigate } from 'react-router-dom';
import { QrcodeOutlined , CheckCircleOutlined , LeftCircleOutlined , IdcardOutlined , PhoneOutlined , WalletOutlined } from "@ant-design/icons";
import { message , Card , Row , Col , Form , Input , Button , Checkbox , Select , Modal } from "antd";
import { GetBookingByID , CheckCoupons , CreateReceipt , CheckMembers , AddPointsToMember , CheckBooking , GetTypePayment, DeleteBookingAfterPay} from "../../../../services/https";
import  PromtPay  from "../../../../assets/PromptPay-logo.png"
import './pay.css';
import { ReceiptInterface } from "../../../../interfaces/Receipt";
import { TypePaymentInterface } from "../../../../interfaces/TypePayment"


function Pay() {
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const tableName = queryParams.get("tableName") || "Unknown Table";
    const [BookID, setBookingID] = useState<string>("");
    const [showQR, setShowQR ] = useState(false);
    const [form] = Form.useForm();
    const [coupon, setCoupon] = useState("");
    const [phone, setPhone] = useState("");
    const [FirstName, setFirstName] = useState("Guest");
    const [RankName, setRankName] = useState("ไม่มี");
    const [Point, setPoint] = useState<number>(0);
    const [MemberID, setMemberID] = useState<number>(0);
    const [CouponDiscount, setCouponDiscount] = useState<number>(0);
    const [CouponID, setCouponID] = useState<number>(0);
    const [cooldown, setCooldown] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [Table,SetTable] = useState("");
    const [Booking,SetBooking] = useState("");
    const [Package,SetPackage] = useState("");
    const [NumberCustomer,SetNumberCustomer] = useState("");
    const [checked, setChecked] = useState(false);
    const [TotalPrice, setTotalPrice] = useState<number>(0);
    const [TotalPackagePrice, setTotalPackagePrice] = useState<number>(0);
    const [TotalSoupPrice, setTotalSoupPrice] = useState<number>(0);
    const [TotalDiscount, setTotalDiscount] = useState<number>(0);
    const [NetTotal, setNetTotal] = useState<number>(0);
    const [RateDiscount, setRateDiscount] = useState<number>(0);
    const [RankDiscount, setRankDiscount] = useState<number>(0);
    const [Soups, setSoups] = useState([{ name:'', price: 0}]);
    const [TypePayment, setTypePayment] = useState<TypePaymentInterface[]>([])
    const [Type,setType] = useState<number>(0);
    const [Redata] = useState(true);

    const EmployeeID = localStorage.getItem("employeeID") ;
    
    const check = (e: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
        setChecked(e.target.checked);
        if(Redata){
            form.setFieldsValue({
                input_phone: "",
            });
            setFirstName("Guest")
            setRankName("ไม่มี")
            setRateDiscount(0)
        }
    };
    
    const getTypePayment = async () =>{
        try {
            const res = await GetTypePayment();
            if (res.status === 200) {
                setTypePayment(res.data);
            } else {
                setTypePayment([]);
                message.error(res.data.error || "ไม่สามารถดึงข้อมูลได้");
            }
          } catch (error) {
                setTypePayment([]);
                message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
          }
    }

    const getIDBooking = async () =>{
        const res = await CheckBooking(tableName);
        if (res.data.isValid) {
            setBookingID(res.data.bookingID)
          }
    }

    const getBookingById = async (id: string) => {
        let res = await GetBookingByID(id);
        if (res.status === 200) {
            setPoint(res.data.package.point)
            SetTable(res.data.table.table_name)
            SetBooking(res.data.ID)
            SetPackage(res.data.package.name)
            SetNumberCustomer(res.data.number_of_customer)
            setSoups(res.data.soups.map((soup: { name: any; price: any; }) => ({ 
                name: soup.name,
                price: soup.price
              })))
        } else {
            message.open({
            type: "error",
            content: "ไม่พบข้อมูลผู้ใช้",
          });
          setTimeout(() => {
            navigate("/receipt");
          }, 2000);
        }
    };
    
    const CheckCoupon = async () => {
        const res = await CheckCoupons(coupon);
        if (res.data.isValid) {
            message.success("Coupon ถูกต้อง");
            setCouponDiscount(res.data.discount)
            setCouponID(res.data.couponID)
          } else if (res.data.isExpire) {
            message.error("Coupon หมดอายุแล้ว");
            setCouponDiscount(0)
            setCouponID(0)
        } else {
            message.error("Coupon ไม่ถูกต้อง");
            setCouponDiscount(0)
            setCouponID(0)
        }
    }

    const CheckPhone = async () => {
        const res = await CheckMembers(phone);
        if (res.data.isValid) {
            message.success("\"สมาชิก\" ถูกต้อง");
            setMemberID(res.data.MemberID)
            setFirstName(res.data.FirstName)
            setRankName(res.data.Rank)
            setRateDiscount(res.data.Discount)
          } else {
            message.error("ไม่มี \"สมาชิก\" อยู่ในระบบ");
            setFirstName("Guest")
            setRankName("ไม่มี")
            setRateDiscount(0)
          }
    }

    const calculator = async (id: string) => {
        let res = await GetBookingByID(id);
        const totalsoupprice = Soups.reduce((total, soup) => total + soup.price, 0);
        const CDiscount = CouponDiscount
        const RankDiscount = Math.round(TotalPrice * RateDiscount)
        const totaldiscount = Math.round(RankDiscount + CDiscount)
        const totalpackage = res.data.package.price * res.data.number_of_customer
        const totalprice = totalpackage + totalsoupprice
        const nettotal = totalprice - totaldiscount
        setTotalPackagePrice(totalpackage)
        setTotalSoupPrice(totalsoupprice);
        setRankDiscount(RankDiscount)
        setTotalPrice(totalprice)
        setTotalDiscount(totaldiscount)
        setNetTotal(nettotal)
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
            RankName: "Rank  : "+RName,
        })
    }
   

    useEffect(() => {
        getIDBooking();
        getBookingById(BookID);
        calculator(BookID);
        getTypePayment();
        if (FirstName) {
            CheckMember();
        }
    }, [CouponDiscount,FirstName,BookID,Point]);

    const handleQR = () => {
        setShowQR(!showQR);
    };

    const onFinish = async () => {
        Modal.confirm({
            title: "ยืนยันการชำระเงิน",
            content: "แน่ใจใช่ไหม ที่ต้องการชำระเงิน",
            centered: true,
            className: "custom-modal-payment",
            onOk: async () => {
                try {
                    // สร้างข้อมูลใบเสร็จ
                    setIsSubmitting(true);
                    const receiptData: ReceiptInterface = {
                        BookingID: Number(BookID), // ใช้ค่า BookingID ที่ดึงมาได้
                        totalprice: NetTotal,
                        totaldiscount: TotalDiscount,
                        CouponID: CouponID, // ใช้ค่า CouponID ที่ตรวจสอบแล้วจาก Coupon
                        MemberID: MemberID, // ดึงข้อมูล MemberID จากผลลัพธ์การเรียก Booking
                        EmployeeID: Number(EmployeeID), // คุณอาจต้องกำหนดค่า EmployeeID ที่เข้าระบบอยู่
                        TypePaymentID: Type,
                    };
            
                    // บันทึกข้อมูลลงในฐานข้อมูลผ่าน API
                    const res = await CreateReceipt(receiptData);
            
                    if (res.status === 201) {
                        message.success("ชำระเงินสำเร็จ");
                        
                // ลบข้อมูลการจองหลังจากสร้างใบเสร็จแล้ว
                const deleteRes = await DeleteBookingAfterPay(BookID);
                if (deleteRes.status === 200) {
                    message.success("ลบข้อมูลการจองโต๊ะสำเร็จ");
                } else {
                    message.error("เกิดข้อผิดพลาดในการลบข้อมูลการจอง");
                }
    
                if (MemberID != 0) {
                    AddPointsToMember(String(MemberID), Point);
                }
            
                setTimeout(() => {
                    navigate("/receipt");
                }, 2000);

                } else {
                    message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
                }

                } catch (error) {
                    message.error("ไม่สามารถบันทึกข้อมูลได้");
                }
            }
        })
        
    };
    

    const handleEnterPressCoupon = (e: { preventDefault: () => void; }) => {
        e.preventDefault(); // ยกเลิกการ submit ฟอร์ม

        if (cooldown) {
            message.warning("กรุณารอซักครู่");
            return;
        }

        // ตั้งค่าสถานะ cooldown
        setCooldown(true);
        CheckCoupon(); // เรียกฟังก์ชันตรวจสอบคูปอง

        setTimeout(() => {
            setCooldown(false); // ล้างสถานะ cooldown
        }, 2000); 
    };

    const handleEnterPressPhone = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (cooldown) {
            message.warning("กรุณารอซักครู่");
            return;
        }

        setCooldown(true);
        CheckPhone();

        setTimeout(() => {
            setCooldown(false); 
        }, 2000);
    };

    const renderSoupFields = () => {
        if (Soups.length === 0) {
            return(
                <Col xs={24}>
                    <p>No soups in booking.</p>
                </Col>
            )
        }
        if (Soups.length >= 2) {
            return(
                <Row gutter={[15,0]}>
                    {Soups.map((soup, index) => (
                            <Col key={index} lg={1} xl={12}>
                                <Card className="card-payment">{"\" "}{soup.name}{" \" ราคา : "}{soup.price}{" บาท"}</Card>
                            </Col>
                    ))}
                </Row>
            )
        }
        return null
    }

    const onFinishFailed = () => {
        message.error("กรุณาเลือก \" ช่องทางชำระเงิน \" ก่อนยืนยัน");
    };

    return (
        <>
        <Row>
            <Col xs={24} sm={24} md={16} lg={12} xl={showQR ? 17 : 24}>
                <Card style={{
                    borderRadius: '10px',
                    height: '88vh',
                    background: 'linear-gradient(45deg, #FFFFFF, #E0E0E0)',
                }}>
                    <Row style={{marginBottom:"20px"}}>
                        <Link to="/receipt">
                            <Button className="back-button" icon={<LeftCircleOutlined />}>
                                กลับ
                            </Button>
                        </Link>
                        <div className="checkbox-container">
                            <Checkbox className="checkbox-payment" checked={checked} onChange={check}>
                                Member
                            </Checkbox>
                        </div>
                    </Row>

                    <Form
                        name="read-only"
                        labelCol={{style: {
                            display: "flex",
                            justifyContent: "center",
                        }}}
                        form={form}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        {/* ส่วนหลักของข้อมูล */}
                        <Card style={{
                            borderRadius: '10px',
                            marginBottom: '40px',
                            background: 'linear-gradient(45deg, #D3D3D3, #F5F5F5)',
                            border: '3px solid #434343',

                        }}>
                            <Row gutter={[15,0]}> 
                                <Col xs={24} sm={24} md={16} lg={12} xl={6}>
                                    <Card className="card-payment">{"หมายเลขโต๊ะ : "}{Table}</Card>
                                </Col>
                                <Col xs={24} sm={24} md={16} lg={12} xl={10}>
                                    <Card className="card-payment">{"หมายเลขออเดอร์ : "}{Booking}</Card>
                                </Col>
                                <Col xs={24} sm={24} md={16} lg={12} xl={8}>
                                    <Card className="card-payment">{"แพ็คเกจ : "}{Package}</Card>
                                </Col>
                                { checked && (<Col xs={24} sm={24} md={16} lg={12} xl={6}>
                                    <Form.Item
                                        label="เบอร์โทร"
                                        name="input_phone"
                                        className="custom-form-pay"
                                        >
                                    <Input 
                                        className="centered-input" 
                                        maxLength={10}
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        onPressEnter={handleEnterPressPhone}
                                        onKeyPress={(event) => {
                                            const inputValue = (event.target as HTMLInputElement).value; // แคสต์เป็น HTMLInputElement
                                            if (!/[0-9]/.test(event.key)) {
                                                event.preventDefault();
                                            }
                                            if (inputValue.length === 0 && event.key !== '0') {
                                                event.preventDefault();
                                            }
                                            }}
                                        style={{ border: "3px solid #434343" , marginBottom:"0px" ,  height: "50px"}}
                                        />
                                    </Form.Item>
                                </Col>)}
                                <Col xs={24} sm={24} md={16} lg={12} xl={checked ? 6 : 8}>
                                    <Card className="card-payment">{"สมาชิก : "}{FirstName}</Card>
                                </Col>
                                <Col xs={24} sm={24} md={16} lg={12} xl={checked ? 7 : 8}>
                                    <Card className="card-payment">{"ระดับสมาชิก : "}{RankName}</Card>
                                </Col>
                                <Col xs={24} sm={24} md={16} lg={12} xl={checked ? 5 : 8}>
                                    <Card className="card-payment">{"ลูกค้า : "}{NumberCustomer}{" ท่าน"}</Card>
                                </Col>
                                <Col xl={24}>{renderSoupFields()}</Col>
                                <Col xs={24} sm={24} md={16} lg={12} xl={7}>
                                    <Form.Item
                                        label="คูปอง"
                                        name="input_coupon"
                                        className="custom-form-pay"
                                        >
                                    <Input 
                                        className="centered-input" 
                                        maxLength={10}
                                        value={coupon}
                                        onChange={(e) => setCoupon(e.target.value)}
                                        onPressEnter={handleEnterPressCoupon}
                                        style={{ border: "3px solid #434343" , marginBottom:"0px" ,  height: "50px" }}
                                    />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={24} md={16} lg={12} xl={8}>
                                    <Card className="card-payment">{"ส่วนลดคูปอง : "}{CouponDiscount}{" บาท"}</Card>
                                </Col>
                                <Col xs={24} sm={24} md={16} lg={12} xl={9}>
                                    <Card className="card-payment">{"ส่วนบัตรสมาชิก : "}{RankDiscount}{" บาท"}</Card>
                                </Col>
                                <Col xs={24} sm={24} md={16} lg={12} xl={12}>
                                    <Card className="card-payment">{"รวมราคาน้ำซุป : "}{TotalSoupPrice}{" บาท"}</Card>
                                </Col>
                                <Col xs={24} sm={24} md={16} lg={12} xl={12}>
                                    <Card className="card-payment">{"รวมราคาแพ็คเกจ : "}{TotalPackagePrice}{" บาท"}</Card>
                                </Col>
                                <Col xs={24} sm={24} md={16} lg={12} xl={7}>
                                    <Card className="card-payment">{"รวมเป็นเงิน : "}{TotalPrice}{" บาท"}</Card>
                                </Col>
                                <Col xs={24} sm={24} md={16} lg={12} xl={8}>
                                    <Card className="card-payment">{"ส่วนลดทั้งหมด : "}{TotalDiscount}{" บาท"}</Card>
                                </Col>
                                <Col xs={24} sm={24} md={16} lg={12} xl={9}>
                                    <Card className="card-payment">{"ยอดสุทธิ : "}{NetTotal}{" บาท"}</Card>
                                </Col>
                            </Row>
                        </Card>
                        <Row justify="space-between" align="middle">
                            <Col style={{ display: "flex", alignItems: "center" , marginBottom: "px" }}>
                                <Button icon={<QrcodeOutlined />} className="qr-button" onClick={handleQR}>
                                    แสดง QR
                                </Button>
                            </Col>
                            <Col xl={8} style={{  justifyContent: "center", alignItems: "center" }}>
                                <Form.Item
                                    label="ช่องทางชำระเงิน"
                                    name="TypeID"
                                    className="form-type"
                                    colon={false}
                                    rules={[
                                        {
                                            required: true,
                                            message: "กรุณาเลือกวิธีการงการชำระเงิน!",
                                        },
                                    ]}
                                    style={{   marginBottom: "0px",alignItems: "center" }}
                                    >
                                    <Select
                                        placeholder="กรุณาเลือกวิธีการชำระเงิน"
                                        style={{ width: "100%", fontSize: "30px" , fontWeight:"bolder"}}
                                        dropdownClassName="custom-dropdown-FormType"
                                        options={TypePayment.map((typepayment) => ({
                                            value: typepayment.ID,
                                            label: typepayment.Name,
                                        }))}
                                        onChange={(value) => {
                                            setType(value)
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col style={{ marginBottom: "0px" , display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                                <Button 
                                loading={isSubmitting}
                                disabled={isSubmitting}
                                type="primary" 
                                htmlType="submit" 
                                className="payment-button"
                                icon={<CheckCircleOutlined />}
                                >
                                    ยืนยัน (การชำระเงิน)
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </Col>    
            {showQR && (<Col xs={24} sm={24} md={16} lg={12} xl={7}>
                <Card
                    style={{
                        background: 'linear-gradient(45deg, #E0E0E0, #FFFFFF)',
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column', // จัดเรียงรายการในแนวตั้ง
                        justifyContent: 'center', // จัดให้อยู่ด้านบน
                        textAlign: 'center', // จัดข้อความและ img ให้อยู่ตรงกลางในแนวนอน
                        height: '88vh',
                    }}
                    >
                    <Row gutter={[0,24]}>
                        <Col xs={24} sm={24} md={16} lg={12} xl={24} style={{ justifyContent: 'flex-start'}}>
                            <img
                                src={PromtPay}
                                style={{ width: '380px', height: '130px' }} // เพิ่ม margin เพื่อเว้นระยะระหว่าง img สองตัว
                            />
                        </Col>
                        <Card className="custom-cardQR" style={{ marginLeft:'20px', border: '3px solid #434343', padding: 0, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'}}>
                            <Col xs={24} sm={24} md={16} lg={12} xl={24}>
                                <img
                                    src={`https://promptpay.io/0648312668/${NetTotal}`}
                                    style={{ width: '363px', height: '363px' }}
                                />
                            </Col>
                        </Card>
                        <Col xs={24} sm={24} md={16} lg={12} xl={24}>
                            <Card className="card-promtpay" >
                                <div className="content-promtpay">
                                    <IdcardOutlined className="large-icon" /> ชื่อบัญชี : นาย ธนวิทย์
                                </div>
                            </Card>
                            <Card className="card-promtpay">
                                <div className="content-promtpay">
                                    <PhoneOutlined className="large-icon" /> เบอร์ : 064 831 2668
                                </div>
                            </Card>
                            <Card className="card-promtpay">
                                <div className="content-promtpay">
                                    <WalletOutlined className="large-icon" />{"ยอดรวม : "}{NetTotal}{" บาท"}
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Card>
            </Col>)}
        </Row>
        </>
    );
}

export default Pay;