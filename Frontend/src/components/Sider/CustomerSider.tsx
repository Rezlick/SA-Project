import { ShoppingCartOutlined, DashOutlined, HomeOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";

function CustomerSider() {

    // ส่งคืน JSX เพื่อให้แสดงผลได้
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
                <FloatButton icon={<HomeOutlined />}/>
                <FloatButton icon={<ShoppingCartOutlined />} />
                <FloatButton icon={<ShoppingCartOutlined />} />
            </FloatButton.Group>
        </footer>
    );
}

export default CustomerSider;
