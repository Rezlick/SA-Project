import { useState, useEffect } from "react";
import { List, Avatar, Row, Col, message, Card, Statistic, Button, Modal } from "antd";
import { PlusCircleOutlined, MinusCircleOutlined, ContainerOutlined } from '@ant-design/icons';
import { useParams } from "react-router-dom";
import "./customer.css";
import { GetBookingByID, GetProductByCodeID, GetAllOrderProducts } from "../../../services/https";
import { BookingInterface } from "../../../interfaces/Booking";
import { OrderProductInterface } from "../../../interfaces/OrderProduct";
import SliceBeef from "../../../assets/imagesCustomer/Slicebeef.webp";
import Brisket from "../../../assets/imagesCustomer/brisket.webp";
import PorkSlice from "../../../assets/imagesCustomer/PorkSlice.webp";
import PorkBelly from "../../../assets/imagesCustomer/PorkBelly.webp";
import V1 from "../../../assets/imagesCustomer/veg1.jpg";
import V2 from "../../../assets/imagesCustomer/veg2.png";
import Chicken from "../../../assets/imagesCustomer/ChickenPepper.webp";
import Shrimp from "../../../assets/imagesCustomer/shrimp.webp";
import Shell from "../../../assets/imagesCustomer/0zvuqr.jpg";
import chocolate from "../../../assets/imagesCustomer/ice-cream-choccolate.webp";
import strawBerry from "../../../assets/imagesCustomer/ice-cream-strawberry.webp";
import LodChong from "../../../assets/imagesCustomer/LodChong.webp";

function Customer() {
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
    const [allorderproduct, setAllOrderProduct] = useState<OrderProductInterface[]>([]);

    const fetchOrderProductData = async () => {
        try {
            const res = await GetAllOrderProducts();
            if (res.status === 200) {
                setAllOrderProduct(res.data);
            } else {
                message.error(res.data.error || "Unable to fetch order-product data");
            }
        } catch (error) {
            message.error("Error fetching order-product data");
        } finally {
        }
    };

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
        { productCode: 'M003', image: PorkSlice, category: 'หมู' },
        { productCode: 'M004', image: PorkBelly, category: 'หมู' },
        { productCode: 'B005', image: LodChong, category: 'ของหวาน' },
        { productCode: 'B003', image: chocolate, category: 'ของหวาน' },
        { productCode: 'B004', image: strawBerry, category: 'ของหวาน' },
        { productCode: 'V001', image: V1, category: 'ผัก' },
        { productCode: 'V002', image: V2, category: 'ผัก' },
        { productCode: 'S001', image: Shrimp, category: 'ซีฟู้ด' },
        { productCode: 'S002', image: Shell, category: 'ซีฟู้ด' },
        { productCode: 'M005', image: Chicken, category: 'ไก่' },
    ];

    const showModal = (item) => {
        setSelectedItem(item);
        setQuantity(1);
        setIsModalVisible(true);
    };

    const handleAddToCart = () => {
        if (!selectedItem) return;

        const existingCart = JSON.parse(localStorage.getItem('cartData')) || [];
        const existingProductIndex = existingCart.findIndex(
            (product) => product.productId === selectedItem.code_id
        );

        let updatedCart;
        if (existingProductIndex !== -1) {
            const existingProduct = existingCart[existingProductIndex];
            const newQuantity = existingProduct.quantity + quantity;

            // ตรวจสอบว่า sum(quantity) ต้องไม่เกิน 50
            if (newQuantity > 50) {
                message.error("จำนวนสินค้าเกินกำหนด (สูงสุด 50 ต่อสินค้า)");
                return;
            }

            updatedCart = [...existingCart];
            updatedCart[existingProductIndex] = {
                ...existingProduct,
                quantity: newQuantity,
            };
        } else {
            // ตรวจสอบว่า quantity ไม่เกิน 50
            if (quantity > 50) {
                message.error("จำนวนสินค้าเกินกำหนด (สูงสุด 50 ต่อสินค้า)");
                return;
            }

            const newProduct = {
                productId: selectedItem.code_id,
                productName: selectedItem.product_name,
                quantity: quantity,
            };

            updatedCart = [...existingCart, newProduct];
        }

        localStorage.setItem('cartData', JSON.stringify(updatedCart));
        message.success("เพิ่มไปยังตะกร้าแล้ว!");
        handleCancel();
    };


    const getMaxQuantityFromBackend = (productCode) => {
        // ค้นหา product จาก allorderproduct ตาม productCode
        const orderProduct = allorderproduct.find(product => product?.Products?.product_code_id === productCode);

        // ค้นหา product จาก productData ตาม productCode
        const matchProductStock = productData.find(product => product?.code_id === productCode);

        if (orderProduct && matchProductStock) {
            const orderQuantity = orderProduct?.Quantity ?? 0; // จำนวนที่ถูกสั่งใน orderProduct
            const productStock = matchProductStock?.quantity ?? 0; // จำนวนสต็อกใน productData
            const maxFromStock = (productStock * 10) - orderQuantity; // คำนวณจำนวนที่เหลือให้สั่งได้

            // ตรวจสอบว่า maxFromStock มีค่าถูกต้องหรือไม่
            if (isNaN(maxFromStock) || maxFromStock <= 0) {
                return 0;
            }

            // ถ้าข้อมูลถูกต้อง ส่งค่าที่คำนวณได้
            return maxFromStock;
        }

        // ถ้าไม่มีข้อมูลใน orderProduct หรือ Products ส่งค่า 50 เป็นค่าเริ่มต้น
        return 50;
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedItem(null);
    };

    const decreaseQuantity = () => {
        setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
    };

    useEffect(() => {
        fetchData(data);
        fetchBookingById();
        fetchOrderProductData();
    }, [id]);

    const filterByCategoryAndPrefix = (category: string, codePrefix: string) => {
        return data
            .filter(item => item.category === category && item.productCode.startsWith(codePrefix)) // Ensure proper filtering
            .map(item => {
                const matchingProduct = productData.find(product => product.code_id === item.productCode);
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
            <Card style={{ marginTop: '20px', backgroundColor: '#2C2C2C',border: '3px solid #FFD700'}}>
                <Row>
                    <Col xs={24} >
                        <Card className="card-white" style={{ marginTop: '10px', zIndex: "2", maxWidth: '450px', height: 'auto' }}>
                            <Statistic value={booking?.ID} prefix="หมายเลขออเดอร์ : " valueStyle={{ fontSize: '20px', fontWeight: 'bold' }} />
                            <Statistic value={tableName} prefix="หมายเลขโต๊ะ : " valueStyle={{ fontSize: '20px', fontWeight: 'bold' }} />
                            <Statistic value={packages} prefix="แพ็คเกจอาหาร : " valueStyle={{ fontSize: '20px', fontWeight: 'bold' }} />
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24}>
                        <Card size="small" style={{ marginTop: '15px', overflowX: 'auto', maxHeight: '150px', maxWidth: '450px' }}>
                            <div style={{ display: 'flex', whiteSpace: 'nowrap' }}>
                                {packages !== "หมู,ไก่" && packages !== "ทะเล" && (
                                    <Col xs={7}>
                                        <Card
                                            onClick={() => handleCardClick('เนื้อ', 'M')}
                                            style={{
                                                fontSize: '20px',      // Moved these into the correct "style" attribute
                                                fontWeight: 'bold',    // Moved these into the correct "style" attribute
                                                textAlign: 'center',
                                                width: '120px',
                                                backgroundColor: selectedCard === 'เนื้อ' ? 'lightgray' : 'white'
                                            }}
                                        >
                                            เนื้อ
                                        </Card>
                                    </Col>
                                )}
                                {packages !== "หมู,ไก่" && (
                                    <Col xs={7}>
                                        <Card
                                            onClick={() => handleCardClick('ซีฟู้ด', 'S')}
                                            style={{
                                                fontSize: '20px',      // Moved these into the correct "style" attribute
                                                fontWeight: 'bold',    // Moved these into the correct "style" attribute
                                                textAlign: 'center',
                                                width: '120px',
                                                backgroundColor: selectedCard === 'ซีฟู้ด' ? 'lightgray' : 'white'
                                            }}
                                        >
                                            ซีฟู้ด
                                        </Card>
                                    </Col>
                                )}
                                <Col xs={7}>
                                    <Card
                                        onClick={() => handleCardClick('หมู', 'M')}
                                        style={{
                                            fontSize: '20px',      // Moved these into the correct "style" attribute
                                            fontWeight: 'bold',    // Moved these into the correct "style" attribute
                                            textAlign: 'center',
                                            width: '120px',
                                            backgroundColor: selectedCard === 'หมู' ? 'lightgray' : 'white'
                                        }}
                                    >
                                        หมู
                                    </Card>
                                </Col>
                                <Col xs={7}>
                                    <Card
                                        onClick={() => handleCardClick('ไก่', 'M')}
                                        style={{
                                            fontSize: '20px',      // Moved these into the correct "style" attribute
                                            fontWeight: 'bold',    // Moved these into the correct "style" attribute
                                            textAlign: 'center',
                                            width: '120px',
                                            backgroundColor: selectedCard === 'ไก่' ? 'lightgray' : 'white'
                                        }}
                                    >
                                        ไก่
                                    </Card>
                                </Col>
                                <Col xs={7}>
                                    <Card
                                        onClick={() => handleCardClick('ผัก', 'V')}
                                        style={{
                                            fontSize: '20px',      // Moved these into the correct "style" attribute
                                            fontWeight: 'bold',    // Moved these into the correct "style" attribute
                                            textAlign: 'center',
                                            width: '120px',
                                            backgroundColor: selectedCard === 'ผัก' ? 'lightgray' : 'white'
                                        }}
                                    >
                                        ผัก
                                    </Card>
                                </Col>
                                <Col xs={7}>
                                    <Card
                                        onClick={() => handleCardClick('ของหวาน', 'B')}
                                        style={{
                                            fontSize: '20px',      // Moved these into the correct "style" attribute
                                            fontWeight: 'bold',    // Moved these into the correct "style" attribute
                                            textAlign: 'center',
                                            width: '120px',
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
                        <Card style={{ marginTop: '15px', overflow: 'auto', maxHeight: '300px' }}>
                            <List
                                itemLayout="horizontal"
                                dataSource={filteredData}
                                renderItem={(item) => (
                                    <List.Item onClick={() => showModal(item)} style={{ cursor: 'pointer' }}>
                                        <List.Item.Meta
                                            avatar={<Avatar src={item.image} shape="square" size={100} />}
                                            title={<span style={{ fontSize: '20px', fontWeight: 'bold' }}>{item.product_name || "ไม่มีชื่อสินค้า"}</span>}
                                        />
                                    </List.Item>

                                )}
                            >
                                {filteredData.length === 0 && (
                                    <Col>
                                        <Row style={{ justifyContent: 'center', marginTop: '20px', fontSize: '48px', color: 'gray', fontWeight: 'bold' }}>
                                            <ContainerOutlined />
                                        </Row>
                                        <Row style={{ justifyContent: 'center', marginTop: '10px', fontSize: '20px', color: 'gray', fontWeight: 'bold' }}>
                                            กรุณาเลือกหมวดหมู่
                                        </Row>
                                    </Col>
                                )}
                            </List>

                            <Modal
                                title={<span style={{ fontSize: '20px', fontWeight: 'bold' }}>{selectedItem?.product_name || "รายละเอียดสินค้า"}</span>}
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
                                            <p style={{ fontSize:'20px'}}>จำนวน:</p>
                                            <MinusCircleOutlined
                                                onClick={decreaseQuantity}
                                                style={{ fontSize: '24px', color: quantity <= 1 ? 'gray' : '#1890ff', cursor: 'pointer' }}
                                                disabled={quantity <= 1}
                                            />
                                            <input
                                                type="number"
                                                value={quantity === 0 ? '' : quantity}
                                                onChange={(e) => {
                                                    const value = parseInt(e.target.value, 10);
                                                    const maxQuantity = Math.min(50, getMaxQuantityFromBackend(selectedItem.code_id));  // จำกัดจำนวนสูงสุดจาก stock และ allorderproduct

                                                    if (isNaN(value)) {
                                                        setQuantity(0);
                                                    } else if (value >= 0 && value <= maxQuantity) {
                                                        setQuantity(value);
                                                    } else if (value > maxQuantity) {
                                                        message.error("จำนวนสินค้าต้องไม่เกินจำนวนที่อนุญาตในสต็อก");  // แจ้งเตือนเมื่อเกินจำนวนสูงสุด
                                                    } else if (value <= 0) {
                                                        message.warning("กรุณาระบุจำนวนที่ถูกต้อง");  // แจ้งเตือนเมื่อใส่ค่า 0 หรือติดลบ
                                                    }
                                                }}
                                                style={{ margin: '0 10px', width: '60px', textAlign: 'center', fontSize: '18px' }}
                                            />
                                            <PlusCircleOutlined
                                                onClick={() => {
                                                    const maxQuantity = Math.min(50, getMaxQuantityFromBackend(selectedItem.code_id));  // จำกัดจำนวนสูงสุดจาก stock และ allorderproduct
                                                    if (quantity < maxQuantity) {
                                                        setQuantity((prevQuantity) => Math.min(prevQuantity + 1, maxQuantity));
                                                    } else {
                                                        message.error("จำนวนสินค้าต้องไม่เกินจำนวนที่อนุญาตในสต็อก");  // แจ้งเตือนเมื่อพยายามเพิ่มเกินจำนวนสูงสุด
                                                    }
                                                }}
                                                style={{ fontSize: '24px', color: quantity >= getMaxQuantityFromBackend(selectedItem.code_id) ? 'gray' : '#1890ff', cursor: 'pointer' }}
                                                disabled={quantity >= getMaxQuantityFromBackend(selectedItem.code_id) || getMaxQuantityFromBackend(selectedItem.code_id) <= 0}  // ปิดปุ่มเมื่อจำนวนถึงค่าสูงสุดหรือน้อยกว่า 0
                                            />
                                        </div>

                                        {/* คำนวณล่วงหน้าว่าจะอนุญาตให้กดปุ่มได้หรือไม่ */}
                                        {(() => {
                                            const maxQuantity = getMaxQuantityFromBackend(selectedItem.code_id);  // ดึงค่ามาก่อนเพื่อใช้ในปุ่ม

                                            return (
                                                <Button
                                                    type="primary"
                                                    block
                                                    onClick={() => {
                                                        if (quantity === 0) {
                                                            message.warning("กรุณาระบุจำนวนที่ถูกต้อง");  // แจ้งเตือนเมื่อผู้ใช้ระบุจำนวนเป็น 0
                                                        } else {
                                                            handleAddToCart();
                                                        }
                                                    }}
                                                    disabled={maxQuantity <= 0 || quantity <= 0}  // ปิดปุ่มถ้า maxQuantity <= 0 หรือ จำนวน <= 0
                                                    style={{
                                                        backgroundColor: (maxQuantity <= 0 || quantity <= 0) ? 'gray' : '#1890ff',
                                                        borderColor: (maxQuantity <= 0 || quantity <= 0) ? 'gray' : '#1890ff',
                                                        fontSize:'20px',
                                                        height:'50px'
                                                    }}
                                                >
                                                    เพิ่มไปยังตะกร้า
                                                </Button>
                                            );
                                        })()}
                                    </div>
                                )}
                            </Modal>

                        </Card>
                    </Col>
                </Row>
            </Card>
        </div>
    );
}

export default Customer;