import { useEffect,useState } from "react";
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
import { GetMemberByID, UpdateMember, GetRanks } from "../../../../services/https";
import { useNavigate, Link, useParams } from "react-router-dom";
import { RankInterface } from "../../../../interfaces/Rank";

function MemberEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [messageApi, contextHolder] = message.useMessage();

  const [ranks, setRanks] = useState<RankInterface[]>([]);
  const [form] = Form.useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const getMemberById = async (id: string) => {
    let res = await GetMemberByID(id);
    if (res.status === 200) {
      form.setFieldsValue({
        FirstName: res.data.FirstName,
        LastName: res.data.LastName,
        PhoneNumber: res.data.PhoneNumber,
        RankID: res.data.RankID,
      });
    } else {
      messageApi.open({
        type: "error",
        content: "ไม่พบข้อมูลผู้ใช้",
      });
      setTimeout(() => {
        navigate("/member");
      }, 2000);
    }
  };

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

  const onFinish = async (values: MemberInterface) => {
    if (isSubmitting) return;
      setIsSubmitting(true);
    const res = await UpdateMember(id, values);
    if (res.status === 200) {
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

  useEffect(() => {
    if (id) {
      getMemberById(id);
    }
    getRanks();
  }, [id]);

  return (
    <div>
      {contextHolder}
      <Card>
        <h2>แก้ไขข้อมูล สมาชิก</h2>
        <Divider />
        <Form
          name="basic"
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="ชื่อจริง"
                name="FirstName"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกชื่อ !",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="นามกสุล"
                name="LastName"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกนามสกุล !",
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
                    message: "กรุณากรอกเบอร์โทรศัพท์ !",
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
                    disabled={isSubmitting}>
                    บันทึก
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

export default MemberEdit;