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
} from "antd";
import { MemberInterface } from "../../../../interfaces/Member";
import { CheckPhone, CreateMember, GetRanks } from "../../../../services/https";
import { useNavigate, Link } from "react-router-dom";

function MemberCreate() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const employeeID = localStorage.getItem("employeeID");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();

  const [phoneNumberInvalid, setPhoneNumberInvalid] = useState(false);

  const checkPhone = async (phoneNumber: string) => {
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
    setIsSubmitting(true); // Start submitting process

    const phoneIsValid = await checkPhone(values.PhoneNumber || "");

    if (!phoneIsValid) {
      setIsSubmitting(false);
      return; // Exit if phone number is invalid
    }

    values.EmployeeID = parseInt(employeeID || "", 10);
    values.RankID = 1;
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
    setIsSubmitting(true);
  };

  return (
    <div>
      {contextHolder}
      <Card>
        <h2>เพิ่มข้อมูล สมาชิก</h2>
        <Divider />
        <Form
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off" // Disable form-level autocomplete
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="ชื่อจริง"
                name="FirstName" // Use a less predictable name attribute
                rules={[{ required: true, message: "กรุณากรอกชื่อ!" }]}
              >
                <Input
                  id="randomFirstName" // Use a less predictable id attribute
                  type="text" // Generic input type
                  autoComplete="new-password" // A trick to prevent autofill
                  onCopy={(e) => e.preventDefault()} // Prevent copy
                  onCut={(e) => e.preventDefault()} // Prevent cut
                  onPaste={(e) => e.preventDefault()} // Prevent paste
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="นามสกุล"
                name="LastName" // Use a less predictable name attribute
                rules={[{ required: true, message: "กรุณากรอกนามสกุล!" }]}
              >
                <Input
                  id="randomLastName" // Use a less predictable id attribute
                  type="text" // Generic input type
                  autoComplete="new-password" // A trick to prevent autofill
                  onCopy={(e) => e.preventDefault()} // Prevent copy
                  onCut={(e) => e.preventDefault()} // Prevent cut
                  onPaste={(e) => e.preventDefault()} // Prevent paste
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="เบอร์โทรศัพท์"
                name="PhoneNumber" // Use a less predictable name attribute
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกเบอร์โทรศัพท์ที่ขึ้นต้นด้วย 0 !",
                  },
                  { len: 10, message: "เบอร์โทรศัพท์ต้องมีความยาว 10 ตัวเลข" },
                ]}
              >
                <Input
                  id="randomPhoneNumber" // Use a less predictable id attribute
                  type="tel" // Tel type, which may help prevent cookie-based autofill
                  autoComplete="new-password" // Prevent browser autofill
                  minLength={10}
                  maxLength={10}
                  onChange={handlePhoneChange}
                  onKeyPress={(event) => {
                    const inputValue = (event.target as HTMLInputElement).value;
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                    if (inputValue.length === 0 && event.key !== "0") {
                      event.preventDefault();
                    }
                  }}
                  onCopy={(e) => e.preventDefault()} // Prevent copy
                  onCut={(e) => e.preventDefault()} // Prevent cut
                  onPaste={(e) => e.preventDefault()} // Prevent paste
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
                    style={{ backgroundColor: "#FF7D29" }}
                    loading={isSubmitting}
                    disabled={isSubmitting || phoneNumberInvalid} // Disable if submitting or phone is invalid
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
