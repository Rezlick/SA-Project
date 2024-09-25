import { Col, Row, Button, Table, message, Modal, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetBooking, DeleteBookingByID } from "../../../../services/https";
import { BookingInterface } from "../../../../interfaces/Booking";
import {
  EditOutlined,
  DeleteOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";

function TableList() {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<BookingInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [bookingid, setBookingID] = useState<number>(0);

  const fetchQrcode = async (id: number) => {
    setQrCodeUrl(
      `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
        window.location.origin + `/customer/${id}`
      )}&choe=UTF-8`
    );
  };

  const fetchBookingData = async () => {
    setLoading(true);
    try {
      const res = await GetBooking();
      if (res.status === 200) {
        setBookingData(res.data);
        setBookingID(res.data.ID);
      } else {
        message.error(res.data.error || "ไม่สามารถดึงข้อมูลได้");
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingData();
    fetchQrcode(bookingid);
  }, [bookingid]);

  const handleButtonClick = () => {
    navigate("/booking");
  };

  const handleEdit = (id: number) => {
    navigate(`/booking/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "ยืนยันการลบ",
      content: "คุณแน่ใจหรือไม่ว่าต้องการลบการจองนี้?",
      centered: true,
      onOk: async () => {
        try {
          await DeleteBookingByID(id.toString());
          message.success("ลบการจองสำเร็จ");
          fetchBookingData();
        } catch (error) {
          message.error("ลบการจองไม่สำเร็จ");
        }
      },
    });
  };

  const handleQrCodeClick = (id: number) => {
    Modal.info({
      title: `QR Code สำหรับการจอง ${id}`,
      content: (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "250px",
            margin: "10px",
          }}
        >
          <img
            src={qrCodeUrl}
            alt={`QR Code สำหรับการจอง ${id}`}
            style={{
              width: "300px",
              height: "300px",
              marginLeft: "-40px",
              marginBottom: "20px",
            }}
          />
        </div>
      ),
      footer: (
        <Row justify="space-between" style={{ width: "100%" }}>
          <Col>
            <Button key="cancel" onClick={() => Modal.destroyAll()}>
              ยกเลิก
            </Button>
          </Col>
          <Col style={{ textAlign: "right" }}>
            <Button
              key="open"
              type="primary"
              onClick={() => {
                Modal.destroyAll();
                navigate(`/customer/${id}`);
              }}
            >
              ไปยังหน้าสั่งอาหาร
            </Button>
          </Col>
        </Row>
      ),
    });
  };

  const columns: ColumnsType<BookingInterface> = [
    {
      title: "ID",
      dataIndex: "ID",
      key: "ID",
      sorter: (a, b) => (a.ID ?? 0) - (b.ID ?? 0),
    },
    {
      title: "โต๊ะ",
      key: "table_id",
      render: (record) => <>{record.table?.table_name ?? "N/A"}</>,
    },
    {
      title: "จำนวนลูกค้า",
      dataIndex: "number_of_customer",
      key: "number_of_customer",
    },
    {
      title: "ซุป",
      dataIndex: "soups",
      key: "soups",
      render: (soups) =>
        Array.isArray(soups)
          ? soups.map((soup) => soup.name).join(", ")
          : "N/A",
    },
    {
      title: "แพ็กเกจ",
      key: "package_name",
      render: (record) => <>{record.package?.name ?? "N/A"}</>,
    },
    {
      title: "พนักงาน",
      key: "employee_name",
      render: (record) => <>{record.employee?.FirstName ?? "N/A"}</>,
    },
    {
      title: "QrCode",
      key: "qrcode",
      render: (_, record) => (
        <div>
          <Button
            type="link"
            icon={<QrcodeOutlined />}
            danger
            onClick={() => handleQrCodeClick(record.ID ?? 0)}
            className="table-list-delete-button"
          />
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.ID ?? 0)}
            className="table-list-edit-button"
          />
          <Button
            type="link"
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.ID ?? 0)}
            className="table-list-delete-button"
          />
        </div>
      ),
    },
  ];
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24}>
        <h1 className="heading-style">รายการจองโต๊ะ</h1>
      </Col>
      <Col xs={24}>
        <Table
          dataSource={bookingData}
          columns={columns}
          pagination={{ pageSize: 8 }}
          bordered
          title={() => "รายการจอง"}
          loading={loading}
          className="table-list"
          rowKey="ID"
          rowClassName="custom-row"
        />
      </Col>
      <Col xs={24}>
        <Row justify="center">
          <Col>
            <Tooltip title="กลับไปยังหน้าเลือกโต๊ะ">
              <Button
                type="primary"
                onClick={handleButtonClick}
                className="back-button-style"
              >
                กลับ
              </Button>
            </Tooltip>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default TableList;
