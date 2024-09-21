import { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, message, Dropdown, Modal } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, DashOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetEmployees, DeleteEmployeeByID } from "../../../services/https";
import { EmployeeInterface } from "../../../interfaces/Employee";
import { Link, useNavigate } from "react-router-dom";
import "../Employee/employee.css";

function Employee() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<EmployeeInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  const columns: ColumnsType<EmployeeInterface> = [
    {
      title: "ลำดับ",
      dataIndex: "ID",
      key: "id",
    },
    {
      title: "รูปประจำตัว",
      dataIndex: "Profile",
      key: "profile",
      width: "15%",
      render: (text, record, index) => (
        <img src={record.Profile} className="profile" />
      )
    },
    {
      title: "ชื่อ",
      dataIndex: "FirstName",
      key: "first_name",
    },
    {
      title: "นามสกุล",
      dataIndex: "LastName",
      key: "last_name",
    },
    {
      title: "อีเมล",
      dataIndex: "Email",
      key: "email",
    },
    {
      title: "เพศ",
      key: "gender",
      render: (record) => <>{record.Gender?.Name || "N/A"}</>,
    },
    {
      title: "ตำแหน่ง",
      key: "position",
      render: (record) => <>{record.Position?.Name || "N/A"}</>,
    },
    {
      title: "",
      render: (record) => (
        <Dropdown
          menu={{
            items: [
              {
                label: "แก้ไขข้อมูล",
                key: "1",
                icon: <EditOutlined />,
                onClick: () => navigate(`/employee/edit/${record.ID}`),
              },
              {
                label: "ลบข้อมูล",
                key: "2",
                icon: <DeleteOutlined />,
                onClick: () => showDeleteConfirmModal(record.ID),
                danger: true,
              },
            ],
          }}
        >
          <Button type="primary" icon={<DashOutlined />} size={"small"} className="btn" />
        </Dropdown>
      ),
    },
  ];

  const showDeleteConfirmModal = (id: string) => {
    setSelectedEmployeeId(id);
    setIsModalVisible(true);
  };

  const handleDeleteEmployee = async () => {
    if (selectedEmployeeId) {
      try {
        const res = await DeleteEmployeeByID(selectedEmployeeId);

        if (res.status === 200) {
          messageApi.success("ลบข้อมูลสำเร็จ");
          await getEmployees(); // Refresh the list after deleting an employee
        } else {
          messageApi.error(res.data.error || "ไม่สามารถลบข้อมูลได้");
        }
      } catch (error) {
        messageApi.error("เกิดข้อผิดพลาดในการลบข้อมูล");
      } finally {
        setIsModalVisible(false);
        setSelectedEmployeeId(null);
      }
    }
  };

  const getEmployees = async () => {
    try {
      const res = await GetEmployees(); // Fetch data from the API

      if (res.status === 200) {
        setEmployees(res.data); // Set the data from the API response
      } else {
        setEmployees([]);
        messageApi.error(res.data.error || "ไม่สามารถดึงข้อมูลได้");
      }
    } catch (error) {
      setEmployees([]);
      messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  useEffect(() => {
    getEmployees(); 
  }, []);

  return (
    <>
      {contextHolder}
      <Row>
        <Col span={12}>
          <h2>ข้อมูลพนักงาน</h2>
        </Col>

        <Col span={12} style={{ textAlign: "end", alignSelf: "center" }}>
          <Space>
            <Link to="/employee/create">
              <Button type="primary" icon={<PlusOutlined />} style={{ backgroundColor: "#FF7D29" }}>
                ลงทะเบียน
              </Button>
            </Link>
          </Space>
        </Col>
      </Row>

      <Divider />

      <div style={{ marginTop: 20 }}>
        <Table
          rowKey="ID"
          columns={columns}
          dataSource={employees} // Data from the API
          pagination={{ pageSize: 4 }}
          style={{ width: "100%", overflowX: "auto" }}
        />
      </div>

      <Modal
        title="ยืนยันการลบ"
        visible={isModalVisible}
        onOk={handleDeleteEmployee}
        onCancel={() => setIsModalVisible(false)}
        okText="ลบ"
        cancelText="ยกเลิก"
      >
        <p>คุณแน่ใจหรือว่าต้องการลบข้อมูลนี้?</p>
      </Modal>
    </>
  );
}

export default Employee;
