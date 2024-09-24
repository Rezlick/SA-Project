import { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, message, Dropdown, Modal, Progress, Card, Statistic } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined, DashOutlined, AuditOutlined, FileDoneOutlined, UserOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetMembers, DeleteMemberByID, GetMemberCountForToday, GetMemberCountByReceiptToday, GetNetIncomeByMemberToday } from "../../../services/https/index";
import { MemberInterface } from "../../../interfaces/Member";
import { Link, useNavigate } from "react-router-dom";

export default function Member() {
  const navigate = useNavigate();
  const [members, setMembers] = useState<MemberInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const [memberCountForToday, setMemberCountForToday] = useState<number>(0);
  const [memberCountByReceiptToday, setMemberCountByReceiptToday] = useState<number>(0);
  const [netIncomeByMemberToday, setNetIncomeByMemberToday] = useState<number>(0);

  const columns: ColumnsType<MemberInterface> = [
    {
      title: "ลำดับ",
      dataIndex: "ID",
      key: "id",
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
      title: "ระดับสมาชิก",
      key: "Rank",
      render: (record) => <>{record.Rank?.Name || "ไม่มี"}</>,
    },
    {
      title: "แต้มสมาชิก",
      key: "Points",
      width: "25%",
      render: (record) => {
        const currentPoints = record.Point || 0;
        const currentRank = record.Rank?.Name || "ไม่มี";
        let maxPoints = record.Rank?.PointToUpgrade || 0;
    
        // Don't show maxPoints if the rank is "Gold"
        const percentage = maxPoints > 0 ? (currentPoints / maxPoints) * 100 : 100;
    
        return (
          <div style={{ width: 300 }}>
            <Progress
              strokeColor="#FF7D29"
              percent={percentage}
              format={() => (currentRank === "Gold" || currentRank === "ไม่มี") ? `${currentPoints}` : `${currentPoints}/${maxPoints}`}
              size={[300, 20]}
            />
          </div>
        );
      },
    },
    
    {
      title: "สมัครโดย",
      key: "Employee",
      render: (record) => <>{record.Employee?.FirstName || "ไม่มี"}</>,
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
                onClick: () => navigate(`/member/edit/${record.ID}`),
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
    setSelectedMemberId(id);
    setIsModalVisible(true);
  };

  const handleDeleteMember = async () => {
    if (selectedMemberId) {
      try {
        const res = await DeleteMemberByID(selectedMemberId);
        if (res.status === 200) {
          messageApi.success("ลบข้อมูลสำเร็จ");
          await getMembers(); // Refresh the list after deleting a member
        } else {
          messageApi.error(res.data.error || "ไม่สามารถลบข้อมูลได้");
        }
      } catch (error) {
        messageApi.error("เกิดข้อผิดพลาดในการลบข้อมูล");
      } finally {
        setIsModalVisible(false);
        setSelectedMemberId(null);
      }
    }
  };

  const getMembers = async () => {
    try {
      const res = await GetMembers(); // Fetch data from the API

      if (res.status === 200) {
        setMembers(res.data); // Set the data from the API response
      } else {
        messageApi.error(res.data.error || "ไม่สามารถดึงข้อมูลได้");
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  const getNetIncomeByMemberToday = async () => {
    try {
      const res = await GetNetIncomeByMemberToday(); // Fetch data from the API

      if (res.status === 200) {
        setNetIncomeByMemberToday(res.data.netIncome); // Set the data from the API response
      } else {
        messageApi.error(res.data.error || "ไม่สามารถดึงข้อมูลได้");
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  const getMemberCountForToday = async () => {
    try {
      const res = await GetMemberCountForToday(); // Fetch data from the API

      if (res.status === 200) {
        setMemberCountForToday(res.data.memberCount); // Set the data from the API response
      } else {
        messageApi.error(res.data.error || "ไม่สามารถดึงข้อมูลได้");
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  const getMemberCountByReceiptToday = async () => {
    try {
      const res = await GetMemberCountByReceiptToday(); // Fetch data from the API

      if (res.status === 200) {
        setMemberCountByReceiptToday(res.data.memberCount); // Set the data from the API response
      } else {
        messageApi.error(res.data.error || "ไม่สามารถดึงข้อมูลได้");
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  useEffect(() => {
    getMembers();
    getMemberCountForToday();
    getMemberCountByReceiptToday();
    getNetIncomeByMemberToday();
  }, []);

  return (
    <>
      {contextHolder}
      <Row>
        <Col span={12}>
          <h1>ข้อมูลสมาชิก</h1>
        </Col>

        <Col span={12} style={{ textAlign: "end", alignSelf: "center" }}>
          <Space>
            <Link to="/member/create">
              <Button type="primary" icon={<PlusOutlined />} style={{ backgroundColor: "#FF7D29" }}>
                สมัครสมาชิก
              </Button>
            </Link>
          </Space>
        </Col>
        
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <h2>สถิติ วันนี้</h2>
        </Col>

        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Card style={{ backgroundColor: "#F5F5F5" }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                <Card bordered={false} style={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}>
                  <Statistic title="รายได้สุทธิจากสมาชิก" value={`${netIncomeByMemberToday} บาท`} valueStyle={{ color: "black" }} prefix={<AuditOutlined />} />
                </Card>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                <Card bordered={false} style={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}>
                  <Statistic title="สมาชิกที่มาใช้บริการ" value={`${memberCountByReceiptToday} ท่าน`} valueStyle={{ color: "black" }} prefix={<FileDoneOutlined />} />
                </Card>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                <Card bordered={false} style={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}>
                  <Statistic title="การสมัครสมาชิก" value={`${memberCountForToday} ท่าน`} valueStyle={{ color: "black" }} prefix={<UserOutlined />} />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>

      </Row>

      <Divider />

      <div style={{ marginTop: 20 }}>
        <Table
          rowKey="ID"
          columns={columns}
          dataSource={members} // Data from the API
          pagination={{ pageSize: 5 }}
          style={{ width: "100%", overflowX: "auto" }}
        />
      </div>

      <Modal
        title="ยืนยันการลบ"
        visible={isModalVisible}
        onOk={handleDeleteMember}
        onCancel={() => setIsModalVisible(false)}
        okType="danger"
        okText="ลบ"
        cancelText="ยกเลิก"
      >
        <p>คุณแน่ใจหรือว่าต้องการลบข้อมูลนี้?</p>
      </Modal>
    </>
  );
}

