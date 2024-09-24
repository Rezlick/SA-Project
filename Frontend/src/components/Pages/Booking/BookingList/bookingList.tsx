import { Col, Row, Button, Table, message, Modal } from "antd";
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
  const [qrCodeUrl , setQrCodeUrl] = useState<string>("");
  const [ bookingid, setBookingID] = useState<number>(0);

  const fetchQrcode = async (id: number) => {
    setQrCodeUrl( `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
      window.location.origin + `/customer/${id}`
    )}&choe=UTF-8`)
  }

  const fetchBookingData = async () => {
    setLoading(true);
    try {
      const res = await GetBooking();
      if (res.status === 200) {
        setBookingData(res.data);
        setBookingID(res.data.ID);
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
    fetchQrcode(bookingid);

    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, [bookingid]);

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
    Modal.info({
      title: `QR Code for Booking ${id}`,
      content: (
        <div
          style={{
            marginTop: "10px",
            marginLeft: "-2px",
            flexDirection: 'column',
            minHeight: '200px',        
          }}
        >
          <img
            src={qrCodeUrl}
            alt={`QR Code for booking ${id}`}
            style={{ width: '300px', height: '300px' }}
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
              navigate(`/customer/${id}`);
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
    <div className="table-list-container">
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <h1 className="table-list-header">รายการจองโต๊ะ</h1>
        </Col>

        <Col xs={24}>
          <div className="current-time">
            <span>เวลา: </span>
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
                กลับ
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default TableList;
