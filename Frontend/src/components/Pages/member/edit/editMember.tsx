import { useEffect, useState } from "react";
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
import { GetMemberByID, UpdateMember, GetRanks, CheckPhone } from "../../../../services/https";
import { useNavigate, Link, useParams } from "react-router-dom";
import { RankInterface } from "../../../../interfaces/Rank";

function MemberEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [messageApi, contextHolder] = message.useMessage();

  const [ranks, setRanks] = useState<RankInterface[]>([]);
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialPhoneNumber, setInitialPhoneNumber] = useState<string>("");
  const [phoneNumberInvalid, setPhoneNumberInvalid] = useState(false);

  const getMemberById = async (id: string) => {
    let res = await GetMemberByID(id);
    if (res.status === 200) {
      const phoneNumber = res.data.PhoneNumber;
      setInitialPhoneNumber(phoneNumber); // Store the initial phone number
      form.setFieldsValue({
        FirstName: res.data.FirstName,
        LastName: res.data.LastName,
        PhoneNumber: phoneNumber,
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
      const res = await GetRanks();
      if (res.status === 200) {
        setRanks(res.data);
      } else {
        setRanks([]);
        messageApi.error(res.data.error || "ไม่สามารถดึงข้อมูลได้");
      }
    } catch (error) {
      setRanks([]);
      messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  const checkPhone = async (phoneNumber: string) => {
    if (phoneNumber === initialPhoneNumber) {
      return true; // Allow submission if the phone number hasn't changed
    }
    try {
      const res = await CheckPhone(phoneNumber);
      if (res.status === 200) {
        if (res.data.isValid) {
          setPhoneNumberInvalid(false); // Phone number is valid
          return true;
        } else {
          messageApi.error("เบอร์โทรศัพท์นี้มีอยู่ในระบบแล้ว");
          setPhoneNumberInvalid(true); // Set invalid flag if phone number is in use
          return false;
        }
      } else {
        messageApi.error(res.data.error || "ไม่สามารถตรวจสอบเบอร์โทรศัพท์ได้");
        return false;
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการตรวจสอบเบอร์โทรศัพท์");
      return false;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setFieldsValue({ PhoneNumber: e.target.value });
    setPhoneNumberInvalid(false); // Reset invalid flag when phone changes
  };

  const onFinish = async (values: MemberInterface) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const phoneIsValid = await checkPhone(values.PhoneNumber || "");
    
    if (!phoneIsValid) {
      setIsSubmitting(false);
      return; // Exit if phone number is invalid
    }

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
    setIsSubmitting(true);
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
                rules={[{ required: true, message: "กรุณากรอกชื่อ !" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="นามสกุล"
                name="LastName"
                rules={[{ required: true, message: "กรุณากรอกนามสกุล !" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="เบอร์โทรศัพท์"
                name="PhoneNumber"
                rules={[
                  { required: true, message: "กรุณากรอกเบอร์โทรศัพท์ที่ขึ้นต้นด้วย 0 !" },
                  { len: 10, message: "เบอร์โทรศัพท์ต้องมีความยาว 10 ตัวเลข" },
                ]}
              >
                <Input
                  minLength={10}
                  maxLength={10}
                  onChange={handlePhoneChange}
                  onKeyPress={(event) => {
                    const inputValue = (event.target as HTMLInputElement).value;

                    // Allow only digits
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }

                    // Prevent input if the first character isn't 0
                    if (inputValue.length === 0 && event.key !== '0') {
                      event.preventDefault(); // Block the input if the first digit isn't 0
                    }
                  }}
                  onCopy={(e) => e.preventDefault()} // Prevent copy
                  onCut={(e) => e.preventDefault()} // Prevent cut
                  onPaste={(e) => e.preventDefault()} // Prevent paste
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="ระดับสมาชิก"
                name="RankID"
                rules={[{ required: true, message: "กรุณาเลือกระดับสมาชิก!" }]}
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
                    style={{ backgroundColor: "rgb(218, 165, 32)" }} 
                    loading={isSubmitting}
                    disabled={isSubmitting || phoneNumberInvalid} // Disable if submitting or phone is invalid
                  >
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
