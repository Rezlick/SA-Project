export interface ReceiptInterface {
    ID?: number;
    CreatedAt?: Date;
    BookingID?: number;
    totalprice?: Float64Array;
    totaldiscount?: Float64Array;
    CouponID?: number,
    MemberID?: number;
    EmployeeID?: number;
}