import {
  Card,
  Row,
  Col,
  Select,
  Button,
  Form,
  message,
  InputNumber,
} from "antd";
import {
  GetBookingByID,
  UpdateBooking,
  GetSoups,
  GetPackages,
  UpdateBookingSoups,
  GetTableCapacity,
} from "../../../../services/https";
import { useState, useEffect } from "react";
import { BookingInterface } from "../../../../interfaces/Booking";
import { BookingSoupInterface } from "../../../../interfaces/BookingSoup";
import { TableCapacityInterface } from "../../../../interfaces/TableCapacity";
import { SoupInterface } from "../../../../interfaces/Soup";
import { PackageInterface } from "../../../../interfaces/Package";
import { useNavigate, useParams } from "react-router-dom";

function EditBookingTable() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const [booking, setBooking] = useState<BookingInterface | null>(null);
  const [tableCapacity, setTableCapacity] =
      useState<TableCapacityInterface | null>(null);
  const [soups, setSoups] = useState<SoupInterface[]>([]);
  const [packages, setPackages] = useState<PackageInterface[]>([]);
  const [tableName, setTableName] = useState<string>("");
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = async (values: any) => {
      if (!id) {
          messageApi.error("รหัสการจองไม่ถูกต้อง!");
          return;
      }

      const selectedSoups = values.soups || [];
      if (selectedSoups.length < 2 || selectedSoups.length > 4) {
          messageApi.error("กรุณาเลือกซุปจำนวน 2 ถึง 4 ชนิด!");
          return;
      }

      setLoading(true);
      try {
          const res = await UpdateBooking(id, {
              number_of_customer: values.number_of_customer,
              package_id: values.package_id,
          });

          if (res && res.status === 200) {
              messageApi.success("การจองอัปเดตเรียบร้อยแล้ว.");

              const soupData: BookingSoupInterface[] = selectedSoups.map(
                  (soupId: number) => ({
                      BookingID: Number(id),
                      SoupID: soupId,
                  })
              );

              const soupRes = await UpdateBookingSoups(String(id), soupData);
              if (soupRes && soupRes.status === 200) {
                  messageApi.success("อัปเดตซุปเรียบร้อยแล้ว.");
              } else {
                  messageApi.error("ไม่สามารถอัปเดตซุปได้.");
              }

              setTimeout(() => navigate("/booking/booking_list"), 2000);
          } else {
              throw new Error("การอัปเดตล้มเหลว.");
          }
      } catch (error) {
          console.error("เกิดข้อผิดพลาดในการอัปเดตการจอง:", error);
          messageApi.error("เกิดข้อผิดพลาดระหว่างการอัปเดตการจอง.");
      } finally {
          setLoading(false);
      }
  };

  const fetchBookingById = async () => {
      if (!id) {
          messageApi.error("รหัสการจองไม่ถูกต้อง!");
          return;
      }

      try {
          const res = await GetBookingByID(id);
          if (res && res.data) {
              setBooking(res.data);
              setTableName(res.data.table?.table_name ?? "ไม่ระบุ");
              form.setFieldsValue({
                  number_of_customer: res.data.number_of_customer,
                  package_id: res.data.package_id,
                  soups: res.data.soups.map((soup: SoupInterface) => soup.ID) || [],
              });

              await fetchTableCapacity(res.data.table?.table_capacity_id);
          } else {
              throw new Error("ไม่สามารถดึงข้อมูลการจองได้");
          }
      } catch (error) {
          const errorMessage =
              (error as Error).message || "เกิดข้อผิดพลาดที่ไม่รู้จัก";
          console.error("เกิดข้อผิดพลาดในการดึงข้อมูลการจอง:", error);
          messageApi.error("ไม่สามารถดึงข้อมูลการจองได้: " + errorMessage);
      }
  };

  const fetchTableCapacity = async (tableCapacityId: number) => {
      try {
          const res = await GetTableCapacity();
          if (res && res.data) {
              const capacity = res.data.find(
                  (cap: TableCapacityInterface) => cap.ID === tableCapacityId
              );
              setTableCapacity(capacity);
          } else {
              throw new Error("ไม่สามารถดึงข้อมูลความจุของโต๊ะได้");
          }
      } catch (error) {
          console.error("เกิดข้อผิดพลาดในการดึงข้อมูลความจุของโต๊ะ:", error);
          messageApi.error("ไม่สามารถดึงข้อมูลความจุของโต๊ะได้");
      }
  };

  const fetchSoups = async () => {
      try {
          const res = await GetSoups();
          if (res.status === 200) {
              setSoups(res.data);
          } else {
              setSoups([]);
              messageApi.error(res.data.error || "ไม่สามารถดึงซุปได้");
          }
      } catch (error) {
          setSoups([]);
          messageApi.error("เกิดข้อผิดพลาดในการดึงซุป");
      }
  };

  const fetchPackages = async () => {
      try {
          const res = await GetPackages();
          if (res.status === 200) {
              setPackages(res.data);
          } else {
              setPackages([]);
              messageApi.error(res.data.error || "ไม่สามารถดึงแพ็กเกจได้.");
          }
      } catch (error) {
          setPackages([]);
          messageApi.error("เกิดข้อผิดพลาดในการดึงแพ็กเกจ.");
      }
  };

  const renderSoupFields = () => {
      const bookingSoupIDs = booking?.soups || [];

      if (bookingSoupIDs.length === 0) {
          return (
              <Col xs={24}>
                  <p>ไม่มีซุปสำหรับการจองนี้</p>
              </Col>
          );
      }

      return (
          <>
              {bookingSoupIDs.map((soupID, index) => (
                  <Col xs={24} sm={24} md={12} key={index}>
                      <Form.Item
                          label={`ซุป ${index + 1}`}
                          name={["soups", index]}
                          rules={[
                              {
                                  required: index < 2,
                                  message: "กรุณาเลือก 2 หรือ 4 ซุป!",
                              },
                          ]}
                      >
                          <Select
                              placeholder="เลือกซุป"
                              options={soups.map((soupOption) => ({
                                  value: soupOption.ID,
                                  label: soupOption.name,
                              }))}
                              defaultValue={soupID}
                          />
                      </Form.Item>
                  </Col>
              ))}
          </>
      );
  };

  const handleBackButtonClick = () => {
      navigate("/booking/booking_list");
  };

  useEffect(() => {
      fetchSoups();
      fetchPackages();
      fetchBookingById();
  }, [id]);

  return (
      <>
          {contextHolder}
          <Row gutter={[16, 16]} justify="center" style={{ marginBottom: "20px" }}>
              <Col xs={24}>
                  <h1 className="heading-style">แก้ไขการจองสำหรับโต๊ะ {tableName}</h1>
              </Col>
          </Row>
          <Row gutter={[16, 16]} justify="center">
              <Col xs={24} sm={24} md={16} lg={14} xl={12}>
                  <Card className="card-style">
                      <Form form={form} layout="vertical" onFinish={onFinish}>
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
                                              min: tableCapacity?.min || 1,
                                              max: tableCapacity?.max || 10,
                                              message: `จำนวนลูกค้าสามารถกรอกได้ตั้งแต่ ${
                                                  tableCapacity?.min || 1
                                              } ถึง ${tableCapacity?.max || 10}!`,
                                          },
                                      ]}
                                  >
                                      <InputNumber
                                          placeholder="จำนวนลูกค้า"
                                          min={tableCapacity?.min || 1}
                                          max={tableCapacity?.max || 10}
                                          step={1}
                                          style={{ width: "100%" }}
                                      />
                                  </Form.Item>
                              </Col>
                              <Col xs={24} sm={24} md={12}>
                                  <Form.Item
                                      label="แพ็กเกจ"
                                      name="package_id"
                                      rules={[
                                          { required: true, message: "กรุณาเลือกแพ็กเกจ!" },
                                      ]}
                                  >
                                      <Select
                                          placeholder="เลือกแพ็กเกจ"
                                          className="select-style"
                                          options={packages.map((pkg) => ({
                                              value: pkg.ID,
                                              label: pkg.name,
                                          }))}
                                      />
                                  </Form.Item>
                              </Col>
                          </Row>
                          <Row gutter={[16, 16]}>{renderSoupFields()}</Row>
                          <Row justify="space-between">
                              <Col>
                                  <Button
                                      type="default"
                                      onClick={handleBackButtonClick}
                                      className="back-button-style"
                                  >
                                      ย้อนกลับ
                                  </Button>
                              </Col>
                              <Col>
                                  <Button
                                      type="primary"
                                      htmlType="submit"
                                      loading={loading}
                                      className="button-style"
                                  >
                                      บันทึกการจอง
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

export default EditBookingTable;
