# Business Requirements Document (BRD)

## Category Management - Admin Panel

**Document Version:** 1.0  
**Date:** October 15, 2025  
**Project:** 3DOS Marketplace Backend - Admin Panel  
**Module:** Category Management System

---

## 1. EXECUTIVE SUMMARY

### 1.1 Purpose

This document outlines the business requirements for developing the front-end interface of the Category Management module in the Admin Panel. The system allows administrators to create, read, update, and delete product categories in a hierarchical structure.

### 1.2 Scope

- Category CRUD operations (Create, Read, Update, Delete)
- Hierarchical category management (parent-child relationships)
- Category tree visualization
- Product assignment to categories
- SEO management for categories
- Category search and filtering

### 1.3 Target Users

- System Administrators
- Content Managers
- Category Managers

---

## 2. API BASE CONFIGURATION

### 2.1 Base URL

```
Production: https://api.yourdomain.com/v1/categories
Development: http://localhost:3000/v1/categories
```

### 2.2 Authentication

All admin routes require Bearer Token authentication in the header:

```
Authorization: Bearer {JWT_TOKEN}
```

### 2.3 Required Permissions

- **getCategories**: View categories
- **manageCategories**: Create, update, delete, and manage categories

---

## 3. DATA MODEL

### 3.1 Category Object Structure

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Electronics",
  "slug": "electronics",
  "description": "Electronic products and gadgets",
  "parent": "507f1f77bcf86cd799439012",
  "ancestors": ["507f1f77bcf86cd799439012"],
  "categoryPath": ["home", "products"],
  "isActive": true,
  "sortOrder": 0,
  "level": 1,
  "productCount": 150,
  "image": {
    "url": "https://example.com/image.jpg",
    "key": "categories/electronics.jpg"
  },
  "seoTitle": "Electronics - Best Electronic Products",
  "seoDescription": "Browse our collection of electronic products...",
  "seoSlug": "electronics",
  "semanticKeywords1": ["gadgets", "devices"],
  "semanticKeywords2": ["tech", "electronics"],
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-10-15T14:20:00.000Z",
  "fullPath": "Home / Products / Electronics",
  "urlPath": "/category/home/products/electronics"
}
```

### 3.2 Field Descriptions

| Field            | Type     | Required | Description                      | Validation                            |
| ---------------- | -------- | -------- | -------------------------------- | ------------------------------------- |
| `name`           | String   | Yes      | Category name                    | Max 100 chars                         |
| `slug`           | String   | No       | Auto-generated URL-friendly name | Unique, lowercase                     |
| `description`    | String   | No       | Category description             | Max 500 chars                         |
| `parent`         | ObjectId | No       | Parent category ID               | Valid MongoDB ObjectId (24 hex chars) |
| `ancestors`      | Array    | No       | Array of ancestor category IDs   | Auto-generated                        |
| `categoryPath`   | Array    | No       | Array of slug paths              | Auto-generated                        |
| `isActive`       | Boolean  | No       | Active status                    | Default: true                         |
| `sortOrder`      | Number   | No       | Display order                    | Integer, min: 0, default: 0           |
| `level`          | Number   | No       | Hierarchy level                  | Auto-generated                        |
| `productCount`   | Number   | No       | Number of products               | Auto-updated                          |
| `image.url`      | String   | No       | Image URL                        | Valid URI                             |
| `image.key`      | String   | No       | Storage key                      | String                                |
| `seoTitle`       | String   | No       | SEO meta title                   | Max 60 chars                          |
| `seoDescription` | String   | No       | SEO meta description             | Max 160 chars                         |
| `seoSlug`        | String   | No       | SEO-friendly slug                | String                                |

---

## 4. API ENDPOINTS

### 4.1 GET Categories (Paginated List)

**Endpoint:** `GET /v1/category/`

**Authentication:** Required (getCategories permission)

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | String | No | - | Filter by name |
| `parent` | String (ObjectId) | No | - | Filter by parent ID |
| `isActive` | Boolean | No | - | Filter by active status |
| `level` | Number | No | - | Filter by hierarchy level |
| `sortBy` | String | No | - | Sort format: `field:asc` or `field:desc` |
| `limit` | Number | No | 10 | Items per page (1-100) |
| `page` | Number | No | 1 | Page number |
| `populate` | String | No | - | Fields to populate |

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "Categories retrieved successfully",
  "data": {
    "results": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Electronics",
        "slug": "electronics",
        "description": "Electronic products",
        "parent": null,
        "isActive": true,
        "sortOrder": 0,
        "level": 0,
        "productCount": 150,
        "createdAt": "2025-01-15T10:30:00.000Z",
        "updatedAt": "2025-10-15T14:20:00.000Z"
      }
    ],
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "totalResults": 48
  }
}
```

---

### 4.2 GET Category by ID

**Endpoint:** `GET /v1/category/:categoryId`

**Authentication:** Required (getCategories permission)

**URL Parameters:**

- `categoryId` (String, Required): MongoDB ObjectId (24 hex characters)

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "Category retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Electronics",
    "slug": "electronics",
    "description": "Electronic products and gadgets",
    "parent": null,
    "ancestors": [],
    "categoryPath": [],
    "isActive": true,
    "sortOrder": 0,
    "level": 0,
    "productCount": 150,
    "image": {
      "url": "https://example.com/image.jpg",
      "key": "categories/electronics.jpg"
    },
    "seoTitle": "Electronics - Best Electronic Products",
    "seoDescription": "Browse our collection...",
    "seoSlug": "electronics",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-10-15T14:20:00.000Z"
  }
}
```

**Response (404 Not Found):**

```json
{
  "status": "error",
  "message": "Category not found",
  "data": null
}
```

---

### 4.3 CREATE Category

**Endpoint:** `POST /v1/category/`

**Authentication:** Required (manageCategories permission)

**Request Body:**

```json
{
  "name": "Smartphones",
  "description": "Mobile phones and accessories",
  "parent": "507f1f77bcf86cd799439011",
  "isActive": true,
  "sortOrder": 1,
  "image": {
    "url": "https://example.com/smartphones.jpg",
    "key": "categories/smartphones.jpg"
  },
  "seoTitle": "Smartphones - Latest Mobile Phones",
  "seoDescription": "Discover the latest smartphones with cutting-edge technology"
}
```

**Required Fields:**

- `name` (String): Category name (max 100 chars)

**Optional Fields:**

- `description` (String): Category description (max 500 chars)
- `parent` (String): Parent category ID (24 hex chars)
- `isActive` (Boolean): Active status (default: true)
- `sortOrder` (Number): Sort order (min: 0, default: 0)
- `image` (Object): Image details
  - `url` (String): Image URL
  - `key` (String): Storage key
- `seoTitle` (String): SEO title (max 60 chars)
- `seoDescription` (String): SEO description (max 160 chars)

**Response (201 Created):**

```json
{
  "status": "success",
  "message": "Category created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Smartphones",
    "slug": "smartphones",
    "description": "Mobile phones and accessories",
    "parent": "507f1f77bcf86cd799439011",
    "ancestors": ["507f1f77bcf86cd799439011"],
    "categoryPath": ["electronics"],
    "isActive": true,
    "sortOrder": 1,
    "level": 1,
    "productCount": 0,
    "image": {
      "url": "https://example.com/smartphones.jpg",
      "key": "categories/smartphones.jpg"
    },
    "seoTitle": "Smartphones - Latest Mobile Phones",
    "seoDescription": "Discover the latest smartphones...",
    "createdAt": "2025-10-15T14:30:00.000Z",
    "updatedAt": "2025-10-15T14:30:00.000Z"
  }
}
```

---

### 4.4 UPDATE Category

**Endpoint:** `PUT /v1/category/:categoryId`

**Authentication:** Required (manageCategories permission)

**URL Parameters:**

- `categoryId` (String, Required): MongoDB ObjectId

**Request Body:**

```json
{
  "name": "Smart Phones",
  "description": "Updated description",
  "isActive": false,
  "sortOrder": 2,
  "seoTitle": "Updated SEO Title",
  "seoDescription": "Updated SEO Description"
}
```

**Updatable Fields:**

- `name` (String): Category name
- `description` (String): Category description
- `parent` (String): Parent category ID
- `isActive` (Boolean): Active status
- `sortOrder` (Number): Sort order
- `image` (Object): Image details
- `seoTitle` (String): SEO title
- `seoDescription` (String): SEO description
- `seoSlug` (String): Custom SEO slug

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "Category updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Smart Phones",
    "slug": "smart-phones",
    "description": "Updated description",
    "isActive": false,
    "sortOrder": 2,
    "updatedAt": "2025-10-15T14:45:00.000Z"
  }
}
```

**Important Notes:**

- When `name` is updated, a new slug is auto-generated
- Old slugs are tracked in history for redirects
- When `parent` is changed, the entire hierarchy (ancestors, categoryPath, level) is automatically updated
- All child categories are also updated recursively

---

### 4.5 DELETE Category

**Endpoint:** `DELETE /v1/category/:categoryId`

**Authentication:** Required (manageCategories permission)

**URL Parameters:**

- `categoryId` (String, Required): MongoDB ObjectId

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `force` | Boolean | No | false | Force delete even if category has children |

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "Category deleted successfully",
  "data": null
}
```

**Important Notes:**

- By default, categories with children cannot be deleted
- Use `force=true` query parameter to force delete (this will also delete all child categories)
- Deleted category slugs are preserved in history for redirect purposes

---

### 4.6 ASSIGN Category to Product

**Endpoint:** `POST /v1/category/:categoryId/products/assign`

**Authentication:** Required (manageCategories permission)

**URL Parameters:**

- `categoryId` (String, Required): MongoDB ObjectId

**Request Body:**

```json
{
  "productId": "507f1f77bcf86cd799439020"
}
```

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "Category assigned to product successfully",
  "data": {
    "productId": "507f1f77bcf86cd799439020",
    "categoryId": "507f1f77bcf86cd799439013",
    "categoryName": "Smartphones"
  }
}
```

---

### 4.7 UPDATE Product Count

**Endpoint:** `POST /v1/category/:categoryId/update-product-count`

**Authentication:** Required (manageCategories permission)

**URL Parameters:**

- `categoryId` (String, Required): MongoDB ObjectId

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "Product count updated successfully",
  "data": null
}
```

**Important Notes:**

- This endpoint recalculates the product count for the specified category
- It counts only active products (status: true)
- Useful after bulk product operations or data migrations

---

## 5. UI/UX REQUIREMENTS

### 5.1 Category List View (Main Dashboard)

#### Layout

- **Header Section**

  - Page title: "Category Management"
  - "Create New Category" button (primary action button, top-right)
  - Search bar (global search across categories)
  - Filter button to show/hide advanced filters

- **Filter Panel** (Collapsible)

  - Parent Category dropdown (searchable)
  - Status filter (All / Active / Inactive)
  - Level filter (All / Level 0 / Level 1 / Level 2 / etc.)
  - Sort by dropdown (Name A-Z / Name Z-A / Created Date / Updated Date / Sort Order)
  - "Apply Filters" and "Reset Filters" buttons

- **Data Table**

  - Columns:
    1. Image (thumbnail, 40x40px)
    2. Name (bold, clickable)
    3. Slug (small text, gray)
    4. Parent (show parent name or "Root")
    5. Level (badge)
    6. Product Count (badge with count)
    7. Status (toggle switch - Active/Inactive)
    8. Sort Order (editable inline)
    9. Actions (dropdown menu)
  - Table Features:
    - Column sorting (ascending/descending)
    - Row selection (checkboxes for bulk actions)
    - Pagination controls (10/25/50/100 per page)
    - Row hover effect
    - Responsive design (collapse to cards on mobile)

- **Actions Column** (Dropdown menu per row)

  - View Details
  - Edit
  - Add Subcategory
  - Assign Products
  - Update Product Count
  - Delete (with confirmation)

- **Bulk Actions Bar** (appears when rows selected)
  - Activate Selected
  - Deactivate Selected
  - Delete Selected (with confirmation)
  - Export Selected

#### Behavior

- Auto-refresh after create/update/delete operations
- Loading skeleton while fetching data
- Empty state when no categories exist (with "Create First Category" CTA)
- Error state with retry button on API failure
- Success/error toast notifications for all actions

---

### 5.2 Category Tree View (Alternative View)

#### Layout

- **Toggle Button** to switch between "List View" and "Tree View"
- **Expandable Tree Structure**

  - Root categories shown by default
  - Click to expand/collapse children
  - Drag-and-drop to reorder categories
  - Drag-and-drop to change parent (with confirmation)
  - Visual indentation showing hierarchy
  - Icons: folder (closed), folder-open (expanded)

- **Tree Node Display**
  - Category icon/image
  - Category name
  - Product count badge
  - Active/inactive status indicator
  - Quick actions (inline icons):
    - Edit (pencil icon)
    - Add child (plus icon)
    - Delete (trash icon)

#### Behavior

- Expand/collapse animation
- Highlight selected category
- Breadcrumb trail when navigating deep hierarchies
- Search highlights matching categories and auto-expands parents
- Lazy loading for large trees (load children on expand)

---

### 5.3 Create/Edit Category Form

#### Layout

- **Modal or Drawer** (user preference)
- Form divided into tabs:
  1. **Basic Information**
  2. **SEO Settings**
  3. **Media**

#### Tab 1: Basic Information

- **Name** (Text input, required)
  - Character counter (0/100)
  - Real-time slug preview below input
- **Description** (Textarea)

  - Character counter (0/500)
  - Optional rich text editor

- **Parent Category** (Searchable dropdown)

  - Option: "None (Root Category)"
  - Shows hierarchical path for each option
  - Cannot select self or descendants (validation)

- **Status** (Toggle switch)

  - Active / Inactive
  - Warning message if deactivating with active products

- **Sort Order** (Number input)
  - Min: 0
  - Default: 0
  - Tooltip: "Lower numbers appear first"

#### Tab 2: SEO Settings

- **SEO Title** (Text input)
  - Character counter (0/60)
  - Preview how it appears in Google search results
- **SEO Description** (Textarea)

  - Character counter (0/160)
  - Preview how it appears in Google search results

- **Custom SEO Slug** (Text input, optional)
  - Auto-populated from name
  - Can be manually overridden
  - Shows URL preview: `yoursite.com/category/{slug}`
  - Validates for URL-safe characters

#### Tab 3: Media

- **Category Image** (Image uploader)
  - Drag-and-drop or click to upload
  - Recommended size: 800x600px
  - Max file size: 2MB
  - Accepted formats: JPG, PNG, WebP
  - Image preview with crop/zoom tools
  - "Remove Image" button

#### Form Actions

- **Save** (primary button)
- **Save & Add Another** (secondary button, for create only)
- **Cancel** (tertiary button)

#### Behavior

- Real-time validation with inline error messages
- Auto-save draft (optional, every 30 seconds)
- Unsaved changes warning on navigation
- Loading state on submit
- Success message with "View Category" and "Edit Again" options

---

### 5.4 Category Detail View

#### Layout

- **Breadcrumb Navigation** (Category path)
- **Header Section**

  - Category image (left, 200x200px)
  - Category details (right):
    - Name (H1)
    - Slug (small text)
    - Status badge (Active/Inactive)
    - Parent category link (if exists)
    - Level badge
    - Edit button (top-right)
    - Delete button (top-right)

- **Statistics Cards Row**

  - Total Products
  - Active Products
  - Direct Children Categories
  - Total Descendants

- **Tabs Section**
  1. **Overview**
  2. **Products**
  3. **Subcategories**
  4. **SEO**
  5. **History**

#### Tab 1: Overview

- Description
- Full category path
- Created date
- Last updated date
- Sort order

#### Tab 2: Products

- List of products in this category
- Filterable and sortable
- "Add Products" button
- Bulk assign/unassign actions
- Product count updater button

#### Tab 3: Subcategories

- List of direct children
- "Add Subcategory" button
- Drag-and-drop to reorder
- Quick actions per subcategory

#### Tab 4: SEO

- SEO title (with edit button)
- SEO description (with edit button)
- SEO slug (with edit button)
- URL preview
- Google search result preview
- Semantic keywords (if available)

#### Tab 5: History

- Audit log of changes
  - Date/time
  - User who made change
  - Action type (created, updated, deleted)
  - Fields changed (before/after values)
- Slug history (old slugs with redirect status)

---

### 5.5 Delete Confirmation Dialog

#### Layout

- **Warning Icon** (red triangle with exclamation)
- **Title:** "Delete Category"
- **Message:**

  - If no children: "Are you sure you want to delete '{CategoryName}'? This action cannot be undone."
  - If has children: "This category has {X} subcategories. Deleting it will also delete all subcategories. Are you sure?"
  - If has products: "This category contains {X} products. Products will not be deleted, but will lose this category assignment."

- **Checkbox** (if has children):

  - "I understand that all {X} subcategories will be permanently deleted"

- **Actions:**
  - "Cancel" (secondary button)
  - "Delete" (danger button, disabled until checkbox checked if applicable)

---

### 5.6 Product Assignment Interface

#### Layout

- **Modal:** "Assign Products to {CategoryName}"
- **Search Bar** (top)

  - Search products by name, SKU, or ID
  - Real-time search results

- **Two-Column Layout:**

  - **Left Column:** Available Products
    - List of unassigned products
    - Checkboxes for multi-select
    - Pagination
  - **Right Column:** Assigned Products
    - List of currently assigned products
    - Remove button per product
    - Total count

- **Actions:**
  - "Assign Selected" button (moves from left to right)
  - "Save Changes" (primary button)
  - "Cancel" (secondary button)

---

## 6. TECHNICAL SPECIFICATIONS

### 6.1 State Management

- Use Redux, Zustand, or Context API for global state
- Store:
  - Current category list
  - Selected category
  - Filters and pagination state
  - Loading states
  - Error states

### 6.2 API Integration

- Use Axios or Fetch API
- Implement request interceptors for authentication
- Implement response interceptors for error handling
- Implement retry logic for failed requests (3 attempts)
- Cache responses where appropriate (tree view, dropdowns)

### 6.3 Error Handling

- Display user-friendly error messages
- Log errors to console (development)
- Send errors to monitoring service (production)
- Common error scenarios:
  - 400 Bad Request: Show validation errors per field
  - 401 Unauthorized: Redirect to login
  - 403 Forbidden: Show "You don't have permission" message
  - 404 Not Found: Show "Category not found" message
  - 500 Server Error: Show "Something went wrong" with retry button

### 6.4 Performance Optimization

- Lazy load components
- Implement virtual scrolling for large lists
- Debounce search inputs (300ms)
- Optimize images (lazy loading, WebP format)
- Minimize API calls (caching, pagination)
- Use React.memo / useMemo / useCallback where appropriate

### 6.5 Accessibility (WCAG 2.1 Level AA)

- Keyboard navigation support (Tab, Enter, Escape)
- Screen reader friendly (ARIA labels, roles, descriptions)
- Focus indicators on interactive elements
- Color contrast ratio 4.5:1 minimum
- Alt text for all images
- Form labels properly associated with inputs
- Error messages announced to screen readers

### 6.6 Responsive Design

- Mobile-first approach
- Breakpoints:
  - Mobile: < 768px (collapsed navigation, stacked layout)
  - Tablet: 768px - 1024px (adapted layout)
  - Desktop: > 1024px (full layout)
- Touch-friendly buttons (min 44x44px)
- Swipe gestures for mobile (optional)

---

## 7. VALIDATION RULES

### 7.1 Client-Side Validation

#### Name Field

- Required
- Min length: 1 character
- Max length: 100 characters
- Allowed: Letters, numbers, spaces, hyphens, underscores
- Error messages:
  - Empty: "Category name is required"
  - Too long: "Name must be 100 characters or less"

#### Description Field

- Optional
- Max length: 500 characters
- Error message:
  - Too long: "Description must be 500 characters or less"

#### Parent Field

- Optional (null for root categories)
- Must be valid MongoDB ObjectId (24 hex characters)
- Cannot be the category itself (for edit)
- Cannot be a descendant (for edit)
- Error messages:
  - Invalid ID: "Invalid parent category"
  - Circular reference: "Cannot set a descendant as parent"

#### Sort Order Field

- Optional (default: 0)
- Must be integer
- Min: 0
- Error messages:
  - Invalid: "Sort order must be a positive number"

#### Image Field

- Optional
- URL must be valid HTTP/HTTPS URL
- Error messages:
  - Invalid URL: "Please enter a valid image URL"

#### SEO Title Field

- Optional
- Max length: 60 characters
- Error message:
  - Too long: "SEO title should be 60 characters or less for optimal search results"
  - Warning (> 50 chars): "Consider shortening for better display"

#### SEO Description Field

- Optional
- Max length: 160 characters
- Error messages:
  - Too long: "SEO description should be 160 characters or less"
  - Warning (> 150 chars): "Consider shortening for better display"

### 7.2 Server-Side Validation

All validation rules above are also enforced on the server. Client-side validation is for UX only; never trust client input.

---

## 8. USER FLOWS

### 8.1 Create New Category Flow

1. User clicks "Create New Category" button
2. Modal/drawer opens with empty form
3. User fills in required fields (minimum: name)
4. User optionally selects parent category
5. User optionally fills SEO fields
6. User optionally uploads image
7. User clicks "Save"
8. Loading state shown on button
9. If validation fails:
   - Show error messages inline
   - Focus first error field
   - Keep form open
10. If successful:
    - Show success toast: "Category created successfully"
    - Close modal/drawer
    - Refresh category list
    - Highlight newly created category
11. If "Save & Add Another" clicked:
    - Show success toast
    - Clear form
    - Keep modal open
    - Focus on name field

### 8.2 Edit Category Flow

1. User clicks edit action on a category
2. Modal/drawer opens with pre-filled form
3. User modifies fields
4. User clicks "Save"
5. Loading state shown
6. If validation fails:
   - Show error messages
   - Keep form open
7. If name changed:
   - Show info message: "Changing the name will generate a new slug. Old slug will redirect automatically."
8. If parent changed:
   - Show warning: "Changing parent will update the hierarchy for this category and all subcategories"
9. If successful:
   - Show success toast: "Category updated successfully"
   - Close modal
   - Refresh category list/detail view
   - Update breadcrumb if needed

### 8.3 Delete Category Flow

1. User clicks delete action
2. System checks for children and products
3. Confirmation dialog appears with appropriate warning
4. If has children:
   - Show count and require checkbox confirmation
5. User confirms deletion
6. Loading state shown
7. If successful:
   - Show success toast: "Category deleted successfully"
   - Remove from list
   - If viewing detail page, redirect to list
8. If error (e.g., database constraint):
   - Show error message: "Cannot delete category. Please contact support."

### 8.4 Bulk Operations Flow

1. User selects multiple categories (checkboxes)
2. Bulk actions bar appears at bottom of screen
3. User selects action (activate/deactivate/delete)
4. Confirmation dialog appears
5. User confirms
6. Loading state shown on action bar
7. Process each category sequentially or in batch
8. Show progress indicator if > 10 items
9. On completion:
   - Show success toast: "X categories updated successfully"
   - If some failed: "X succeeded, Y failed. View details."
   - Refresh list
   - Clear selection

### 8.5 Search and Filter Flow

1. User types in search box (debounced 300ms)
2. Loading indicator appears in search box
3. API call made with search query
4. Results displayed, replacing current list
5. If no results:
   - Show empty state: "No categories found matching '{query}'"
   - Show "Clear search" button
6. User applies additional filters
7. Filters combined with search
8. Results update
9. Active filters shown as removable chips/badges
10. "Clear all filters" button available

---

## 9. ERROR SCENARIOS & HANDLING

### 9.1 API Errors

| Status Code | Scenario           | User Message                                         | Action                         |
| ----------- | ------------------ | ---------------------------------------------------- | ------------------------------ |
| 400         | Invalid input      | "Please check the form for errors"                   | Show field-level errors        |
| 401         | Not authenticated  | "Your session has expired. Please login again."      | Redirect to login              |
| 403         | No permission      | "You don't have permission to perform this action"   | Show message, disable actions  |
| 404         | Category not found | "This category no longer exists"                     | Redirect to list, refresh data |
| 409         | Duplicate slug     | "A category with this name already exists"           | Highlight name field           |
| 500         | Server error       | "Something went wrong. Please try again."            | Show retry button              |
| Network     | No connection      | "No internet connection. Please check your network." | Show retry button              |

### 9.2 Form Validation Errors

- Display inline below each field with error
- Use red color for error text
- Show error icon next to field
- Prevent form submission until resolved
- First error field should be focused

### 9.3 Timeout Handling

- API timeout: 30 seconds
- If timeout occurs:
  - Show message: "Request is taking longer than expected. Please wait or try again."
  - Provide "Cancel" and "Keep Waiting" options

---

## 10. NOTIFICATIONS & FEEDBACK

### 10.1 Toast Notifications

- **Success** (green, 3 seconds)

  - "Category created successfully"
  - "Category updated successfully"
  - "Category deleted successfully"
  - "X categories updated successfully"

- **Error** (red, 5 seconds)

  - "Failed to create category"
  - "Failed to update category"
  - "Failed to delete category"
  - "Something went wrong. Please try again."

- **Warning** (yellow, 4 seconds)

  - "This category has products assigned"
  - "Changing parent will affect subcategories"

- **Info** (blue, 4 seconds)
  - "Product count updated"
  - "Changes saved as draft"

### 10.2 Loading States

- **Button Loading**: Show spinner inside button, disable button
- **Table Loading**: Show skeleton loader (shimmer effect)
- **Modal Loading**: Show spinner in center
- **Inline Loading**: Show small spinner next to element

### 10.3 Empty States

- **No Categories**:

  - Icon: Empty folder illustration
  - Message: "No categories yet"
  - Action: "Create your first category" button

- **No Search Results**:

  - Icon: Search with X illustration
  - Message: "No categories found matching '{query}'"
  - Action: "Clear search" button

- **No Subcategories**:
  - Icon: Empty list illustration
  - Message: "No subcategories"
  - Action: "Add subcategory" button

---

## 11. SECURITY CONSIDERATIONS

### 11.1 Authentication & Authorization

- All API requests must include valid JWT token
- Token stored in httpOnly cookie (preferred) or localStorage
- Token refresh mechanism before expiry
- Handle token expiry gracefully (redirect to login)
- Check user permissions before showing actions:
  - `getCategories`: View-only access
  - `manageCategories`: Full CRUD access

### 11.2 Input Sanitization

- Sanitize all user inputs before sending to API
- Prevent XSS attacks:
  - Escape HTML in user-generated content
  - Use DOMPurify for rich text content
- Validate file uploads:
  - Check file type (MIME type + extension)
  - Check file size
  - Scan for malicious content (if possible)

### 11.3 Data Protection

- Never log sensitive data
- Use HTTPS for all API calls
- Implement CSRF protection
- Don't expose internal IDs in URLs (optional, use UUIDs)

---

## 12. TESTING REQUIREMENTS

### 12.1 Unit Tests

- Test all utility functions
- Test validation logic
- Test state management actions/reducers
- Target: > 80% code coverage

### 12.2 Integration Tests

- Test API integration with mock server
- Test form submission flows
- Test error handling scenarios

### 12.3 E2E Tests (Optional but Recommended)

- Test complete user flows:
  - Create category
  - Edit category
  - Delete category
  - Search and filter
  - Bulk operations
- Use Cypress, Playwright, or Selenium

### 12.4 Manual Testing Checklist

- [ ] Create root category
- [ ] Create nested category (3+ levels deep)
- [ ] Edit category name (verify slug change)
- [ ] Change parent category (verify hierarchy update)
- [ ] Toggle category active status
- [ ] Delete category without children
- [ ] Delete category with children (force delete)
- [ ] Search categories
- [ ] Filter by parent, status, level
- [ ] Sort by different columns
- [ ] Pagination works correctly
- [ ] Bulk activate/deactivate
- [ ] Bulk delete
- [ ] Form validation works
- [ ] Image upload works
- [ ] SEO fields save correctly
- [ ] Responsive design on mobile
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility

---

## 13. PERFORMANCE BENCHMARKS

### 13.1 Page Load Time

- Initial page load: < 2 seconds
- Subsequent navigations: < 500ms
- API response time: < 300ms (average)

### 13.2 Lighthouse Scores (Target)

- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90

---

## 14. BROWSER SUPPORT

### 14.1 Supported Browsers

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

### 14.2 Unsupported Browsers

- Internet Explorer (any version)
- Show message: "Your browser is not supported. Please use Chrome, Firefox, Safari, or Edge."

---

## 15. DESIGN SYSTEM & STYLING

### 15.1 Recommended Component Library

- Material-UI (MUI)
- Ant Design
- Chakra UI
- Custom components based on design system

### 15.2 Color Palette

- Primary: #1976D2 (blue)
- Success: #4CAF50 (green)
- Error: #F44336 (red)
- Warning: #FF9800 (orange)
- Info: #2196F3 (light blue)
- Gray scale: #F5F5F5, #E0E0E0, #BDBDBD, #757575, #424242

### 15.3 Typography

- Font family: 'Roboto', 'Inter', or 'SF Pro'
- Headings: Bold, varying sizes (H1: 32px, H2: 24px, H3: 18px)
- Body text: Regular, 14px
- Small text: 12px

### 15.4 Spacing

- Use 8px grid system
- Common values: 8px, 16px, 24px, 32px, 48px

### 15.5 Icons

- Use consistent icon library (Material Icons, Font Awesome, Heroicons)
- Icon size: 20px (small), 24px (default), 32px (large)

---

## 16. DEPLOYMENT CHECKLIST

### 16.1 Pre-Deployment

- [ ] All features implemented and tested
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] E2E tests passing (if applicable)
- [ ] Accessibility audit completed
- [ ] Performance audit completed
- [ ] Security audit completed
- [ ] Code review approved
- [ ] Documentation updated

### 16.2 Configuration

- [ ] Environment variables configured
- [ ] API endpoints set correctly (dev/staging/prod)
- [ ] Authentication configured
- [ ] Error tracking configured (Sentry, Rollbar, etc.)
- [ ] Analytics configured (Google Analytics, Mixpanel, etc.)

### 16.3 Post-Deployment

- [ ] Smoke tests in production
- [ ] Monitor error logs
- [ ] Monitor performance metrics
- [ ] Collect user feedback
- [ ] Create post-deployment report

---

## 17. FUTURE ENHANCEMENTS (Out of Scope)

These features are not required for v1 but may be considered for future versions:

1. **Drag-and-Drop Category Reordering**

   - Visual drag-and-drop in tree view
   - Update sortOrder and parent automatically

2. **Bulk Import/Export**

   - Import categories from CSV/Excel
   - Export categories to CSV/Excel

3. **Category Templates**

   - Save category structures as templates
   - Apply templates to create multiple categories quickly

4. **Advanced SEO Features**

   - Open Graph tags
   - Twitter Card tags
   - Schema markup

5. **Category Analytics**

   - View count per category
   - Conversion rate per category
   - Revenue per category

6. **Category Relationships**

   - Related categories
   - Recommended categories

7. **Multi-language Support**

   - Translate category names and descriptions
   - Language-specific slugs

8. **Version History**

   - View all historical versions
   - Rollback to previous version

9. **Approval Workflow**

   - Submit changes for approval
   - Admin approves/rejects changes

10. **Custom Fields**
    - Add custom metadata fields per category
    - Flexible schema

---

## 18. SUPPORT & DOCUMENTATION

### 18.1 Developer Documentation

- API documentation (Swagger/OpenAPI)
- Component documentation (Storybook)
- Setup guide (README.md)
- Contributing guidelines
- Code style guide

### 18.2 User Documentation

- Admin user guide
- Video tutorials
- FAQ section
- Troubleshooting guide

### 18.3 Support Channels

- GitHub Issues (for bugs)
- Slack/Discord (for questions)
- Email support (for critical issues)

---

## 19. GLOSSARY

| Term                | Definition                                                            |
| ------------------- | --------------------------------------------------------------------- |
| **Category**        | A classification for organizing products in a hierarchical structure  |
| **Slug**            | URL-friendly version of category name (e.g., "electronics-gadgets")   |
| **Parent Category** | The category one level above in the hierarchy                         |
| **Child Category**  | The category one level below in the hierarchy (subcategory)           |
| **Ancestor**        | Any category above in the hierarchy (parent, grandparent, etc.)       |
| **Descendant**      | Any category below in the hierarchy (children, grandchildren, etc.)   |
| **Root Category**   | Top-level category with no parent                                     |
| **Leaf Category**   | Bottom-level category with no children                                |
| **Level**           | Depth in hierarchy (0 = root, 1 = first child, etc.)                  |
| **Sort Order**      | Number determining display order (lower appears first)                |
| **SEO**             | Search Engine Optimization - techniques to improve search visibility  |
| **CRUD**            | Create, Read, Update, Delete - basic operations                       |
| **Breadcrumb**      | Navigation trail showing hierarchy (Home > Electronics > Smartphones) |

---

## 20. CONTACT & APPROVALS

### 20.1 Project Team

- **Product Manager**: [Name, Email]
- **Backend Lead**: [Name, Email]
- **Frontend Lead**: [Name, Email]
- **UX Designer**: [Name, Email]
- **QA Lead**: [Name, Email]

### 20.2 Approval Sign-Off

- [ ] Product Manager: **\*\*\*\***\_\_\_**\*\*\*\*** Date: **\_\_\_\_**
- [ ] Technical Lead: **\*\*\*\***\_\_\_**\*\*\*\*** Date: **\_\_\_\_**
- [ ] Frontend Developer: **\*\*\*\***\_\_\_**\*\*\*\*** Date: **\_\_\_\_**

---

## APPENDIX A: API Response Examples

### Success Response Format

All successful responses follow this format:

```json
{
  "status": "success",
  "message": "Human-readable success message",
  "data": {
    /* Response data */
  }
}
```

### Error Response Format

All error responses follow this format:

```json
{
  "status": "error",
  "message": "Human-readable error message",
  "data": null,
  "errors": [
    {
      "field": "name",
      "message": "Category name is required"
    }
  ]
}
```

---

## APPENDIX B: Sample Code Snippets

### Authentication Header

```javascript
const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};
```

### API Call Example (Fetch)

```javascript
async function getCategories(page = 1, limit = 10) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/v1/category/?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}
```

### API Call Example (Axios)

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Usage
export const categoryAPI = {
  getAll: (params) => api.get("/v1/category/", { params }),
  getById: (id) => api.get(`/v1/category/${id}`),
  create: (data) => api.post("/v1/category/", data),
  update: (id, data) => api.put(`/v1/category/${id}`, data),
  delete: (id, force = false) =>
    api.delete(`/v1/category/${id}?force=${force}`),
};
```

---

## APPENDIX C: Wireframes & Mockups

_Note: Wireframes and mockups should be created by the UX/UI design team and attached to this document or provided separately._

**Required Mockups:**

1. Category List View (Desktop)
2. Category List View (Mobile)
3. Category Tree View
4. Create/Edit Category Form
5. Category Detail View
6. Delete Confirmation Dialog
7. Product Assignment Modal
8. Bulk Actions Interface

---

## APPENDIX D: Change Log

| Version | Date       | Author       | Changes              |
| ------- | ---------- | ------------ | -------------------- |
| 1.0     | 2025-10-15 | AI Assistant | Initial BRD creation |

---

**END OF DOCUMENT**
