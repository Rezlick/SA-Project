import {
  Col,
  Row,
  message,
  Card,
  Statistic,
  Button,
  Spin,
  Empty,
  Badge,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  GetTableStatus,
  GetTables,
  GetTableCapacity,
} from "../../../services/https";
import { TableInterface } from "../../../interfaces/Table";
import { TableCapacityInterface } from "../../../interfaces/TableCapacity";
import { TableStatusInterface } from "../../../interfaces/TableStatus";
import "./booking.css";
import { useNavigate } from "react-router-dom";

function Booking() {
  const [tables, setTables] = useState<TableInterface[]>([]);
  const [tableCaps, setTableCaps] = useState<TableCapacityInterface[]>([]);
  const [tableStatus, setTableStatus] = useState<TableStatusInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tablesRes, statusRes, capsRes] = await Promise.all([
          GetTables(),
          GetTableStatus(),
          GetTableCapacity(),
        ]);

        // Handle responses
        handleResponse(tablesRes, setTables, "tables");
        handleResponse(statusRes, setTableStatus, "table statuses");
        handleResponse(capsRes, setTableCaps, "table capacities");
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Error fetching data from the server");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleResponse = (response: any, setter: Function, entity: string) => {
    if (response.status === 200) {
      setter(response.data);
    } else {
      message.error(response.data.error || `Unable to fetch ${entity}`);
    }
  };

  const handleButtonClick = (table: TableInterface) => {
    const tableID = table.ID;
    const tableCapacityID = table.table_capacity_id;

    if (!tableID || !tableCapacityID) {
      message.warning("Table ID or Table capacity ID is not defined!");
      return;
    }

    const status = tableStatus.find(
      (s) => s.ID === table.table_status_id
    )?.status;

    if (status === "Occupied") {
      message.warning("This table is not available for booking!");
      return;
    }
    if (status === "Cleaning") {
      message.warning("This table is currently being cleaned!");
      return;
    }

    if (table.table_name) {
      navigate(
        `/booking/create?tableId=${tableID}&tableName=${table.table_name}&tableCapacityId=${tableCapacityID}`
      );
    } else {
      message.warning("This table does not have a defined type!");
    }
  };

  const goToBookingList = () => {
    navigate("/booking/booking_list");
  };

  const getStatusClass = (status: string): string => {
    switch (status) {
      case "Available":
        return "button-available";
      case "Occupied":
        return "button-occupied";
      case "Cleaning":
        return "button-cleaning";
      default:
        return "button-default";
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Available":
        return "#8BC34A";
      case "Occupied":
        return "#FFB74D";
      case "Cleaning":
        return "#64B5F6";
      default:
        return "#B0BEC5";
    }
  };

  const formatCapacity = (min?: number, max?: number) => {
    return min !== undefined && max !== undefined ? `${min} - ${max}` : "N/A";
  };

  return (
    <Row gutter={[16, 0]}>
      <Col xs={24}>
        <h1 className="heading-style">เลือกโต๊ะ</h1>
      </Col>
      <Col xs={24}>
        <Card className="card-style" style={{ marginBottom: 16 }}>
          {loading ? (
            <Spin tip="Loading..." className="spinContainer" />
          ) : tables.length === 0 ? (
            <Empty description="No tables available" className="emptyState" />
          ) : (
            <Row gutter={[16, 8]} justify="center" align="middle">
              {tables.map((table) => {
                const tableCapacity = tableCaps.find(
                  (cap) => cap.ID === table.table_capacity_id
                );
                const status = tableStatus.find(
                  (status) => status.ID === table.table_status_id
                );

                return (
                  <Col key={table.ID} xs={24} sm={12} md={8} lg={6}>
                    <Button
                      type="default"
                      className={`tableButton ${getStatusClass(
                        status?.status ?? "Unknown"
                      )}`}
                      onClick={() => handleButtonClick(table)}
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        textAlign: "left",
                      }}
                    >
                      <Statistic
                        className="statistic-container"
                        title={`Table : ${table.table_name || "Unknown"}`}
                        value={formatCapacity(
                          tableCapacity?.min,
                          tableCapacity?.max
                        )}
                        valueStyle={{ color: "#DAA520" }}
                        prefix={<UserOutlined className="icon" />}
                      />
                      <Badge
                        count={status?.status ?? "Unknown"}
                        style={{
                          backgroundColor: getStatusColor(
                            status?.status ?? "Unknown"
                          ),
                          color: "#fff",
                        }}
                      />
                    </Button>
                  </Col>
                );
              })}
            </Row>
          )}
          <Row justify="center" style={{ marginTop: 16 }}>
            <Col xs={24} sm={12} md={4}>
              <Button
                type="primary"
                onClick={goToBookingList}
                className="button-style"
              >
                รายการจองโต๊ะ
              </Button>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
}

export default Booking;
