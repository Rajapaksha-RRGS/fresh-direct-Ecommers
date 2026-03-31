# 🌿 Fresh Direct — PlantUML Code

---

## 1️⃣ CLASS DIAGRAM — PlantUML Code

```plantuml
@startuml FreshDirect_ClassDiagram

skinparam classAttributeIconSize 0
skinparam backgroundColor #FAFFF7
skinparam class {
    BackgroundColor #E8F5E9
    BorderColor #2D6A4F
    HeaderBackgroundColor #2D6A4F
    HeaderFontColor #FFFFFF
    FontColor #1B1B1B
    ArrowColor #2D6A4F
}
skinparam stereotypeCBackgroundColor #A8D5A2
skinparam title {
    FontSize 18
    FontStyle Bold
}

title Fresh Direct — Class Diagram

' ─────────────────────────────────────────
' ABSTRACT BASE CLASS
' ─────────────────────────────────────────
abstract class User {
    +String userId
    +String name
    +String email
    +String passwordHash
    +String phone
    +String address
    +String role
    +DateTime createdAt
    --
    +register()
    +login()
    +logout()
    +updateProfile()
}

' ─────────────────────────────────────────
' ACTORS / ROLES
' ─────────────────────────────────────────
class Customer {
    +String customerId
    --
    +browseProducts()
    +searchProducts(query : String)
    +viewFarmerProfile(farmerId : String)
    +placeOrder()
    +makePayment()
    +trackOrder(orderId : String)
    +addReview(productId : String, rating : Int, comment : String)
}

class Farmer {
    +String farmerId
    +String farmName
    +String location
    +String bio
    +String certifications
    --
    +addProduct(product : Product)
    +updateInventory(productId : String, qty : Int)
    +viewReceivedOrders()
    +updateOrderStatus(orderId : String, status : String)
}

class Admin {
    +String adminId
    --
    +manageUsers()
    +approveProductListing(productId : String)
    +rejectProductListing(productId : String)
    +manageOrdersAndLogistics()
    +viewSalesAnalytics()
}

' ─────────────────────────────────────────
' PRODUCT
' ─────────────────────────────────────────
class Product {
    +String productId
    +String name
    +String category
    +String description
    +Float basePrice
    +Int stockQty
    +String imageUrl
    +String status
    +DateTime listedAt
    --
    +updateStock(qty : Int)
    +setPrice(price : Float)
}

' ─────────────────────────────────────────
' CART
' ─────────────────────────────────────────
class Cart {
    +String cartId
    +Float totalAmount
    --
    +addItem(product : Product, qty : Int)
    +removeItem(productId : String)
    +clearCart()
    +calculateTotal() : Float
}

class CartItem {
    +String cartItemId
    +Int quantity
    +Float unitPrice
    --
    +getSubtotal() : Float
}

' ─────────────────────────────────────────
' ORDER
' ─────────────────────────────────────────
class Order {
    +String orderId
    +String status
    +DateTime placedAt
    +String deliveryAddress
    +Float totalAmount
    +String trackingInfo
    --
    +confirmOrder()
    +cancelOrder()
    +updateStatus(status : String)
    +getTrackingInfo() : String
}

class OrderItem {
    +String orderItemId
    +Int quantity
    +Float unitPrice
    --
    +getSubtotal() : Float
}

' ─────────────────────────────────────────
' PAYMENT
' ─────────────────────────────────────────
class Payment {
    +String paymentId
    +String method
    +Float amount
    +String status
    +DateTime paidAt
    +String transactionRef
    --
    +processPayment()
    +refund()
}

' ─────────────────────────────────────────
' REVIEW
' ─────────────────────────────────────────
class Review {
    +String reviewId
    +Int rating
    +String comment
    +DateTime createdAt
    --
    +editReview()
    +deleteReview()
}

' ─────────────────────────────────────────
' NOTIFICATION
' ─────────────────────────────────────────
class Notification {
    +String notificationId
    +String type
    +String message
    +String channel
    +Boolean isRead
    --
    +sendSMS()
    +sendWhatsApp()
}

' ─────────────────────────────────────────
' INHERITANCE
' ─────────────────────────────────────────
User <|-- Customer
User <|-- Farmer
User <|-- Admin

' ─────────────────────────────────────────
' ASSOCIATIONS
' ─────────────────────────────────────────
Customer "1" --> "1" Cart            : has
Cart     "1" *-- "0..*" CartItem     : contains
CartItem "0..*" --> "1" Product      : references

Customer "1" --> "0..*" Order        : places
Order    "1" *-- "1..*" OrderItem    : contains
OrderItem "0..*" --> "1" Product     : references

Order    "1" --> "1" Payment         : paid via
Customer "1" --> "0..*" Review       : writes
Review   "0..*" --> "1" Product      : about

Farmer   "1" --> "0..*" Product      : manages
Order    "1" --> "0..*" Notification : triggers
Admin    "1" --> "0..*" Product      : approves

@enduml
```

---

## 2️⃣ USE CASE DIAGRAM — PlantUML Code

```plantuml
@startuml FreshDirect_UseCaseDiagram

skinparam backgroundColor #FAFFF7
skinparam usecase {
    BackgroundColor #E8F5E9
    BorderColor #2D6A4F
    FontColor #1B1B1B
    ArrowColor #2D6A4F
}
skinparam actor {
    BackgroundColor #D4EDDA
    BorderColor #2D6A4F
    FontColor #1B1B1B
}
skinparam rectangle {
    BackgroundColor #F0FFF4
    BorderColor #52B788
}
skinparam title {
    FontSize 18
    FontStyle Bold
}

title Fresh Direct — Use Case Diagram

' ─────────────────────────────────────────
' ACTORS
' ─────────────────────────────────────────
actor "Customer"           as Customer   #2D6A4F
actor "Farmer / Vendor"    as Farmer     #B7950B
actor "Admin"              as Admin      #5E3B8C
actor "Payment Gateway\n(LANKAQR/Card/COD)" as PayGW  #1D4E89
actor "Notification Service\n(WhatsApp/SMS)"  as Notify #0F4C75
actor "Analytics\n(Recharts)"               as Analytics #3A3A3A

' ─────────────────────────────────────────
' SYSTEM BOUNDARY
' ─────────────────────────────────────────
rectangle "🌿 Fresh Direct System" {

    ' ── Common ──────────────────────────
    usecase "Register / Login"   as UC_Login
    usecase "Authentication"     as UC_Auth

    ' ── Customer ────────────────────────
    usecase "Search & Browse Products"  as UC_Browse
    usecase "View Farmer Profiles"      as UC_ViewFarmer
    usecase "Manage Shopping Cart"      as UC_Cart
    usecase "Place Order"               as UC_Order
    usecase "Make Payment"              as UC_Payment
    usecase "Track Order"               as UC_Track
    usecase "Add Reviews & Ratings"     as UC_Review

    ' ── Farmer ──────────────────────────
    usecase "Manage Product Listings"   as UC_ManageProducts
    usecase "Update Inventory"          as UC_Inventory
    usecase "View Received Orders"      as UC_ViewOrders

    ' ── Admin ───────────────────────────
    usecase "Manage Users"              as UC_ManageUsers
    usecase "Approve Product Listings"  as UC_Approve
    usecase "Manage Orders & Logistics" as UC_Logistics
    usecase "View Sales Analytics"      as UC_Analytics
}

' ─────────────────────────────────────────
' CUSTOMER ASSOCIATIONS
' ─────────────────────────────────────────
Customer --> UC_Login
Customer --> UC_Browse
Customer --> UC_ViewFarmer
Customer --> UC_Cart
Customer --> UC_Order
Customer --> UC_Payment
Customer --> UC_Track
Customer --> UC_Review

' ─────────────────────────────────────────
' FARMER ASSOCIATIONS
' ─────────────────────────────────────────
Farmer --> UC_Login
Farmer --> UC_ManageProducts
Farmer --> UC_Inventory
Farmer --> UC_ViewOrders

' ─────────────────────────────────────────
' ADMIN ASSOCIATIONS
' ─────────────────────────────────────────
Admin --> UC_Login
Admin --> UC_ManageUsers
Admin --> UC_Approve
Admin --> UC_Logistics
Admin --> UC_Analytics

' ─────────────────────────────────────────
' EXTERNAL SYSTEM ASSOCIATIONS
' ─────────────────────────────────────────
UC_Payment  --> PayGW
UC_Track    --> Notify
UC_Analytics --> Analytics

' ─────────────────────────────────────────
' INCLUDE RELATIONSHIPS
' ─────────────────────────────────────────
UC_Login  .> UC_Auth          : <<include>>
UC_Order  .> UC_Cart          : <<include>>
UC_Payment .> UC_Order        : <<include>>

' ─────────────────────────────────────────
' EXTEND RELATIONSHIPS
' ─────────────────────────────────────────
UC_Track  .> UC_Order         : <<extend>>
UC_Review .> UC_Order         : <<extend>>
UC_Approve .> UC_ManageProducts : <<extend>>

@enduml
```

---

## 📌 How to Use

| Tool | How to Run |
|------|-----------|
| **PlantUML Online Editor** | Go to [https://www.plantuml.com/plantuml/uml/](https://www.plantuml.com/plantuml/uml/) and paste the code |
| **VS Code** | Install **PlantUML extension** → Right click → Preview |
| **IntelliJ IDEA** | Install **PlantUML Integration** plugin |
| **draw.io** | Import PlantUML via Extras → Edit Diagram |
