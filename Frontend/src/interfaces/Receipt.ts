export interface ReceiptInterface {
    ID?: number;
    CreatedAt?: Date;
    BookingID?: number;
    totalprice?: number;
    totaldiscount?: number;
    CouponID?: number,
    MemberID?: number;
    EmployeeID?: number;
    TypePaymentID?: number;
}