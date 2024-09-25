import { useEffect, useState } from "react";
import { Space, Button, Col, Row, Divider, Form, Input, Card, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { changePassword } from "../../../services/https";

function ChangePassword() {
  const navigate = useNavigate();
  const employeeID = localStorage.getItem("employeeID"); 
  const [messageApi, contextHolder] = message.useMessage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();

  const handleOldPasswordChange = () => {
    setIsSubmitting(false); 
  };

  const handleNewPasswordChange = () => {
    setIsSubmitting(false); 
  };

  const handleConfirmPasswordChange = () => {
    setIsSubmitting(false); 
  };

  const onFinish = async (values: { OldPassword: string; NewPassword: string; ConfirmPassword: string }) => {
    setIsSubmitting(true)

    const payload = {
      old_password: values.OldPassword,
      new_password: values.NewPassword,
      confirm_password: values.ConfirmPassword,
    };

    try {
      const res = await changePassword(employeeID || "", payload); 
      if (res.status === 200) {
        messageApi.open({
          type: "success",
          content: res.data.message || "เปลี่ยนรหัสผ่านสำเร็จ",
        });
        setTimeout(() => {
          navigate("/profileEdit");
        }, 2000);
      } else {
        messageApi.open({
          type: "error",
          content: res.data.error || "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน",
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์",
      });
    }
  };

  useEffect(() => {
    if (!employeeID) {
      messageApi.open({
        type: "error",
        content: "ไม่พบข้อมูลผู้ใช้",
      });
      navigate("/profileEdit");
    }
  }, [employeeID, navigate, messageApi]);

  return (
    <div>
      {contextHolder}
      <Card>
        <h2>เปลี่ยนรหัสผ่าน</h2>
        <Divider />
        <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={24} md={24}>
              <Form.Item
                label="รหัสผ่านเดิม"
                name="OldPassword"
                rules={[{ required: true, message: "กรุณากรอกรหัสผ่านเดิม !" }]}
              >
                <Input.Password onChange={handleOldPasswordChange}/>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="รหัสผ่านใหม่"
                name="NewPassword"
                rules={[
                  { required: true, message: "กรุณากรอกรหัสผ่านใหม่ !" },
                  { min: 6, message: "รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร" },
                ]}
              >
                <Input.Password onChange={handleNewPasswordChange}/>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="ยืนยันรหัสผ่านใหม่"
                name="ConfirmPassword"
                rules={[{ required: true, message: "กรุณายืนยันรหัสผ่านใหม่ !" }]}
              >
                <Input.Password onChange={handleConfirmPasswordChange}/>
              </Form.Item>
            </Col>

          </Row>

          <Row justify="center">
            <Col style={{ marginTop: "40px" }}>
              <Form.Item>
                <Space>
                  <Link to="/profileEdit">
                    <Button htmlType="button" style={{ marginRight: "10px" }}>
                      ยกเลิก
                    </Button>
                  </Link>

                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    style={{ backgroundColor: "#FF7D29" }}
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

export default ChangePassword;
