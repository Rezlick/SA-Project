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
  Upload,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { EmployeeInterface } from "../../../../interfaces/Employee";
import { CreateEmployee, GetPositions, GetGenders, CheckEmail } from "../../../../services/https";
import { useNavigate, Link } from "react-router-dom";
import { GenderInterface } from "../../../../interfaces/Gender";
import { PositionInterface } from "../../../../interfaces/Position";

import type { GetProp, UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

function EmployeeCreate() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();
  const [positions, setPositions] = useState<PositionInterface[]>([]);
  const [genders, setGenders] = useState<GenderInterface[]>([]);
  const [email, setEmail] = useState("");
  const [emailInvalid, setEmailInvalid] = useState(false); 

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(-1));
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const onFinish = async (values: EmployeeInterface) => {
    setIsSubmitting(true); // Start submitting process

    const emailIsValid = await checkEmail(values.Email || "");
    if (!emailIsValid) {
      form.setFieldsValue({ Email: '' });
      setEmailInvalid(true); // Set emailInvalid to true if email is invalid
      setIsSubmitting(false);
      return;
    }

    if (fileList.length === 0) {
      message.error("กรุณาใส่รูปโปรไฟล์!");
      setIsSubmitting(false); // Re-enable button
      return;
    }

    // Continue submission if email is valid
    values.Profile = fileList[0]?.thumbUrl || "";

    const res = await CreateEmployee(values);

    if (res.status === 201) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      setTimeout(() => {
        navigate("/employee");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
      setIsSubmitting(false); // Enable the button again in case of failure
    }
  };

  const getGenders = async () => {
    try {
      const res = await GetGenders(); // Fetch data from the API

      if (res.status === 200) {
        setGenders(res.data); // Set the data from the API response
      } else {
        setGenders([]);
        messageApi.error(res.data.error || "ไม่สามารถดึงข้อมูลได้");
      }
    } catch (error) {
      setGenders([]);
      messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  const getPositions = async () => {
    try {
      const res = await GetPositions(); // Fetch data from the API

      if (res.status === 200) {
        setPositions(res.data); // Set the data from the API response
      } else {
        setPositions([]);
        messageApi.error(res.data.error || "ไม่สามารถดึงข้อมูลได้");
      }
    } catch (error) {
      setPositions([]);
      messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  const checkEmail = async (email: string) => {
    try {
      const res = await CheckEmail(email);

      if (res.status === 200) {
        if (res.data.isValid) {
          setEmailInvalid(false); // Reset invalid flag when email is valid
          return true;
        } else {
          form.setFieldsValue({ Email: '' });
          messageApi.error("อีเมลนี้มีอยู่ในระบบแล้ว");
          return false;
        }
      } else {
        messageApi.error(res.data.error || "ไม่สามารถตรวจสอบอีเมลได้");
        return false;
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการตรวจสอบอีเมล");
      return false;
    }
  };

  useEffect(() => {
    getGenders();
    getPositions();
  }, []);

  // Handle change in email field to reset emailInvalid flag
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailInvalid(false); // Reset emailInvalid flag when email changes
  };

  return (
    <div>
      {contextHolder}
      <Card>
        <h2>ลงทะเบียนพนักงาน</h2>
        <Divider />
        <Form
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          form={form}
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                label="รูปประจำตัว"
                name="Profile"
                valuePropName="fileList"
              >
                <ImgCrop rotationSlider>
                  <Upload
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    fileList={fileList}
                    onChange={onChange}
                    onPreview={onPreview}
                    maxCount={1}
                    multiple={false}
                    listType="picture-card"
                  >
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>อัพโหลด</div>
                    </div>
                  </Upload>
                </ImgCrop>
              </Form.Item>
            </Col>

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
                label="อีเมล"
                name="Email"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกอีเมล!",
                  },
                ]}
              >
                <Input onChange={handleEmailChange} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="รหัสผ่าน"
                name="Password"
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกกรอกรหัสผ่าน!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="เพศ"
                name="GenderID"
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกเพศ!",
                  },
                ]}
              >
                <Select
                  placeholder="กรุณาเลือกเพศ"
                  style={{ width: "100%" }}
                  options={genders.map((gender) => ({
                    value: gender.ID,
                    label: gender.Name,
                  }))}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="ตำแหน่ง"
                name="PositionID"
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกตำแหน่ง!",
                  },
                ]}
              >
                <Select
                  placeholder="เลือกตำแหน่ง"
                  style={{ width: "100%" }}
                  options={positions.map((position) => ({
                    value: position.ID,
                    label: position.Name, 
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row justify="center">
            <Col style={{ marginTop: "40px" }}>
              <Form.Item>
                <Space>
                  <Link to="/employee">
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

export default EmployeeCreate;
