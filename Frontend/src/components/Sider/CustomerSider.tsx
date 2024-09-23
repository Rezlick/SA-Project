import { CommentOutlined, CustomerServiceOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import { useState } from "react";

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
                icon={<CustomerServiceOutlined />}
            >
                <FloatButton />
                <FloatButton icon={<CommentOutlined />} />
            </FloatButton.Group>
        </footer>
    );
}

export default CustomerSider;
