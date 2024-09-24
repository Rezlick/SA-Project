import { Col, Row, Card, Statistic, Table, message, Form, DatePicker, Radio } from "antd";
import { UserOutlined, WalletOutlined, StockOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetMemberCountForCurrentMonth, GetDashboardDataForDay, GetNetIncomeForCurrentMonth, GetDashboardDataForMonth, GetCashIncomeForCurrentMonth, GetTranferIncomeForCurrentMonth } from "../../../services/https";
import { useEffect, useState } from "react";
import moment from 'moment';
// npm install moment

interface DataType {
  MemberCount: string;
  NetIncome: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "รายได้สุทธิ",
    dataIndex: "NetIncome",
    key: "NetIncome",
  },
  {
    title: "การสมัครสมาชิก",
    dataIndex: "MemberCount",
    key: "MemberCount",
  },
];

export default function Dashboard() {
  const [form] = Form.useForm();

  const [data, setData] = useState<DataType[]>([]);

  const [memberCountForCurrentMonth, setMemberCountForCurrentMonth] = useState<number>(0);
  const [netIncomeForCurrentMonth, setNetIncomeForCurrentMonth] = useState<number>(0);
  const [cashIncomeForCurrentMonth, setCashIncomeForCurrentMonth] = useState<number>(0);
  const [tranferIncomeForCurrentMonth, setTranferIncomeForCurrentMonth] = useState<number>(0);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDayMode, setIsDayMode] = useState<boolean>(false);

  const [mode, setMode] = useState('month');

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

  const getNetIncomeForCurrentMonth = async () => {
    try {
      const res = await GetNetIncomeForCurrentMonth();
      if (res.status === 200) {
        setNetIncomeForCurrentMonth(res.data.netIncome || 0);
      } else {
        message.error(res.data.error || "ไม่สามารถดึงข้อมูลได้");
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  const getCashIncomeForCurrentMonth = async () => {
    try {
      const res = await GetCashIncomeForCurrentMonth();
      if (res.status === 200) {
        setCashIncomeForCurrentMonth(res.data.cashIncome || 0);
      } else {
        message.error(res.data.error || "ไม่สามารถดึงข้อมูลได้");
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  const getTranferIncomeForCurrentMonth = async () => {
    try {
      const res = await GetTranferIncomeForCurrentMonth();
      if (res.status === 200) {
        setTranferIncomeForCurrentMonth(res.data.tranferIncome || 0);
      } else {
        message.error(res.data.error || "ไม่สามารถดึงข้อมูลได้");
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  const getDashboardDataForMonth = async (month: number, year: number) => {
    try {
      const formattedMonth = month.toString().padStart(2, "0");
      const res = await GetDashboardDataForMonth(formattedMonth, year.toString());
      if (res.status === 200) {
        setData([{ MemberCount: res.data.memberCount.toString() + " ท่าน", NetIncome: res.data.netIncome + " บาท" }]);
      } else {
        message.error(res.data.error || "ไม่สามารถดึงข้อมูลได้");
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  const getDashboardDataForDay = async (date: string) => {
    try {
      const res = await GetDashboardDataForDay(date);
      if (res.status === 200) {
        setData([{ MemberCount: res.data.memberCount.toString() + " ท่าน", NetIncome: res.data.netIncome + " บาท" }]);
      } else {
        message.error(res.data.error || "ไม่สามารถดึงข้อมูลได้");
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };


  const handleDateChange = (date: moment.Moment | null) => {
    if (date) {
      setSelectedDate(date.toDate());

      if (isDayMode) {
        // Format date to "YYYY-MM-DD" in local timezone
        const formattedDate = date.format('YYYY-MM-DD');
        getDashboardDataForDay(formattedDate);
      } else {
        // For month mode, use the correct month and year
        getDashboardDataForMonth(date.month() + 1, date.year());
      }
    } else {
      setSelectedDate(null);
    }
  };

  const handleModeChange = (e: any) => {
    setIsDayMode(e.target.value === "day");
    setMode(e.target.value);
    form.resetFields(['MonthID']);
  };

  useEffect(() => {
    getMemberCountForCurrentMonth();
    getNetIncomeForCurrentMonth();
    getTranferIncomeForCurrentMonth();
    getCashIncomeForCurrentMonth();
  }, []);

  return (
    <>
      <Form form={form}>
        <Row gutter={[16,16]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <h1>แดชบอร์ด</h1>
            <h2>สถิติ ณ เดือน {currentMonth}</h2>
          </Col>

          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Card style={{ backgroundColor: "#F5F5F5" }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                  <Card bordered={false} style={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}>
                    <Statistic title="รายได้เงินสด" value={`${cashIncomeForCurrentMonth} ฿`} prefix={<StockOutlined />} />
                  </Card>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                  <Card bordered={false} style={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}>
                    <Statistic title="รายได้เงินโอน" value={`${tranferIncomeForCurrentMonth} ฿`} prefix={<StockOutlined />} />
                  </Card>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                  <Card bordered={false} style={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}>
                    <Statistic title="รายได้สุทธิ" value={`${netIncomeForCurrentMonth} ฿`} valueStyle={{ color: "black" }} prefix={<WalletOutlined />} />
                  </Card>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                  <Card bordered={false} style={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}>
                    <Statistic title="จำนวนการสมัครสมาชิก" value={`${memberCountForCurrentMonth} ท่าน`} valueStyle={{ color: "black" }} prefix={<UserOutlined />} />
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Radio.Group defaultValue="month" buttonStyle="solid" onChange={handleModeChange}>
              <Radio.Button
                value="month"
                style={{
                  backgroundColor: mode === 'month' ? '#FF7D29' : '', // Apply color if selected
                  color: mode === 'month' ? '#fff' : '', // Ensure text is white on the selected button
                }}
              >
                สถิติรายเดือน
              </Radio.Button>
              <Radio.Button
                value="day"
                style={{
                  backgroundColor: mode === 'day' ? '#FF7D29' : '', // Apply color if selected
                  color: mode === 'day' ? '#fff' : '', // Ensure text is white on the selected button
                }}
              >
                สถิติรายวัน
              </Radio.Button>
            </Radio.Group>
          </Col>

          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            <Form.Item
              name="MonthID"
              rules={[{ required: true, message: 'กรุณาเลือกเดือนหรือวัน!' }]}
            >
              <DatePicker
                onChange={handleDateChange}
                picker={isDayMode ? 'date' : 'month'} // Switch between date and month picker
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Table columns={columns} dataSource={data} pagination={false} style={{ height: "100%" }} />
          </Col>
        </Row>
      </Form>
    </>
  );
}
