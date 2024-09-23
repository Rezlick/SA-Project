import React, { useState } from "react";
import { Layout, Button, Row, Col, AutoComplete } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Supplier from "../../../assets/ImgStock/phone.png";
import Meat from "../../../assets/ImgStock/meat.png";
import Vegetable from "../../../assets/ImgStock/vegetable.png";
import Seafood from "../../../assets/ImgStock/Seafood.png";
import NoodlesAndDough from "../../../assets/ImgStock/NoodlesAndDough.jpeg";
import BeveragesAndDesserts from "../../../assets/ImgStock/BeveragesAndDesserts.png";
import Condiment from "../../../assets/ImgStock/CondimentsAndSauce.png";
import CategoryCard from "./Category/CategoryCard/CategoryCard";
import './Mangestock.css';  // Import the CSS file

const { Header, Content } = Layout;

export default function ManageStock() {
  const navigate = useNavigate();

  const categories = [
    {
      imgSrc: Meat,  
      title: "เนื้อสัตว์ (Meats)",
      description: "เช่นเนื้อหมู วัว ไก่ ปลา เป็นต้น",
      link: "/ManageStock/Meat",
    },
    {
      imgSrc: Vegetable,
      title: "ผัก (Vegetables)",
      description: "เช่นผักบุ้ง ผักกาด เห็ด เป็นต้น",
      link: "/ManageStock/Vegetable",
    },
    {
      imgSrc: Seafood,
      title: "อาหารทะเล (Seafood)",
      description: "เช่นหอยเชลล์ กุ้ง ปลาหมึก เป็นต้น",
      link: "/ManageStock/Seafood",
    },
    {
      imgSrc: NoodlesAndDough,
      title: "เส้นและแป้ง (Noodles and Dough)",
      description: "เช่นวุ้นเส้น มาม่า เส้นหมี่ เกี้ยว เป็นต้น",
      link: "/ManageStock/NoodlesAndDough",
    },
    {
      imgSrc: Condiment,
      title: "เครื่องปรุงรสและน้ำจิ้ม (Condiments and sauce)",
      description: "เช่นน้ำจิ้มสุกกี้ น้ำจิ้มแจ่ว น้ำมันงา เป็นต้น",
      link: "/ManageStock/CondimentsAndSauce",
    },
    {
      imgSrc: BeveragesAndDesserts,
      title: "เครื่องดื่มและขนมหวาน (Beverages and Desserts)",
      description: "เช่นน้ำอัดลม น้ำพลั้น ไอศครีม เป็นต้น",
      link: "/ManageStock/BeveragesAndDesserts",
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(categories);

  const handleSearch = (value) => {
    setSearchQuery(value);
    const filtered = categories.filter((category) =>
      category.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  const handleCategoryClick = (link) => {
    navigate(link);
  };

  const options = filteredCategories.map((category) => ({
    value: category.title,
    label: category.title,
  }));

  return (
    <Layout>
      <Header className="header">
        <h1 className="header-title">จัดการข้อมูลสินค้า</h1>
        <AutoComplete
          className="autocomplete"
          options={options}
          onSearch={handleSearch}
          onSelect={(value) => handleSearch(value)}
          placeholder="ค้นหาชื่อหมวดหมู่สินค้า"
          suffixIcon={<SearchOutlined />}
          value={searchQuery}
          onChange={setSearchQuery} // To update the searchQuery as the user types
        />
      </Header>
      <Content className="content">
        <Row className="content-row">
          <Col span={18} className="left-column">
            <Row justify="center" className="category-title">
              <h1>หมวดหมู่ประเภทคลังสินค้า</h1>
            </Row>
            <div className="category-list">
              {filteredCategories.map((category, index) => (
                <CategoryCard
                  key={index}
                  imgSrc={category.imgSrc}
                  title={category.title}
                  description={category.description}
                  link={category.link}
                  onClick={() => handleCategoryClick(category.link)}
                />
              ))}
            </div>
          </Col>

          <Col span={6} className="right-column">
            <Row justify="center" className="supplier-title">
              <h1>ข้อมูลผู้จัดหา (Supplier)</h1>
            </Row>

            <Row justify="center" align="middle" className="supplier-content">
              <div>
                <div className="supplier">
                  <img
                    src={Supplier}
                    alt="Supplier"
                    className="supplier-img"
                  />
                  <Button className="button-link" type="primary" onClick={() => navigate("/ManageStock/Supplier")}>
                    ข้อมูลผู้จัดหา
                  </Button>
                </div>
                <div className="supplier-info">
                  <h1>ดูข้อมูลผู้จัดจำหน่าย</h1>
                </div>
              </div>
            </Row>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}