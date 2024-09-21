import { Link  } from 'react-router-dom';
import { Card, Table, Col, Row, Statistic, Button, Divider , message } from 'antd';
import { WalletOutlined, FileSyncOutlined, FileDoneOutlined, UserOutlined } from "@ant-design/icons";
import { ReceiptInterface } from "../../../interfaces/Receipt";
import { GetReceipts, AddPointsToMember, GetMembers } from "../../../services/https";
import { useState, useEffect } from "react";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

function Payment() {
  const [messageApi, contextHolder] = message.useMessage();
  const [receipt, setReceipt] = useState<ReceiptInterface[]>([]);
  const [SuccessValue, setSuccessValue] = useState<number>(0);
  const [TotalPrice, setTotalPrice] = useState<number>(0);

  const getReceipts = async () => {
    try {
      const res = await GetReceipts(); // Fetch data from the API

      if (res.status === 200) {
        setReceipt(res.data); // Set the data from the API response
      } else {
        setReceipt([]);
        message.error(res.data.error || "ไม่สามารถดึงข้อมูลได้");
      }
    } catch (error) {
      setReceipt([]);
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  const FetchSuccessData = async () => {
    try {
      const res = await GetReceipts();
      const dataFromTable = res.data; // แทนที่ someValue ด้วยชื่อฟิลด์ที่คุณต้องการจาก API
      const countIDs = dataFromTable.length;
      setSuccessValue(countIDs); // อัพเดทค่า value ใน state
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const FetchTotalPrice = async () => {
    try {
      const res = await GetReceipts();
      const dataFromTable = res.data; // แทนที่ someValue ด้วยชื่อฟิลด์ที่คุณต้องการจาก API
      
      type DataItem = {
        Totalprice: number;
      };
            
      const totalprice = dataFromTable.reduce((result: number, item: DataItem) => {
        return result + item.Totalprice;
      }, 0);
      setTotalPrice(totalprice); // อัพเดทค่า value ใน state
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    getReceipts();
    FetchSuccessData();
    FetchTotalPrice();
  }, []);

  const paths = [
    "/receipt/pay",
    "/receipt/pay",
    "/receipt/pay",
    "/receipt/pay",
    "/receipt/pay",
    "/receipt/pay",
    "/receipt/pay",
    "/receipt/pay",
    "/receipt/pay",
    "/receipt/pay",
    "/receipt/pay",
    "/receipt/pay"
  ];

  const buttonLabels = [
    "Table : F1",
    "Table : F2",
    "Table : F3",
    "Table : F4",
    "Table : F5",
    "Table : S1",
    "Table : S2",
    "Table : S3",
    "Table : S4",
    "Table : E1",
    "Table : E2",
    "Table : E3"
  ];

  const tableseat = [
    ": 1 - 4",
    ": 1 - 4",
    ": 1 - 4",
    ": 1 - 4",
    ": 1 - 4",
    ": 5 - 6",
    ": 5 - 6",
    ": 5 - 6",
    ": 5 - 6",
    ": 7 - 8",
    ": 7 - 8",
    ": 7 - 8"
  ];

  const buttons = paths.map((path, index) => (
    <Col key={index} xs={24} sm={12} md={8} lg={6} style={{ marginBottom: '16px' }}>
      <Link to={path}>
        <Button
          // className="custom-button"
          style={{
            width: '100%',
            height: '90px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '10px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            padding: '10px',
            border: '1px solid #d9d9d9'
          }}
        >
          <Statistic
            title={buttonLabels[index]}
            value={tableseat[index]}
            prefix={<UserOutlined />}
            valueStyle={{ fontSize: '16px' }}
          />
        </Button>
      </Link>
    </Col>
  ));

  const columns: ColumnsType<ReceiptInterface> =[
    {
      key: 'date_time',
      title: 'Date Time',
      dataIndex: 'date',
      render: (record) => <p>{dayjs(record).format("DD MMM YYYY HH:mm ")}</p>,
    },
    {
      key: 'id',
      title: 'ID',
      dataIndex: 'ID',
    },
    {
      key: 'BookingID',
      title: 'Booking',
      render: (record) => <>{record.Booking?.Table?.table_type || "N/A"}</>,
    },
    {
      key: 'total_price',
      title: 'Total Price',
      dataIndex: 'Totalprice',
    },
    {
      key: 'CounponID',
      title: 'Coupon',
      render: (record) => <>{record.Coupon?.code || "N/A"}</>,
    },
    {
      key: 'MemberID',
      title: 'Member',
      render: (record) => <>{record.Member?.FirstName || "N/A"}</>,
    },
    {
      key: 'Employee',
      title: 'Employee',
      render: (record) => <>{record.Employee?.FirstName || "N/A"}</>,
    },
  ];

  // const data = [
  //   {
  //     id: '1',
  //     booking_id: 'F1',
  //     total_price: 399,
  //     coupon: 'DC10',
  //     member_id: 'Oat',
  //     employee_id: 'Tae',
  //     date_time: '10/11/2000'
  //   },
  //   {
  //     id: '2',
  //     booking_id: 'F2',
  //     total_price: 299,
  //     coupon: 'DC15',
  //     member_id: 'A',
  //     employee_id: 'Tae',
  //     date_time: '10/11/2000'
  //   },
  //   {
  //     id: '3',
  //     booking_id: 'F4',
  //     total_price: 199,
  //     coupon: 'DC20',
  //     member_id: 'C',
  //     employee_id: 'Tae',
  //     date_time: '10/11/2000'
  //   },
  //   {
  //     id: '4',
  //     booking_id: 'F3',
  //     total_price: 299,
  //     coupon: 'DC20',
  //     member_id: 'D',
  //     employee_id: 'Tae',
  //     date_time: '10/11/2000'
  //   },
  //   {
  //     id: '5',
  //     booking_id: 'S1',
  //     total_price: 701,
  //     coupon: 'DC20',
  //     member_id: 'D',
  //     employee_id: 'Tae',
  //     date_time: '10/11/2000'
  //   },
  //   {
  //     id: '6',
  //     booking_id: 'S1',
  //     total_price: 701,
  //     coupon: 'DC20',
  //     member_id: 'D',
  //     employee_id: 'Tae',
  //     date_time: '10/11/2000'
  //   },
  //   {
  //     id: '7',
  //     booking_id: 'S1',
  //     total_price: 701,
  //     coupon: 'DC20',
  //     member_id: 'D',
  //     employee_id: 'Tae',
  //     date_time: '10/11/2000'
  //   },
  //   {
  //     id: '8',
  //     booking_id: 'S1',
  //     total_price: 701,
  //     coupon: 'DC20',
  //     member_id: 'D',
  //     employee_id: 'Tae',
  //     date_time: '10/11/2000'
  //   },
  //   {
  //     id: '9',
  //     booking_id: 'S1',
  //     total_price: 701,
  //     coupon: 'DC20',
  //     member_id: 'D',
  //     employee_id: 'Tae',
  //     date_time: '10/11/2000'
  //   },
  // ];

  return (
    <>
      {contextHolder}
      <Row gutter={[16, 16]} style={{ height: "80vh" }}>
        <Col xs={24} md={12}>
          <Card style={{ borderRadius: '20px', padding: '0px', height: 'auto' }}>
            <h3>Receipt History</h3>
            <Table
              dataSource={receipt}
              columns={columns}
              rowClassName={(_, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card style={{ borderRadius: '20px', marginBottom: '10px' }}>
            <h3>Daily List Summary</h3>
            <Row justify="space-around" align="middle">
              <Col xs={24} sm={12} md={7}>
                <Card style={{ borderRadius: '20px', boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}>
                  <Statistic title="กำลังดำเนินการ" value={5} prefix={<FileSyncOutlined />} />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={7}>
                <Card style={{ borderRadius: '20px', boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}>
                  <Statistic title="ทำรายการสำเร็จ" value={SuccessValue} prefix={<FileDoneOutlined />} />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={7}>
                <Card style={{ borderRadius: '20px', boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}>
                  <Statistic title="รายได้รวม" value={TotalPrice} prefix={<WalletOutlined />} suffix="฿" />
                </Card>
              </Col>
            </Row>
          </Card>

          <Card style={{ borderRadius: '20px' }}>
            <Card style={{ backgroundColor: "#F5F5F5", borderRadius: '20px' }}>
              <Row gutter={[16, 8]}>
                {buttons}
              </Row>
            </Card>
          </Card>
        </Col>
      </Row>
   </> 
  );
}

export default Payment;