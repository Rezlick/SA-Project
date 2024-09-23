// CategoryCard.js

import { Button, Row, Col } from "antd";
import { Link } from "react-router-dom";
import './CategoryCard.css'

export default function CategoryCard({ imgSrc, title, description, link }) {
  return (
    <Row className="category-card" >
      <Col span={19}>
        <div className="card-content">
          <img className="img-titie"
            src={imgSrc}
            alt={title}
          />
          <div>
            <h1 style={{ margin: 0 }}>{title}</h1>
            <h1 className="h1-description" >
              {description}
            </h1>
          </div>
        </div>
      </Col>

      <Col span={5} style={{ justifyContent: "center", display: "flex", alignItems: "center" }}>
        <Button className="button-link"
          type="primary"
        >
          <Link to={link}>คลิกที่นี่</Link>
        </Button>
      </Col>
    </Row>
  );
}