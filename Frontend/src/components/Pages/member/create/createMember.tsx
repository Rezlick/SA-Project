import { useState, useEffect } from "react";
import {
  Space,
  Button,
  Col,
  Row,
  Divider,
  Form,
  Input,
  Card,
  message,
  Select,
} from "antd";
import { MemberInterface } from "../../../../interfaces/Member";
import { RankInterface } from "../../../../interfaces/Rank";
import { CreateMember, GetRanks } from "../../../../services/https";
import { useNavigate, Link } from "react-router-dom";

function MemberCreate() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [ranks, setRanks] = useState<RankInterface[]>([]);
  const employeeID = localStorage.getItem("id");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const getRanks = async () => {
    try {
      const res = await GetRanks(); // Fetch data from the API

      if (res.status === 200) {
        setRanks(res.data); // Set the data from the API response
      } else {
        setRanks([]);
        messageApi.error(res.data.error || "ไม่สามารถดึงข้อมูลได้");
      }
    } catch (error) {
      setRanks([]);
      messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  useEffect(() => {
    getRanks();
  }, []);

  const onFinish = async (values: MemberInterface) => {
    if (isSubmitting) return;
      setIsSubmitting(true);
    values.EmployeeID = parseInt(employeeID || '', 10);
    const res = await CreateMember(values);
    if (res.status === 201) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      setTimeout(() => {
        navigate("/member");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  return (
    <div>
      {contextHolder}
      <Card>
        <h2>เพิ่มข้อมูล สมาชิก</h2>
        <Divider />
        <Form name="basic" layout="vertical" onFinish={onFinish} autoComplete="off">
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="ชื่อจริง"
                name="FirstName"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกชื่อ!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="นามสกุล"
                name="LastName"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกนามสกุล!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="เบอร์โทรศัพท์"
                name="PhoneNumber"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกเบอร์โทรศัพท์!",
                  },
                ]}
              >
                <Input minLength={10} maxLength={10}/>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="ระดับสมาชิก"
                name="RankID"
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกระดับสมาชิก!",
                  },
                ]}
              >
                <Select
                  placeholder="เลือกระดับสมาชิก"
                  style={{ width: "100%" }}
                  options={ranks.map((rank) => ({
                    value: rank.ID,
                    label: rank.Name,
                  }))}
                />
              </Form.Item>
            </Col>

            
          </Row>

          <Row justify="center">
            <Col style={{ marginTop: "40px" }}>
              <Form.Item>
                <Space>
                  <Link to="/member">
                    <Button htmlType="button" style={{ marginRight: "10px" }}>
                      ยกเลิก
                    </Button>
                  </Link>

                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    style={{backgroundColor:"#FF7D29"}} 
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    ยืนยัน
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}

export default MemberCreate;
