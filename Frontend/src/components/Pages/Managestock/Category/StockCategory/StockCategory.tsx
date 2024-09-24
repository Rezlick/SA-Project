import { useState, useEffect } from "react";
import {
  Layout,
  Input,
  Button,
  Form,
  Select,
  DatePicker,
  Table,
  Row,
  Col,
  Modal,
  Divider,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import moment, { Moment } from "moment"; //npm install moment
import { useNavigate } from "react-router-dom";
import { StockInterface } from "../../../../../interfaces/Stock.ts";
import useSupplierName from "../../../../../Hook/useSupplierName.tsx";
import { AddStock } from "../../../../../services/https/index.tsx";
import { GetStock } from "../../../../../services/https";
import "./StockCategory.css";

const { Header, Content } = Layout;
const { Option } = Select;

export default function StockCategory({
  categoryTitle,
  initialData,
  categoryID,
  path,
}) {
  const employeeID = localStorage.getItem("employeeID") || "No ID found";
  // console.log("employeeID",employeeID);

  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false); // แสดง/ไม่แสดง ของ form หลัก
  const [form] = Form.useForm();
  //const [data] = useState(initialData); //รับข้อมูลมา
  const [query, setQuery] = useState(""); // การค้นหา
  const [filteredData, setFilteredData] = useState(initialData); // ข้อมูลที่ฟิวเตอร์แล้ว
  const [editingRecord, setEditingRecord] = useState(null); // ข้อมูลที่กำลังแก้ไข
  const suppliersNameData = useSupplierName();
  const [suppliers, setSuppliers] = useState<{ id: number; name: string }[]>(
    []
  ); // รายชื่อผู้จัดจำหน่าย
  const [products, setProducts] = useState([]); // รายชื่อสินค้า
  const [formDisabled, setFormDisabled] = useState(false); //
  const [open, setOpen] = useState(false); //  42 and 43 เป็นลูกเล่นเปิดปิด form
  const [searchTimeout, setSearchTimeout] = useState(null); //ดีเลเวลานะจ๊ะ
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchStockData = async () => {
    try {
      const res = await GetStock(categoryID);
      if (res && res.data) {
        const data = res.data.data;
        console.log("API Response:", data);
        if (Array.isArray(data)) {
          const transformedData = transformStockData(data);
          console.log("Transformed Data:", transformedData);
          setFilteredData(transformedData);
        } else {
          console.error("API Response Error: Data is not an array", data);
          setFilteredData([]);
        }
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
      setFilteredData([]);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, [categoryID]);

  useEffect(() => {
    if (suppliersNameData && suppliersNameData.length > 0) {
      setSuppliers(
        suppliersNameData.map(
          (supplier: { SupplierID: number; supplier_name: string }) => ({
            id: supplier.SupplierID,
            name: supplier.supplier_name,
          })
        )
      );
    }
  }, [suppliersNameData]);

  useEffect(() => {
    if (filteredData.length > 0) {
      // กรองสินค้าที่ไม่ซ้ำจากข้อมูลที่กรองแล้ว
      const uniqueCodes = new Set();
      const mappedProducts = filteredData.reduce((acc, item) => {
        if (!uniqueCodes.has(item.code)) {
          uniqueCodes.add(item.code);
          acc.push({ code: item.code, name: item.name });
        }
        return acc;
      }, []);
      setProducts(mappedProducts);
    }
  }, [filteredData]);

  const handleQueryChange = (value) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      const lowercasedQuery = value.toLowerCase();

      const filtered = initialData.filter((item) => {
        const matchesName = item.name.toLowerCase().includes(lowercasedQuery);
  
        const matchesStock = !isNaN(value) && item.stock.toString().includes(value);
  
        return matchesName || matchesStock;
      });

      console.log("filtered",filtered);
      
      setFilteredData(filtered);
    }, 500); // หน่วงเวลา 500ms

    setSearchTimeout(timeout);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    handleQueryChange(value);
  };

  const handleBackClick = () => {
    navigate("/ManageStock");
  };

  const handleProductSelect = (value: any) => {
    const selectedProduct = products.find((product) => product.code === value); // ฟังก์ชันจัดการเมื่อเลือกสินค้า
    if (selectedProduct) {
      form.setFieldsValue({
        code: selectedProduct.code,
        name: selectedProduct.name,
      });
      setFormDisabled(true);
    }
  };

  const handleEditClick = (record: any) => {
    console.log("record", record);
    setEditingRecord(record);

    navigate(`/ManageStock/${path}/EditStock`, {
      state: { record, path, suppliers, categoryID },
    });
  };

  const handleAdd = () => {
    form.resetFields();
    setOpen(false);
    setIsAdding(true);
  };

  const handleFinish = async (values: any) => {
    setIsModalVisible(false);
    const newItem: StockInterface = {
      category_id: categoryID,
      product_code_id: values.code,
      product_name: values.name,
      quantity: Number(values.quantity),
      price: Number(values.price),
      date_in: values.importDate.format("YYYY-MM-DDTHH:mm:ssZ"),
      expiration_date: values.expiryDate.format("YYYY-MM-DDTHH:mm:ssZ"),
      supplier_id: Number(values.supplier), // แปลงเป็น number
      employee_id: Number(employeeID),
    };

    try {
      const result = await AddStock(newItem);

      if (result) {
        fetchStockData();
        setIsAdding(false);
        form.resetFields();
      }
    } catch (error) {
      console.error("Error in submitting stock:", error);
      Modal.error({
        title: "Error",
        content: "มีข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองอีกครั้ง",
      });
    }
  };

  const openForm = () => {
    setIsAdding(true);
    setFormDisabled(false);
    form.resetFields();
    setOpen(true);
    form.setFieldsValue({ code: "เพิ่มสินค้าใหม่" });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    { title: "รหัสรายการ", dataIndex: "stock", key: "stock" },
    { title: "รหัสสินค้า", dataIndex: "code", key: "code" },
    { title: "ชื่อสินค้า", dataIndex: "name", key: "name" },
    { title: "จำนวน", dataIndex: "quantity", key: "quantity" },
    { title: "ราคา (บาท)", dataIndex: "price", key: "price" },
    { title: "ผู้จัดจำหน่าย", dataIndex: "supplier", key: "supplier" },
    { title: "วันที่นำเข้า", dataIndex: "importDate", key: "importDate" },
    { title: "วันหมดอายุ", dataIndex: "expiryDate", key: "expiryDate" },
    { title: "พนักงาน", dataIndex: "employees", key: "employees" },
    {
      title: "สถานะ",
      key: "status",
      render: (record) => {
        const isExpired = moment().isAfter(moment(record.expiryDate, "MM/DD/YYYY, HH:mm:ss"));
        return (
          <span
            style={{
              display: "inline-block",
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: isExpired ? "red" : "green",
            }}
          />
        );
      },
    },
    {
      title: "แก้ไขข้อมูล",
      key: "activity",
      render: (record) => (
        <Button onClick={() => handleEditClick(record)}>
          <EditOutlined />
        </Button>
      ),
    },
  ];
  const [filterType, setFilterType] = useState(null);
  const [dateRange, setDateRange] = useState<[Moment, Moment] | null>(null);
  const [selectValue, setSelectValue] = useState(null);

  const handleSelectChange = (value) => {
    if (value === "cancel") {
      // รีเซ็ต filterType และ dateRange
      setFilterType(null);
      setDateRange(null);
      setFilteredData(initialData); // รีเซ็ตข้อมูลกลับเป็นข้อมูลเริ่มต้น
      setSelectValue(null);
      
      return; // ออกจากฟังก์ชัน
    }
    console.log("handleSelectChange", value);

    setFilterType(value);

    const today = moment();

    if (value === "lastweek") {
      const lastWeekStart = today.clone().subtract(7, "days").startOf("day");
        console.log("lastWeekStart:", lastWeekStart);
        setDateRange([lastWeekStart, today.endOf("day")]);
        filterDataByDate(lastWeekStart, today.endOf("day"));
    } else {
      setDateRange(null);
        setFilteredData(initialData);
    }
  };

  const handleDateChange = (date) => {
    console.log("Selected date:", date); // แสดงวันที่ที่เลือก

    if (filterType === "day" && date) {
      const startOfDay = date.clone().startOf("day");
      const endOfDay = date.clone().endOf("day");
  
      filterDataByDate(startOfDay, endOfDay);
  } else if (filterType === "month" && date) {
      const startOfMonth = date.startOf("month");
      const endOfMonth = date.endOf("month");
      
      filterDataByDate(startOfMonth, endOfMonth);
    } else if (filterType === "year" && date) {
      const startOfYear = date.startOf("year");
      const endOfYear = date.endOf("year");
     
      filterDataByDate(startOfYear, endOfYear);
    } else {
      console.log("No valid filter type selected. Resetting to initial data.");
      setFilteredData(initialData);
    }
  };

  const filterDataByDate = (startDate, endDate) => {
    const filtered = initialData.filter((item) => {
      console.log("item.importDate",item.importDate);
      
        const importDate = moment(item.importDate, "MM/DD/YYYY, HH:mm:ss");
        //console.log("importDate:", importDate); // Log importDate
        console.log("Checking if importDate is between:", startDate.format("MM/DD/YYYY, HH:mm:ss"), "and", endDate.format("MM/DD/YYYY, HH:mm:ss"));
      
        return importDate.isBetween(startDate.format("MM/DD/YYYY, HH:mm:ss"), endDate.format("MM/DD/YYYY, HH:mm:ss"), null, '[]'); // Include both endpoints
    });

    console.log("Filtered data:", filtered);
    setFilteredData(filtered);
};
  return (
    <Layout>
      <Header className="header-StockCategory">
        <div className="Row1">
          <h1 style={{ margin: 0, fontSize: "24px" }}>
            สินค้าประเภท {categoryTitle}
          </h1>
        </div>
        <div className="Row2">
          <div>
            <Input
              placeholder="ค้นหาชื่อสินค้า"
              style={{ width: 300 }}
              value={query}
              onChange={handleInputChange}
              suffix={<SearchOutlined />}
            />
          </div>
          <div className="filter-container">
            <Select
              className="Select-Filter"
              placeholder="กรองข้อมูล"
              onChange={handleSelectChange}
              value={selectValue}
            >
              <Option value="day" className="hover-option"
                style={{ backgroundColor: selectValue === "day" ? 'lightblue' : 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'lightblue'} 
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                เลือกวันที่
              </Option>
              <Option value="lastweek" className="hover-option"
                style={{ backgroundColor: selectValue === "day" ? 'lightblue' : 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'lightblue'} 
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                สัปดาห์ล่าสุด
                </Option>
              <Option value="month" className="hover-option"
              style={{ backgroundColor: selectValue === "day" ? 'lightblue' : 'transparent' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'lightblue'} 
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                เลือกเดือน
                </Option>
              <Option value="year" className="hover-option"
                style={{ backgroundColor: selectValue === "day" ? 'lightblue' : 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'lightblue'} 
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >เลือกปี</Option>
              <Option value="cancel" className="hover-option cancel-option"
                style={{ backgroundColor: selectValue === "cancel" ? 'lightcoral' : 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'lightcoral'} 
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >ยกเลิก</Option>
            </Select>
            {filterType === "day" && (
              <DatePicker
                picker="date"
                placeholder="เลือกวัน"
                onChange={handleDateChange}
                style={{ marginLeft: "16px" }}
              />
            )}
            {filterType === "lastweek" && dateRange && (
              <Col  xs={24} sm={24} md={24} lg={24} xl={14}>
                <div className="date-range">
                สัปดาห์ล่าสุด: {dateRange[0].format("DD/MM/YYYY")} -{" "}
                {dateRange[1].format("DD/MM/YYYY")}
              </div>
              </Col>
              
            )}
            {filterType === "month" && (
              <DatePicker
                picker="month"
                placeholder="เลือกเดือน"
                onChange={handleDateChange}
                style={{ marginLeft: "16px" }}
              />
            )}
            {filterType === "year" && (
              <DatePicker
                picker="year"
                placeholder="เลือกปี"
                onChange={handleDateChange}
                style={{ marginLeft: "16px" }}
              />
            )}
          </div>
        </div>
      </Header>

      <Content style={{ padding: "20px", background: "#fff" }}>
        {!isAdding ? (
          <>
            <Row style={{ marginBottom: "20px" }} justify="space-between">
              <Col>
                <Button type="default" onClick={handleBackClick}>
                  ย้อนกลับ
                </Button>
              </Col>
              <Col>
                <Button type="primary" onClick={handleAdd}>
                  เพิ่ม
                </Button>
              </Col>
            </Row>
            <Table
              dataSource={filteredData}
              columns={columns}
              pagination={{
                current: currentPage, // Set current page
                pageSize: 5,
                onChange: (page) => setCurrentPage(page), // Update current page
              }}
              rowKey="stock"
            />
          </>
        ) : (
          <Row gutter={16}>
            <Col span={16}>
              <Table
                dataSource={filteredData}
                columns={columns}
                pagination={{
                  current: currentPage, // Set current page
                  pageSize: 5,
                  onChange: (page) => setCurrentPage(page), // Update current page
                }}
                rowKey="stock"
              />
            </Col>
            <Col
              span={8}
              style={{
                background: "#ffffff",
                borderRadius: "8px",
                padding: "20px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                style={{ maxWidth: 600, margin: "auto" }}
                className="form-container"
              >
                <Form.Item
                  label="รหัสสินค้า"
                  name="code"
                  rules={[{ required: true, message: "กรุณากรอกรหัสสินค้า" }]}
                >
                  <Row>
                    <Col span={12}>
                      <Select
                        placeholder="เลือกรหัสสินค้า"
                        onChange={handleProductSelect}
                        disabled={open}
                        value={form.getFieldValue("code")}
                      >
                        {products.map((product) => (
                          <Option key={product.code} value={product.code}>
                            {product.code} - {product.name}
                          </Option>
                        ))}
                      </Select>
                    </Col>
                    <Col span={12}>
                      <Button
                        onClick={openForm}
                        type="primary"
                        style={{ marginLeft: 10 }}
                      >
                        <PlusSquareOutlined />
                        ไม่มีรหัส ? คลิกเพื่อเพิ่ม
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>

                <Form.Item
                  label="ชื่อสินค้า"
                  name="name"
                  rules={[{ required: true, message: "กรุณากรอกชื่อสินค้า" }]}
                >
                  <Input placeholder="กรอกชื่อสินค้า" disabled={formDisabled} />
                </Form.Item>

                <Form.Item
                  label="จำนวน"
                  name="quantity"
                  rules={[{ required: true, message: "กรุณากรอกจำนวน" }]}
                >
                  <Input type="number" placeholder="กรอกจำนวน" />
                </Form.Item>

                <Form.Item
                  label="ราคา (บาท)"
                  name="price"
                  rules={[{ required: true, message: "กรุณากรอกราคา" }]}
                >
                  <Input type="number" placeholder="กรอกราคา (บาท)" />
                </Form.Item>

                <Form.Item
                  label="ผู้จัดจำหน่าย"
                  name="supplier"
                  rules={[
                    { required: true, message: "กรุณาเลือกผู้จัดจำหน่าย" },
                  ]}
                >
                  <Select placeholder="เลือกผู้จัดจำหน่าย">
                    {suppliers.map((supplier) => (
                      <Option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="วันที่นำเข้า"
                  name="importDate"
                  rules={[
                    { required: true, message: "กรุณาเลือกวันที่นำเข้า" },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    showTime={{ format: "HH:mm" }}
                    format="M/D/YYYY HH:mm"
                  />
                </Form.Item>

                <Form.Item
                  label="วันหมดอายุ"
                  name="expiryDate"
                  rules={[{ required: true, message: "กรุณาเลือกวันหมดอายุ" }]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    showTime={{ format: "HH:mm" }}
                    format="M/D/YYYY HH:mm"
                  />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" onClick={showModal}>
                    บันทึก
                  </Button>
                  <Button
                    type="default"

                    onClick={() => setIsAdding(false)}
                    style={{ marginLeft: "10px" }}
                  >
                    ยกเลิก
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        )}
        <Modal
          title="ยืนยันการบันทึก"
          visible={isModalVisible}
          onOk={() => form.submit()}
          onCancel={handleCancel}
          okText="บันทึก"
          cancelText="ยกเลิก"
        >
          <p>บางฟิลด์ไม่สามารถแก้ไขได้ ต้องการบันทึกข้อมูลหรือไม่?</p>
        </Modal>
      </Content>
    </Layout>
  );
}

function transformStockData(data: any[]) {
  return data.map((item: any, index: number) => ({
    key: index + 1,
    stock: item.stock_id,
    code: item.product_code_id || "",
    name: item.product_name || "",
    quantity: item.quantity ? String(item.quantity) : "N/A",
    price: item.price ? String(item.price) : "N/A",
    supplier: item.supplier_name || "N/A",
    importDate: item.date_in ? formatDate(item.date_in) : "N/A",
    expiryDate: item.expiration_date ? formatDate(item.expiration_date) : "N/A",
    employees: item.employee_name || "",
  }));
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });
}
