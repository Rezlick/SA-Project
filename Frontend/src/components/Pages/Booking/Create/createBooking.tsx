import {
  Card,
  Row,
  Col,
  InputNumber,
  Select,
  Button,
  Form,
  message,
  Modal,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import {
  GetSoups,
  GetPackages,
  CreateBooking,
  CreateBookingSoup,
  UpdateTableStatus,
  GetTables,
  GetTableCapacity,
} from "../../../../services/https";
import { BookingInterface } from "../../../../interfaces/Booking";
import { SoupInterface } from "../../../../interfaces/Soup";
import { BookingSoupInterface } from "../../../../interfaces/BookingSoup";
import { PackageInterface } from "../../../../interfaces/Package";
import { TableInterface } from "../../../../interfaces/Table";
import { TableCapacityInterface } from "../../../../interfaces/TableCapacity";
import { useNavigate, useLocation } from "react-router-dom";

function CreateBookingTable() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  const queryParams = new URLSearchParams(location.search);
  const tableId = queryParams.get("tableId") || "";
  const tableName = queryParams.get("tableName") || "ไม่พบข้อมูลโต๊ะ";

  const [soups, setSoups] = useState<SoupInterface[]>([]);
  const [packages, setPackages] = useState<PackageInterface[]>([]);
  const [tables, setTables] = useState<TableInterface[]>([]);
  const [tableCaps, setTableCaps] = useState<TableCapacityInterface[]>([]);
  const [loadingSoups, setLoadingSoups] = useState<boolean>(false);
  const [loadingPackages, setLoadingPackages] = useState<boolean>(false);
  const [loadingTables, setLoadingTables] = useState<boolean>(false);

  const accountid = localStorage.getItem("employeeID");

  const fetchData = async () => {
    try {
      const [soupsRes, packagesRes, tablesRes, capsRes] = await Promise.all([
        GetSoups(),
        GetPackages(),
        GetTables(),
        GetTableCapacity(),
      ]);
      return { soupsRes, packagesRes, tablesRes, capsRes };
    } catch (error) {
      throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  useEffect(() => {
    if (!tableId) {
      message.error("ไม่พบไอดีของโต๊ะ โปรดลองอีกครั้ง");
      navigate("/booking");
      return;
    }

    const loadData = async () => {
      setLoadingSoups(true);
      setLoadingPackages(true);
      setLoadingTables(true);

      try {
        const { soupsRes, packagesRes, tablesRes, capsRes } = await fetchData();

        if (soupsRes.status === 200) setSoups(soupsRes.data);
        if (packagesRes.status === 200) setPackages(packagesRes.data);
        if (tablesRes.status === 200) setTables(tablesRes.data);
        if (capsRes.status === 200) setTableCaps(capsRes.data);
      } catch (error) {
        message.error("เกิดข้อผิดพลาดในการดึงข้อมูล โปรดลองอีกครั้ง");
      } finally {
        setLoadingSoups(false);
        setLoadingPackages(false);
        setLoadingTables(false);
      }
    };

    loadData();
  }, [tableId, navigate]);

  const updateTableStatus = async (tableId: number, statusId: number) => {
    try {
      const response = await UpdateTableStatus(tableId, {
        table_status_id: statusId,
      });
      if (response.status !== 200) {
        throw new Error("เกิดข้อผิดพลาดในการอัพเดทสถานะโต๊ะ");
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการอัพเดทสถานะโต๊ะ");
    }
  };

  const fetchTableCapacityLimits = () => {
    const table = tables.find((t) => t.ID === Number(tableId));
    if (!table) return { min: 1, max: 10 };
    const capacity = tableCaps.find(
      (cap) => cap.ID === table.table_capacity_id
    );
    return capacity
      ? { min: capacity.min || 1, max: capacity.max || 10 }
      : { min: 1, max: 10 };
  };

  const onFinish = async (values: any) => {
    const { min, max } = fetchTableCapacityLimits();
    if (values.number_of_customer < min || values.number_of_customer > max) {
      message.error(`จำนวนลูกค้าต้องอยู่ในช่วง ${min} ถึง ${max}!`);
      return;
    }

    Modal.confirm({
      title: "ยืนยันรายการ",
      content: "คุณต้องการยืนยันการทำรายการนี้หรือไม่?",
      centered: true,
      onOk: async () => {
        const tableIdNumber = Number(tableId);
        if (!tableId || isNaN(tableIdNumber) || tableIdNumber <= 0) {
          message.error("ไอดีไม่ถูกต้องหรือไม่พบ");
          return;
        }
        if (!accountid) {
          message.error("ไม่พบไอดีผู้ใช้ โปรดเข้าสู่ระบบอีกครั้ง");
          return;
        }

        const bookingPayload: BookingInterface = {
          number_of_customer: values.number_of_customer,
          package_id: values.package_id,
          table_id: tableIdNumber,
          employee_id: Number(accountid),
        };

        try {
          const bookingRes = await CreateBooking(bookingPayload);
          const bookingId = bookingRes?.booking_id;
          if (!bookingId)
            throw new Error("ไม่พบไอดีการจอง");

          const selectedSoupIds = [
            values.soup1,
            values.soup2,
            values.soup3,
            values.soup4,
          ].filter((soup): soup is number => typeof soup === "number");

          if (selectedSoupIds.length > 0) {
            const bookingSoupsPayload: BookingSoupInterface[] =
              selectedSoupIds.map((soupId) => ({
                booking_id: bookingId,
                soup_id: soupId,
              }));

            await Promise.all(bookingSoupsPayload.map(CreateBookingSoup));
          }

          await updateTableStatus(tableIdNumber, 2);
          message.success("ทำรายการสำเร็จ");
          navigate("/booking/booking_list");
        } catch (error) {
          message.error("เกิดข้อผิดพลาดในการจอง! โปรดลองอีกครั้ง");
        }
      },
      onCancel: () => {
        message.info("รายการถูกยกเลิก");
      },
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error("กรุณากรอกฟอร์มให้ครบถ้วน!");
  };

  const handleBackButtonClick = () => {
    navigate("/booking");
  };

  const renderSoupFields = () => {
    const table = tables.find((t) => t.ID === Number(tableId));
    const numberOfSoups = table?.table_capacity_id === 1 ? 2 : 4;

    return Array.from({ length: numberOfSoups }, (_, i) => (
      <Col xs={24} sm={24} md={12} key={`soup${i + 1}`}>
        <Form.Item
          label={`ซุป ${i + 1}`}
          name={`soup${i + 1}`}
          rules={[{ required: true, message: "กรุณาเลือกโต๊ะ!" }]}
        >
          <Select
            placeholder="เลือกซุป"
            className="select-style"
            options={soups.map((soup) => ({
              value: soup.ID,
              label: soup.name,
            }))}
            loading={loadingSoups}
          />
        </Form.Item>
      </Col>
    ));
  };

  return (
    <>
      <Row gutter={[16, 16]} justify="center" style={{ marginBottom: "20px" }}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <h1 className="heading-style">จองโต๊ะ {tableName}</h1>
        </Col>
      </Row>
      <Row gutter={[16, 16]} justify="center" style={{ marginTop: "0px" }}>
        <Col xs={24} sm={24} md={16} lg={14} xl={12}>
          <Card className="card-style">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label="จำนวนลูกค้า"
                    name="number_of_customer"
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอกจำนวนลูกค้า!",
                      },
                      {
                        type: "number",
                        min: fetchTableCapacityLimits().min || 1,
                        max: fetchTableCapacityLimits().max || 10,
                        message: `จำนวนลูกค้าสามารถกรอกได้ตั้งแต่ ${
                          fetchTableCapacityLimits().min || 1
                        } ถึง ${fetchTableCapacityLimits().max || 10}!`,
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder="จำนวนลูกค้า"
                      min={fetchTableCapacityLimits().min || 1}
                      max={fetchTableCapacityLimits().max || 10}
                      step={1}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label="แพ็กเกจ"
                    name="package_id"
                    rules={[{ required: true, message: "กรุณาเลือกแพ็กเกจ!" }]}
                  >
                    <Select
                      placeholder="เลือกแพ็กเกจ"
                      className="select-style"
                      options={packages.map((pkg) => ({
                        value: pkg.ID,
                        label: pkg.name,
                      }))}
                      loading={loadingPackages}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>{renderSoupFields()}</Row>
              <Row justify="space-between">
                <Col>
                  <Tooltip title="กลับไปยังหน้าเลือกโต๊ะ">
                    <Button
                      type="primary"
                      onClick={handleBackButtonClick}
                      className="back-button-style"
                    >
                      กลับ
                    </Button>
                  </Tooltip>
                </Col>
                <Col>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="button-style"
                  >
                    ยืนยัน
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default CreateBookingTable;
