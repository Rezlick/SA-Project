import { Button, Card, Form, Input, message, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { SignIn } from "../../../services/https";
import { LoginInterface } from "../../../interfaces/Login";
import logo from "../../../assets/logo.png";
import "./Login.css";
import { useState } from "react";

function LoginPages() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [isSubmitting, setIsSubmitting] = useState(false); // Controls button disable state
  const [form] = Form.useForm();

  // This function gets triggered when user starts typing in the password field
  const handlePasswordChange = () => {
    setIsSubmitting(false);
  };

  const onFinish = async (values: LoginInterface) => {
    setIsSubmitting(true);
    let res = await SignIn(values);

    // Handle the server response
    if (res.status === 200) {
      messageApi.success("เข้าสู่ระบบสำเร็จ");
      localStorage.setItem("isLogin", "true");
      localStorage.setItem("page", "dashboard");
      localStorage.setItem("token_type", res.data.token_type);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("employeeID", res.data.employeeID);
      localStorage.setItem("positionID", res.data.positionID);
      localStorage.setItem("token_expiration", res.data.token_expiration);
      
      const positionID = localStorage.getItem("positionID");
      let role = "";
      if (positionID === '1') {
        role = "IT";
      } else if (positionID === '2') {
        role = "Manager";
      } else {
        role = "Common";
      }

      setTimeout(() => {
        if (role === "IT") {
          navigate("/dashboard");
        } else if (role === "Manager") {
          navigate("/dashboard");
        } else {
          navigate("/member");
        }
      }, 2000);
    } else {
      // If there is an error, show the error message and disable the button
      messageApi.error(res.data.error);
      setIsSubmitting(true); // Button stays disabled until password is changed
    }
  };

  return (
    <>
      {contextHolder}
      <div className="login-container">
        <img src={logo} className="card-logo" />

        <Card className="card-login">
          <Form form={form} name="login" onFinish={onFinish} layout="vertical">
            <Row gutter={[16, 8]} style={{ padding: "30px", justifyContent: "center" }}>
              <h2>ลงชื่อเข้าใช้</h2>

              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, message: "Please input your email!" }]}
                >
                  <Input placeholder="กรุณากรอกอีเมล" className="login-form" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: "Please input your password!" }]}
                >
                  <Input.Password
                    placeholder="กรุณากรอกรหัสผ่าน"
                    className="login-form"
                    onChange={handlePasswordChange} // Re-enable the button when password is changed
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Form.Item>
                  <Button
                    htmlType="submit"
                    className="login-button"
                    disabled={isSubmitting} // Disable the button if isSubmitting is true
                  >
                    ลงชื่อเข้าใช้
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    </>
  );
}

export default LoginPages;
