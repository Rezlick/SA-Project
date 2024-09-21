import { Col, Row, Card, Statistic, Table, message, Form, DatePicker, Radio } from "antd";
import { AuditOutlined, UserOutlined, PieChartOutlined, StockOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetMemberCountForCurrentMonth, GetMemberCountForMonth, GetMemberCountForDay } from "../../../services/https";
import { useEffect, useState } from "react";

interface DataType {
  MemberCountForMonth: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "การสมัครสมาชิก",
    dataIndex: "MemberCountForMonth",
    key: "MemberCountForMonth",
  },
];

export default function Dashboard() {
  const [data, setData] = useState<DataType[]>([]);
  const [memberCountForCurrentMonth, setMemberCountForCurrentMonth] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDayMode, setIsDayMode] = useState<boolean>(false);

  const [selectedMode, setSelectedMode] = useState<string>("month");

  const currentMonth = new Intl.DateTimeFormat('th-TH', { month: 'long' }).format(new Date());

  const getMemberCountForCurrentMonth = async () => {
    try {
      const res = await GetMemberCountForCurrentMonth();
      if (res.status === 200) {
        setMemberCountForCurrentMonth(res.data.memberCount || 0);
      } else {
        message.error(res.data.error || "ไม่สามารถดึงข้อมูลได้");
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  const getMemberCountForMonth = async (month: number, year: number) => {
    try {
      const formattedMonth = month.toString().padStart(2, "0");
      const res = await GetMemberCountForMonth(formattedMonth, year.toString());
      if (res.status === 200) {
        setData([{ MemberCountForMonth: res.data.memberCount.toString() + " ท่าน" }]);
      } else {
        message.error(res.data.error || "ไม่สามารถดึงข้อมูลได้");
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  const getMemberCountForDay = async (date: string) => {
    try {
      const res = await GetMemberCountForDay(date);
      if (res.status === 200) {
        setData([{ MemberCountForMonth: res.data.memberCount.toString() + " ท่าน" }]);
      } else {
        message.error(res.data.error || "ไม่สามารถดึงข้อมูลได้");
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      if (isDayMode) {
        const formattedDate = date.toISOString().split("T")[0]; // Format date to "YYYY-MM-DD"
        getMemberCountForDay(formattedDate);
      } else {
        getMemberCountForMonth(date.getMonth() + 1, date.getFullYear());
      }
    }
  };

  const handleModeChange = (e: any) => {
    setIsDayMode(e.target.value === "day");
  };

  useEffect(() => {
    getMemberCountForCurrentMonth();
  }, []);

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <h2>แดชบอร์ด</h2>
          <h3>สถิติ ณ เดือน {currentMonth}</h3>
        </Col>

        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Card style={{ backgroundColor: "#F5F5F5" }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Card bordered={false} style={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}>
                  <Statistic title="จำนวน" value={1800} prefix={<StockOutlined />} />
                </Card>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Card bordered={false} style={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}>
                  <Statistic title="จำนวน" value={200} valueStyle={{ color: "black" }} prefix={<AuditOutlined />} />
                </Card>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Card bordered={false} style={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}>
                  <Statistic title="จำนวน" value={3000} valueStyle={{ color: "black" }} prefix={<PieChartOutlined />} />
                </Card>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Card bordered={false} style={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}>
                  <Statistic title="การสมัครสมาชิก" value={`${memberCountForCurrentMonth} ท่าน`} valueStyle={{ color: "black" }} prefix={<UserOutlined />} />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Radio.Group defaultValue="month" buttonStyle="solid" onChange={handleModeChange} >
            <Radio.Button value="month" >สถิติรายเดือน</Radio.Button>
            <Radio.Button value="day">สถิติรายวัน</Radio.Button>
          </Radio.Group>
        </Col>

        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
          <Form.Item name="MonthID" rules={[{ required: true, message: "กรุณาเลือกเดือนหรือวัน!" }]}>
            <DatePicker onChange={(date) => handleDateChange(date?.toDate() || null)} picker={isDayMode ? "date" : "month"} />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Table columns={columns} dataSource={data} pagination={false} style={{ height: "100%" }} />
        </Col>
      </Row>
    </>
  );
}
