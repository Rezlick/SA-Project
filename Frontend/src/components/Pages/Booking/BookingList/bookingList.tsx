import { Col, Row, Button, Table, message, Modal, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetBooking, DeleteBookingByID } from "../../../../services/https";
import { BookingInterface } from "../../../../interfaces/Booking";
import { EditOutlined, DeleteOutlined, QrcodeOutlined } from "@ant-design/icons";

function TableList() {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<BookingInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [qrCodeLoaded, setQrCodeLoaded] = useState(false);

  const fetchBookingData = async () => {
    setLoading(true);
    try {
      const res = await GetBooking();
      if (res.status === 200) {
        setBookingData(res.data);
      } else {
        message.error(res.data.error || "Unable to fetch data");
      }
    } catch (error) {
      message.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingData();

    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleButtonClick = () => {
    navigate("/booking");
  };

  const handleEdit = (id: number) => {
    navigate(`/booking/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: "Are you sure you want to delete this booking?",
      centered: true,
      onOk: async () => {
        try {
          await DeleteBookingByID(id.toString());
          message.success("Booking deleted successfully");
          fetchBookingData();
        } catch (error) {
          message.error("Failed to delete booking");
        }
      },
    });
  };

  const handleQrCodeClick = (id: number) => {
    setLoading(true); // เริ่มสถานะการโหลด

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
      window.location.origin + `/customer/${id}`
    )}&choe=UTF-8`;

    Modal.info({
      title: `QR Code for Booking ${id}`,
      content: (
        <div style={{ marginTop: "10px", textAlign: "center" }}>
          {loading && <Spin size="large" />} {/* แสดง Spin ระหว่างโหลด */}
          <img
            src={qrCodeUrl}
            alt={`QR Code for booking ${id}`}
            style={{ width: '300px', height: '300px', display: qrCodeLoaded ? 'block' : 'none' }}
            onLoad={() => {
              setLoading(false); // เมื่อ QR code โหลดเสร็จแล้ว
              setQrCodeLoaded(true); // ตั้งค่าให้ QR code แสดง
            }}
          />
        </div>
      ),
      footer: (
        <div style={{ textAlign: 'right', marginTop: "20px" }}>
          <Button
            key="open"
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => {
              Modal.destroyAll();
              navigate(`/customer/${id}`); // ส่ง booking_id ไปยังหน้าลูกค้า
            }}
          >
            ไปยังหน้าสั่งอาหาร
          </Button>
          <Button key="ok" onClick={() => Modal.destroyAll()}>
            OK
          </Button>
        </div>
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
      title: "Table",
      key: "table_id",
      render: (record) => <>{record.table?.table_name ?? "N/A"}</>,
    },
    {
      title: "Number of Customers",
      dataIndex: "number_of_customer",
      key: "number_of_customer",
    },
    {
      title: "Soups",
      dataIndex: "soups",
      key: "soups",
      render: (soups) =>
        Array.isArray(soups)
          ? soups.map((soup) => soup.name).join(", ")
          : "N/A",
    },
    {
      title: "Package",
      key: "package_name",
      render: (record) => <>{record.package?.name ?? "N/A"}</>,
    },
    {
      title: "Employee",
      key: "employee_name",
      render: (record) => <>{record.employee?.FirstName ?? "N/A"}</>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div>
          <Button
            type="link"
            icon={<QrcodeOutlined />}
            danger
            onClick={() => handleQrCodeClick(record.ID ?? 0)}
            className="table-list-delete-button"
          />
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
    <div className="table-list-container">
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <h1 className="table-list-header">Booking List</h1>
        </Col>

        <Col xs={24}>
          <div className="current-time">
            <span>Current Time: </span>
            <span className="time-display">{currentTime}</span>
          </div>
          <Table
            dataSource={bookingData}
            columns={columns}
            pagination={{ pageSize: 4 }}
            bordered
            title={() => "Booking List"}
            loading={loading}
            className="table-list"
            rowKey="ID"
            rowClassName="custom-row"
          />
        </Col>

        <Col xs={24}>
          <Row justify="center" style={{ marginTop: "20px" }}>
            <Col>
              <Button
                type="primary"
                onClick={handleButtonClick}
                className="table-list-back-button"
              >
                Back
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default TableList;
