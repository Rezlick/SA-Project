import { useState, useEffect } from "react";
import { List, Avatar, Row, Col, message, Card, Statistic, Button, Modal } from "antd";
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from "react-router-dom";
import "./customer.css";
import { GetBookingByID, GetProductByCodeID } from "../../../services/https";
import { BookingInterface } from "../../../interfaces/Booking";
import SliceBeef from "../../../assets/imagesCustomer/Slicebeef.webp";
import Brisket from "../../../assets/imagesCustomer/brisket.webp";
import PorkSlice from "../../../assets/imagesCustomer/PorkSlice.webp";
import PorkBelly from "../../../assets/imagesCustomer/PorkBelly.webp";
import V1 from "../../../assets/imagesCustomer/veg1.jpg";
import V2 from "../../../assets/imagesCustomer/veg2.png";
import Chicken from "../../../assets/imagesCustomer/ChickenPepper.webp";

function Customer() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [booking, setBooking] = useState<BookingInterface | null>(null);
    const [tableName, setTableName] = useState<string>("");
    const [packages, setPackages] = useState<string>("");
    const [selectedCard, setSelectedCard] = useState<string | null>(null);
    const [filteredData, setFilteredData] = useState([]);
    const [productData, setProductData] = useState([{ code_id: "", product_name: "", q: 0, category_name: "" }]);
    const [quantity, setQuantity] = useState(1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [cartData, setCartData] = useState(null);

    const fetchBookingById = async () => {
        if (!id) {
            message.error("Invalid booking ID!");
            return;
        }

        try {
            const res = await GetBookingByID(id);
            if (res && res.data) {
                setBooking(res.data);
                setTableName(res.data.table?.table_name ?? "N/A");
                setPackages(res.data.package?.name ?? "N/A");
            } else {
                throw new Error("Failed to fetch booking data.");
            }
        } catch (error) {
            const errorMessage = (error as Error).message || "An unknown error occurred.";
            message.error("Failed to fetch booking data: " + errorMessage);
        }
    };

    const fetchProductData = async (productCode: string) => {
        try {
            const res = await GetProductByCodeID(productCode);
            if (res && res.data) {
                return res.data;
            }
        } catch (error) {
            console.error("API Error:", error);
        }
        return null;
    };

    const fetchData = async (data) => {
        const updatedData = await Promise.all(
            data.map(async (item) => {
                const productData = await fetchProductData(item.productCode); // Fetch by productCode
                if (productData) {
                    return {
                        code_id: item.productCode, // This is the productCode you're mapping
                        product_name: productData.product_name || "ไม่มีชื่อสินค้า",
                        quantity: productData.quantity || 0,
                        category_name: productData.category_name || "ไม่มีหมวดหมู่",
                        image: item.image // Ensure the image is correctly included
                    };
                }
                return item;
            })
        );
        setProductData(updatedData); // Map the updated product data
    };
    

    const data = [
        { productCode: 'M001', image: SliceBeef, category: 'เนื้อ' },
        { productCode: 'M002', image: Brisket, category: 'เนื้อ' },
        { productCode: 'M004', image: PorkSlice, category: 'หมู' },
        { productCode: 'M005', image: PorkBelly, category: 'หมู' },
        { productCode: 'B003', image: 'https://path/to/icecream1.png', category: 'ของหวาน' },
        { productCode: 'B004', image: 'https://path/to/drink2.png', category: 'ของหวาน' },
        { productCode: 'V001', image: V1, category: 'ผัก' },
        { productCode: 'V002', image: V2, category: 'ผัก' },
        { productCode: 'S001', image: 'https://path/to/drink2.png', category: 'ซีฟู้ด' },
        { productCode: 'S002', image: 'https://path/to/drink2.png', category: 'ซีฟู้ด' },
        { productCode: 'M003', image: Chicken, category: 'ไก่' },
    ];

    const showModal = (item) => {
        setSelectedItem(item);
        setQuantity(1);
        setIsModalVisible(true);
    };

    const handleAddToCart = () => {
        if (!selectedItem) return; // Ensure an item is selected
        const data = {
            productId: selectedItem.code_id, // Use the code_id as productCodeId
            productName: selectedItem.product_name,
            quantity: quantity,
        };
    
        const existingCart = JSON.parse(localStorage.getItem('cartData')) || [];
        const updatedCart = [...existingCart, data];
    
        localStorage.setItem('cartData', JSON.stringify(updatedCart));
        setCartData(updatedCart);
        console.log('ข้อมูลถูกเก็บในตะกร้า:', updatedCart);
        handleCancel();
    };
    

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedItem(null);
    };

    const increaseQuantity = () => {
        setQuantity((prevQuantity) => Math.min(prevQuantity + 1, 10));
    };

    const decreaseQuantity = () => {
        setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
    };

    useEffect(() => {
        fetchData(data);
        fetchBookingById();
    }, [id]);

    const filterByCategoryAndPrefix = (category: string, codePrefix: string) => {
        return data
            .filter(item => item.category === category && item.productCode.startsWith(codePrefix)) // Ensure proper filtering
            .map(item => {
                const matchingProduct = productData.find(product => product.code_id === item.productCode); // Match by productCodeId
                if (matchingProduct) {
                    return {
                        ...matchingProduct,
                        quantity: matchingProduct.quantity * 10, // Adjust quantity logic if needed
                        image: item.image // Use the image from the data
                    };
                }
                return item;
            });
    };
    

    const handleCardClick = (cardName: string, codePrefix: string) => {
        setSelectedCard(cardName);
        const filtered = filterByCategoryAndPrefix(cardName, codePrefix);
        setFilteredData(filtered);
    };

    return (
        <div>
            <Row gutter={[0, 0]}>
                <Col xs={1}>
                    <Card className="card-white" style={{ marginTop: '7vh', zIndex: "2", marginLeft: '50%', maxHeight: '125px' }}>
                        <Statistic value={booking?.ID} prefix="หมายเลขออเดอร์ : " valueStyle={{ fontSize: '16px' }} />
                        <Statistic value={tableName} prefix="หมายเลขโต๊ะ : " valueStyle={{ fontSize: '16px' }} />
                        <Statistic value={packages} prefix="แพ็คเกจอาหาร : " valueStyle={{ fontSize: '16px' }} />
                    </Card>
                </Col>
            </Row>
            <Row gutter={[0, 0]}>
                <Col xs={24}>
                    <Card size="small" style={{ marginTop: '15px', overflowX: 'auto', maxHeight: '150px', maxWidth: '445px', marginLeft: '2%' }}>
                        <div style={{ display: 'flex', whiteSpace: 'nowrap' }}>
                            {packages !== "หมู,ไก่" && packages !== "ทะเล" && (
                                <Col xs={6}>
                                    <Card
                                        onClick={() => handleCardClick('เนื้อ', 'M')}
                                        style={{
                                            textAlign: 'center',
                                            width: '100px',
                                            backgroundColor: selectedCard === 'เนื้อ' ? 'lightgray' : 'white'
                                        }}
                                    >
                                        เนื้อ
                                    </Card>
                                </Col>
                            )}
                            {packages !== "หมู,ไก่" && (
                                <Col xs={6}>
                                    <Card
                                        onClick={() => handleCardClick('ซีฟู้ด', 'S')}
                                        style={{
                                            textAlign: 'center',
                                            width: '100px',
                                            backgroundColor: selectedCard === 'ซีฟู้ด' ? 'lightgray' : 'white'
                                        }}
                                    >
                                        ซีฟู้ด
                                    </Card>
                                </Col>
                            )}
                            <Col xs={6}>
                                <Card
                                    onClick={() => handleCardClick('หมู', 'M')}
                                    style={{
                                        textAlign: 'center',
                                        width: '100px',
                                        backgroundColor: selectedCard === 'หมู' ? 'lightgray' : 'white'
                                    }}
                                >
                                    หมู
                                </Card>
                            </Col>
                            <Col xs={6}>
                                <Card
                                    onClick={() => handleCardClick('ไก่', 'M')}
                                    style={{
                                        textAlign: 'center',
                                        width: '100px',
                                        backgroundColor: selectedCard === 'ไก่' ? 'lightgray' : 'white'
                                    }}
                                >
                                    ไก่
                                </Card>
                            </Col>
                            <Col xs={6}>
                                <Card
                                    onClick={() => handleCardClick('ผัก', 'V')}
                                    style={{
                                        textAlign: 'center',
                                        width: '100px',
                                        backgroundColor: selectedCard === 'ผัก' ? 'lightgray' : 'white'
                                    }}
                                >
                                    ผัก
                                </Card>
                            </Col>
                            <Col xs={6}>
                                <Card
                                    onClick={() => handleCardClick('ของหวาน', 'B')}
                                    style={{
                                        textAlign: 'center',
                                        width: '100px',
                                        backgroundColor: selectedCard === 'ของหวาน' ? 'lightgray' : 'white'
                                    }}
                                >
                                    ของหวาน
                                </Card>
                            </Col>
                        </div>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col xs={24}>
                    <Card style={{ margin: '20px' }}>
                        <List
                            itemLayout="horizontal"
                            dataSource={filteredData}
                            renderItem={(item) => (
                                <List.Item onClick={() => showModal(item)} style={{ cursor: 'pointer' }}>
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.image} shape="square" size={100} />}
                                        title={<span>{item.product_name || "ไม่มีชื่อสินค้า"}</span>}
                                    />
                                </List.Item>
                            )}
                        />
                        <Modal
                            title={selectedItem?.product_name || "รายละเอียดสินค้า"}
                            visible={isModalVisible}
                            onCancel={handleCancel}
                            footer={null}
                        >
                            {selectedItem && (
                                <div>
                                    <Card>
                                        <img
                                            alt="example"
                                            src={selectedItem.image}
                                            style={{
                                                width: '200px',
                                                height: '150px',
                                                objectFit: 'cover',
                                                display: 'block',
                                                marginLeft: 'auto',
                                                marginRight: 'auto',
                                            }}
                                        />
                                    </Card>
                                    <div style={{ textAlign: 'center', margin: '20px 0' }}>
                                        <p>จำนวน:</p>
                                        <MinusCircleOutlined
                                            onClick={decreaseQuantity}
                                            style={{ fontSize: '24px', color: quantity <= 1 ? 'gray' : '#1890ff', cursor: 'pointer' }}
                                            disabled={quantity <= 1}
                                        />
                                        <span style={{ margin: '0 10px', fontSize: '18px' }}>{quantity}</span>
                                        <PlusCircleOutlined
                                            onClick={increaseQuantity}
                                            style={{ fontSize: '24px', color: quantity >= 10 ? 'gray' : '#1890ff', cursor: 'pointer' }}
                                            disabled={quantity >= 10}
                                        />
                                    </div>
                                    <Button
                                        type="primary"
                                        block
                                        onClick={handleAddToCart}
                                    >
                                        เพิ่มไปยังตะกร้า
                                    </Button>
                                </div>
                            )}
                        </Modal>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default Customer;
