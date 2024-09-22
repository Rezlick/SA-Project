import { Link  } from 'react-router-dom';
import { Card, Table, Col, Row, Statistic, Button , message } from 'antd';
import { WalletOutlined, FileSyncOutlined, FileDoneOutlined, UserOutlined } from "@ant-design/icons";
import { ReceiptInterface } from "../../../interfaces/Receipt";
import { GetReceipts , GetTablebys } from "../../../services/https";
import { useState, useEffect } from "react";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

function Receipt() {

  const [receipt, setReceipt] = useState<ReceiptInterface[]>([]);
  const [HoldValue, setHoldValue] = useState<number>(0);
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

  const FetchHoldData = async () => {
    try {
      const res = await GetTablebys();  // ดึงข้อมูลการจอง (Booking)
      const dataFromTable = res.data; // เข้าถึงข้อมูลจาก API
      const reservedTables = dataFromTable.filter((item: { table_status_id: number}) => item.table_status_id === 2);
      const countIDs = reservedTables.length;
      setHoldValue(countIDs);    
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const FetchTotalPrice = async () => {
    try {
      const res = await GetReceipts();
      const dataFromTable = res.data; // แทนที่ someValue ด้วยชื่อฟิลด์ที่คุณต้องการจาก API
      
      type DataItem = {
        totalprice: number;
      };
            
      const totalprice = dataFromTable.reduce((result: number, item: DataItem) => {
        return result + item.totalprice;
      }, 0);
      setTotalPrice(totalprice); // อัพเดทค่า value ใน state
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    getReceipts();
    FetchHoldData();
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
      // dataIndex: 'date',
      render: (record) => {
        const date = record.CreatedAt;
        return <p>{dayjs(date).format("HH:mm : DD MMM YYYY")}</p>;
      },
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
      dataIndex: 'totalprice',
    },
    {
      key: 'CounponID',
      title: 'Coupon',
      render: (record) => <>{record.Coupon?.code || "ไม่มี"}</>,
    },
    {
      key: 'MemberID',
      title: 'Member',
      render: (record) => <>{record.Member?.FirstName || "N/A"}</>,
    },
    {
      key: 'Employee',
      title: 'Employee',
      // dataIndex: 'EmployeeID',
      render: (record) => <>{record.Employee?.FirstName || "N/A"}</>,
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {/* Content Section */}
      <Col span={12}>
        <Card style={{ borderRadius: '20px', padding: '0px', width: '100%', height: '55vh' }}>
          <h2 style={{ marginTop: '-3px' }}>Receipt History</h2>
          <Table
            dataSource={receipt}
            columns={columns}
            rowClassName={(_, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
            pagination={{ pageSize: 3 }}
          />
        </Card>
      </Col>
      {/* Button Section */}
      <Col span={12} >
              <Card style={{ borderRadius: '20px', width: '100%', height: '30vh' , marginBottom:'10px'}}>
          <h2 style={{ marginTop: '-3px' }}>Daily List Summary</h2>
          <Row
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
          >
            <Col xs={24} sm={24} md={12} lg={12} xl={7}>
              <Card
                style={{
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                  borderRadius: '20px',
                }}
              >
                <Statistic
                  title="กำลังดำเนินการ"
                  value={HoldValue}
                  valueStyle={{ color: "black" }}
                  prefix={<FileSyncOutlined style={{ marginRight: '8px' }}/>}
                  suffix={<span style={{ marginLeft: '8px' }}>รายการ</span>}
                />
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={7}>
              <Card
                style={{
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                  borderRadius: '20px',
                }}
              >
                <Statistic
                  title="ทำรายการสำเร็จ"
                  value={SuccessValue}
                  valueStyle={{ color: "black" }}
                  prefix={<FileDoneOutlined style={{ marginRight: '8px' }}/>}
                  suffix={<span style={{ marginLeft: '8px' }}>รายการ</span>}
                />
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={7}>
              <Card
                style={{
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                  borderRadius: '20px',
                }}
              >
                <Statistic
                  title="รายได้รวม"
                  value={TotalPrice}
                  valueStyle={{ color: "black"}}
                  prefix={<WalletOutlined style={{ marginRight: '8px' }}/>}
                  suffix={<span style={{ marginLeft: '2px' }}>฿</span>}
                />
              </Card>
            </Col>
          </Row>
        </Card>
        <Card style={{ borderRadius: '20px', height: '65vh' }}>
          <Card style={{ backgroundColor: "#F5F5F5", height: '100%' , borderRadius:'20px' }}>
            <Row gutter={[16, 16]}>
              {buttons}
            </Row>
          </Card>
        </Card>
      </Col>
    </Row>
  );
}

export default Receipt;