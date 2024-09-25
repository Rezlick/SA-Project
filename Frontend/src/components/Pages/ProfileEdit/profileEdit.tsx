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
  Upload,
  Modal,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { EmployeeInterface } from "../../../interfaces/Employee";
import { GetEmployeeByID, UpdateEmployee } from "../../../services/https";
import { useNavigate, Link } from "react-router-dom";

import type { UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";

function ProfileEdit() {
  const navigate = useNavigate();
  const employeeID = localStorage.getItem("employeeID")
  const [messageApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm();

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as Blob);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    setPreviewImage(file.url || file.preview as string);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1));
  };

  const getUserById = async (id: string) => {
    let res = await GetEmployeeByID(id);
    if (res.status === 200) {
      form.setFieldsValue({
        FirstName: res.data.FirstName,
        LastName: res.data.LastName,
        Email: res.data.Email,
        GenderID: res.data.GenderID,
      });

      if (res.data.Profile) {
        setFileList([
          {
            uid: '-1',
            name: 'profile-image.png',
            status: 'done',
            url: res.data.Profile, // Set the profile image URL
          },
        ]);
      }
    } else {
      messageApi.open({
        type: "error",
        content: "ไม่พบข้อมูลผู้ใช้",
      });
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };

  const onFinish = async (values: EmployeeInterface) => {
    values.Profile = fileList[0].thumbUrl;
    const res = await UpdateEmployee(employeeID || "", values);
    if (res.status === 200) {
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
    }
  };

  useEffect(() => {
    if (employeeID) {
      getUserById(employeeID);
    }
  }, [employeeID]);

  return (
    <div>
      {contextHolder}
      <Card>
        <h2>แก้ไขข้อมูลของฉัน</h2>
        <Divider />
        <Form
          name="basic"
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
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
              <Link to ="/changePassword">
                <Button>เปลี่ยนรหัสผ่าน</Button>
              </Link>
            </Col>
          </Row>

          <Row justify="center">
            <Col style={{ marginTop: "40px" }}>
              <Form.Item>
                <Space>
                  <Link to="/">
                    <Button htmlType="button" style={{ marginRight: "10px" }}>
                      ยกเลิก
                    </Button>
                  </Link>

                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{backgroundColor:"#FF7D29"}}
                  >
                    บันทึก
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="profile" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
}

export default ProfileEdit;