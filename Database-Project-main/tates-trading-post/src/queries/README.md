# SQL Query Organization

This directory contains all SQL queries for the Tate's Trading Post application, organized by functional area.

## File Structure

```
src/queries/
├── checkout.ts      # Shopping cart & checkout queries
├── customers.ts     # Customer management & analytics
├── inventory.ts     # Inventory & purchase history
├── products.ts      # Product queries
├── pages.ts         # CMS page queries
└── README.md        # This file
```

## Shopping Cart & Checkout System

The shopping cart system queries are organized in **`checkout.ts`** and work together to complete purchase transactions.

### Query Flow

When a customer completes checkout, the following queries execute in order:

#### 1. Customer Management
- `findCustomerByEmail` - Check if customer exists
- `createCustomer` - Create new customer (if needed)
- `updateCustomer` - Update existing customer info (if needed)

#### 2. Purchase Recording
- `createPurchaseHistory` - Create purchase record for each cart item

#### 3. Inventory & Analytics
- `updateInventoryAfterPurchase` - Decrement product stock
- `findProductPopularity` - Check if popularity record exists
- `updateProductPopularity` - Increment purchase count (if exists)
- `createProductPopularityRecord` - Create popularity record (if new)

#### 4. Transaction Management
- `beginTransaction` - Start atomic transaction
- `commitTransaction` - Commit all changes
- `rollbackTransaction` - Undo changes on error

### Usage Example

The checkout API (`src/app/api/checkout/route.ts`) imports and uses these queries:

```typescript
import {
  findCustomerByEmail,
  createCustomer,
  updateCustomer,
  createPurchaseHistory,
  updateInventoryAfterPurchase,
  findProductPopularity,
  updateProductPopularity,
  createProductPopularityRecord,
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
} from '@/queries/checkout'

// Begin transaction
db.prepare(beginTransaction).run()

try {
  // Check existing customer
  const customer = db.prepare(findCustomerByEmail).get(email)

  // Create or update customer
  if (!customer) {
    db.prepare(createCustomer).run(firstName, lastName, email)
  }

  // Create purchase records
  db.prepare(createPurchaseHistory).run(customerId, productId, qty, price)

  // Update inventory
  db.prepare(updateInventoryAfterPurchase).run(qty, qty, productId)

  // Commit transaction
  db.prepare(commitTransaction).run()
} catch (error) {
  // Rollback on error
  db.prepare(rollbackTransaction).run()
}
```

## Database Tables Involved

### Shopping Cart System Tables

- **`a_customers`** - Customer information
  - id, first_name, last_name, email, phone, address fields
  - Created/updated during checkout

- **`a_purchase_history`** - Purchase records
  - Links customers to products they purchased
  - Stores quantity and unit price at time of purchase

- **`a_inventory`** - Product stock levels
  - Updated when purchases are made
  - Uses CASE statement to prevent negative quantities

- **`a_product_popularity`** - Product analytics
  - Tracks views, add-to-carts, and purchases
  - Auto-created on first purchase if doesn't exist

## Query Organization Benefits

### 1. **Reusability**
Queries can be used in multiple places:
- API routes
- Admin dashboard
- Analytics reports
- Hooks and background jobs

### 2. **Maintainability**
- One place to update SQL logic
- Easy to find and modify queries
- Clear documentation via comments

### 3. **Testability**
- Can test queries independently
- Easy to verify SQL syntax
- Simple to mock in tests

### 4. **SQL Demonstration**
Each query demonstrates different SQL concepts:
- JOINs (customer purchase history)
- Aggregates (revenue, totals)
- Transactions (atomic operations)
- CASE statements (inventory updates)
- GROUP BY (analytics)
- Subqueries (popularity tracking)

## Related Files

### Shopping Cart Components
- `src/contexts/CartContext.tsx` - Cart state management
- `src/components/AddToCartButton.tsx` - Add to cart UI
- `src/app/(frontend)/cart/page.tsx` - Cart page
- `src/app/(frontend)/checkout/page.tsx` - Checkout form
- `src/app/api/checkout/route.ts` - Checkout API (uses these queries)

### Collection Definitions
- `src/collections/Customers.ts` - Customer schema
- `src/collections/PurchaseHistory.ts` - Purchase history schema
- `src/collections/Inventory.ts` - Inventory schema
- `src/collections/ProductPopularity.ts` - Popularity tracking schema

## Adding New Queries

When adding new shopping cart related queries:

1. Add query to `src/queries/checkout.ts`
2. Export with descriptive name
3. Add JSDoc comment explaining:
   - What the query does
   - Required parameters
   - Where it's used
4. Import in API route or component
5. Update this README if needed

## Query Naming Conventions

- **find/get** - SELECT queries that retrieve data
  - `findCustomerByEmail`
  - `getCustomerLifetimeValue`

- **create** - INSERT queries
  - `createCustomer`
  - `createPurchaseHistory`

- **update** - UPDATE queries
  - `updateCustomer`
  - `updateInventoryAfterPurchase`

- **delete** - DELETE queries (rare, prefer soft deletes)

## Transaction Safety

All checkout operations use database transactions to ensure:
- **Atomicity** - All changes happen or none do
- **Consistency** - Data remains valid
- **Isolation** - Concurrent checkouts don't interfere
- **Durability** - Committed changes are permanent

See `beginTransaction`, `commitTransaction`, and `rollbackTransaction` in `checkout.ts`.
