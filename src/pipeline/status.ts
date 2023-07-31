// Create Possible RFQ Status

export enum Status {
    RFQPending = 'Pending',
    RFQApproved = 'Approved',
    RFQRejected = 'Rejected',
    PurchaseOrderGenerated = 'PurchaseOrderGenerated',
    PurchaseOrderUploaded = 'PurchaseOrderUploaded',
    PurchaseOrderSent = 'PurchaseOrderSent',
    PurchaseOrderReceived = 'PurchaseOrderReceived',
    PurchaseOrderAccepted = 'PurchaseOrderAccepted',
    PurchaseOrderRejected = 'PurchaseOrderRejected',
    PurchaseOrderAcceptedByCustomer = 'PurchaseOrderAcceptedByCustomer',
    PurchaseOrderRejectedByCustomer = 'PurchaseOrderRejectedByCustomer',
    PurchaseOrderSentByCustomer = 'PurchaseOrderSentByCustomer',
    PurchaseOrderReceivedByCustomer = 'PurchaseOrderReceivedByCustomer',
    QuotationUploaded = 'QuotationUploaded',     
    QuotationRejectedByCustomer = 'RejectedByCustomer',
    QuotationAcceptedByCustomer = 'AcceptedByCustomer',
    QuotationSentByCustomer = 'SentByCustomer',
    QuotationReceivedByCustomer = 'ReceivedByCustomer',
    QuotationShippedByCustomer = 'ShippedByCustomer',
    QuotationDeliveredByCustomer = 'DeliveredByCustomer',
    QuotationClosedByCustomer = 'ClosedByCustomer',
    QuotationCancelledByCustomer = 'CancelledByCustomer',
    OrderPlaced = 'OrderPlaced',
    OrderReceived = 'OrderReceived',
    OrderAccepted = 'OrderAccepted',
    OrderRejected = 'OrderRejected',
    OrderAcceptedByCustomer = 'OrderAcceptedByCustomer',
    OrderRejectedByCustomer = 'OrderRejectedByCustomer',
    OrderSentByCustomer = 'OrderSentByCustomer',
    OrderReceivedByCustomer = 'OrderReceivedByCustomer',
    OrderShipped = 'OrderShipped',
    OrderDelivered = 'OrderDelivered',
    OrderClosed = 'OrderClosed',
    OrderCancelled = 'OrderCancelled',
    OrderCancelledByCustomer = 'OrderCancelledByCustomer',
    OrderClosedByCustomer = 'OrderClosedByCustomer',
    OrderShippedByCustomer = 'OrderShippedByCustomer',
    OrderDeliveredByCustomer = 'OrderDeliveredByCustomer',
    OrderShippedBySupplier = 'OrderShippedBySupplier',
    OrderDeliveredBySupplier = 'OrderDeliveredBySupplier',
    OrderClosedBySupplier = 'OrderClosedBySupplier',
    OrderCancelledBySupplier = 'OrderCancelledBySupplier',
    InvoiceGenerated = 'InvoiceGenerated',
    InvoiceSent = 'InvoiceSent',
    InvoiceReceived = 'InvoiceReceived',
    InvoiceAccepted = 'InvoiceAccepted',
    InvoiceRejected = 'InvoiceRejected',
    InvoiceAcceptedByCustomer = 'InvoiceAcceptedByCustomer',
    InvoiceRejectedByCustomer = 'InvoiceRejectedByCustomer',
    InvoiceSentByCustomer = 'InvoiceSentByCustomer',
    InvoiceReceivedByCustomer = 'InvoiceReceivedByCustomer',
}


enum StatusType {
    RFQ = 'RFQ',
    PurchaseOrder = 'PurchaseOrder',
    Quotation = 'Quotation',
    Order = 'Order',
    Invoice = 'Invoice',
}

enum StatusAction {
    Approve = 'Approve',
    Reject = 'Reject',
    Generate = 'Generate',
    Upload = 'Upload',
    Send = 'Send',
    Receive = 'Receive',
    Accept = 'Accept',
}

enum StatusActionBy {
    Customer = 'Customer',
    Supplier = 'Supplier',
}

enum StatusActionByType {
    Client = 'Client',
    Supplier = 'Supplier',
    Logistics = 'Logistics',
    Prodo = 'Prodo',
}

enum StatusActionByStatus {
    Pending = 'Pending',
    Approved = 'Approved',
    Rejected = 'Rejected',
    Generated = 'Generated',
    Uploaded = 'Uploaded',
    Sent = 'Sent',
    Received = 'Received',
    Accepted = 'Accepted',
}
