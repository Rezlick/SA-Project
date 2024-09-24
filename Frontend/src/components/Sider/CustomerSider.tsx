import { ShoppingCartOutlined, DashOutlined, HomeOutlined, SearchOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import { useNavigate, useParams } from "react-router-dom";

function CustomerSider() {
    const navigate = useNavigate();
    const { id } = useParams();

    return (
        <footer style={{ position: "fixed", bottom: 0, right: 0, zIndex: 1000 }}>
            <FloatButton.Group
                trigger="click"
                type="primary"
                style={{
                    insetInlineEnd: 24,
                }}
                icon={<DashOutlined />}
            >
                <FloatButton 
                    icon={<HomeOutlined />}
                    onClick={() => navigate(`/customer/${id}`)} 
                />
                <FloatButton 
                    icon={<ShoppingCartOutlined />} 
                    onClick={() => navigate(`/customer/cart/${id}`)} 
                />
                <FloatButton 
                    icon={<SearchOutlined />} 
                    onClick={() => navigate(`/customer/status/${id}`)} 
                />
            </FloatButton.Group>
        </footer>
    );
}

export default CustomerSider;
