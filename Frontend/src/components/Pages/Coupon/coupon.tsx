
import { Card, Table, Col, Row, Button , message , Spin , Empty , Divider, Form , Modal , Input , DatePicker} from 'antd';
import { CreditCardOutlined  } from "@ant-design/icons";
import { CouponInterface } from "../../../interfaces/Coupon";
import { useState, useEffect } from "react";
import type { ColumnsType } from "antd/es/table";
import dayjs from 'dayjs';
import { GetCoupon , CreateCoupon } from '../../../services/https';
import {  useNavigate } from 'react-router-dom';

function Coupon() {

    const navigate = useNavigate();
    const [Coupon, setCoupon] = useState<CouponInterface[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [Code,setCode] = useState("");
    const [Discount,setDiscount] = useState("");
    const [cooldown, setCooldown] = useState(false);
    const [Dates, setDate] = useState<Date>(new Date());

    const EmployeeID = localStorage.getItem("employeeID") ;

    const columns: ColumnsType<CouponInterface> =[
        {
            key: 'date_time',
            title: 'เวลา',
            // dataIndex: 'date',
            render: (record) => {
            const date = record.CreatedAt;
            return <p>{dayjs(date).format("HH:mm : DD MMM YYYY")}</p>;
            },
        },
        {
            key: 'id',
            title: 'ลำดับ',
            dataIndex: 'ID',
        },
        {
            key: 'code',
            title: 'โค๊ด',
            dataIndex: 'code',
        },
        {
            key: 'discount',
            title: 'ส่วนลด',
            dataIndex: 'discount',
        },
        {
            key: 'date_time',
            title: 'เวลาsหมดอายุ',
            // dataIndex: 'date',
            render: (record) => {
            const date = record.expired_date;
            return <p>{dayjs(date).format("DD MMM YYYY")}</p>;
            },
        },
        {
            key: 'Employee',
            title: 'พนักงาน',
            // dataIndex: 'EmployeeID',
            render: (record) => <>{record.Employee?.FirstName || "N/A"}</>,
        },
    ];

    const getCoupon = async () => {
        try {
          setLoading(true);
          const res = await GetCoupon();
          if (res.status === 200) {
            setCoupon(res.data);
          } else {
            setCoupon([]);
            message.error(res.data.error || "ไม่สามารถดึงข้อมูลได้");
          }
        } catch (error) {
            setCoupon([]);
          message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
        } finally {
            setLoading(false);
        }
      };

      useEffect(() => {
        getCoupon();
      }, []);

      const onFinish = async () => {
        Modal.confirm({
            title: "ยืนยันการสร้าง \" คูปอง \"",
            content: "ตรวจสอบรายละเอียดการสร้างแล้วใช่ไหม",
            centered: true,
            className: "custom-modal-payment",
            onOk: async () => {
                try {
                    // สร้างข้อมูลใบเสร็จ
                    setIsSubmitting(true);
                    const CouponData: CouponInterface = {
                        code: Code,
                        discount: Number(Discount),
                        EmployeeID: Number(EmployeeID),
                        expired_date: Dates,
                    }
                    // บันทึกข้อมูลลงในฐานข้อมูลผ่าน API
                    const res = await CreateCoupon(CouponData);
            
                    if (res.status === 201) {
                        message.success("สร้าง คูปอง สำเร็จ");
                        setTimeout(() => {
                            window.location.reload();  // Refresh หน้าเมื่อสำเร็จ
                        }, 2000);
                    } else {
                        message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
                    }
                    setTimeout(() => {
                        navigate("/coupon");
                    }, 2000);
                } catch (error) {
                    message.error("ไม่สามารถบันทึกข้อมูลได้");
                }
            }
        })
        
    };

    const handleEnterPress = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (cooldown) {
            message.warning("กรุณารอซักครู่");
            return;
        }

        setCooldown(true);

        setTimeout(() => {
            setCooldown(false);
        }, 2000); 
    };

    const handleDateChange = (date: any) => {
            const selectedDate = new Date(date.toDate());
            selectedDate.setHours(0, 0, 0, 0); // ตั้งค่าเวลาเป็น 00:00:00
            setDate(selectedDate);
    };

    return(
        <Row>
            <Col xl={24}>
                <Form name="basic" layout="vertical" onFinish={onFinish} autoComplete="off" >
                    <Card>
                        <Row gutter={[20,20]}>
                            <Col xl={12}>
                                <Form.Item
                                    label="โค๊ด"
                                    name="input_code"
                                    className="custom-form-pay"
                                    rules={[{ required: true, message: "กรุณา \" โค๊ด \" !" }]}
                                >
                                <Input 
                                    className="centered-input" 
                                    maxLength={10}
                                    value={Code}
                                    onChange={(e) => setCode(e.target.value)}
                                    onPressEnter={handleEnterPress}
                                    style={{ border: "3px solid #434343" }}
                                />
                                </Form.Item>
                            </Col>
                            <Col xl={12}>
                                <Form.Item
                                    label="ส่วนลด"
                                    name="input_discount"
                                    className="custom-form-pay"
                                    rules={[{ required: true, message: "กรุณากรอก \" ส่วนลด \" !" }]}
                                >
                                <Input 
                                    className="centered-input" 
                                    maxLength={10}
                                    value={Discount}
                                    onChange={(e) => setDiscount(e.target.value)}
                                    onPressEnter={handleEnterPress}
                                    style={{ border: "3px solid #434343" }}
                                    onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                        }
                                    }}
                                />
                                </Form.Item>
                            </Col>
                            <Col xl={12}>
                                <Form.Item
                                    name="date"
                                    label="Select Date"
                                    style={{ fontWeight: 'bold' }}
                                    rules={[{ required: true, message: 'กรุณา เลือกวันหมดอายุ!' }]} // Add validation rules
                                    >
                                    <DatePicker
                                    onChange={handleDateChange} 
                                    format="DD/MM/YYYY"
                                    style={{ width: '30%' }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={12} style={{ textAlign: 'right' }}>
                                <Button 
                                    loading={isSubmitting}
                                    disabled={isSubmitting}
                                    type="primary" 
                                    htmlType="submit" 
                                    className="payment-button"
                                    icon={<CreditCardOutlined />}
                                >
                                    สร้างคูปอง
                                </Button>
                            </Col>
                        </Row>
                    </Card>
                </Form>
            </Col>
            <Col xl={24}>
            <Card style={{ borderRadius: '20px', padding: '0px', width: '100%' }}>
          <h2 style={{ marginTop: '-3px' }}>ประวัติการสร้าง คูปอง</h2>
          <Divider/>
            {loading ? (
              <Spin tip="Loading..." className="spinContainer" />
            ) : Coupon.length === 0 ? (
              <Empty description="No Coupon data" className="emptyState" />
            ) : (
              <Table
                dataSource={Coupon}
                columns={columns}
                rowClassName={(_, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
                pagination={{ pageSize: 3 }}
                className=""
              />
            )}
        </Card>
            </Col>
        </Row>
    )
}
export default Coupon;