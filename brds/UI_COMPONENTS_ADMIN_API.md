# UI Components Admin API Documentation

## Overview

The UI Components API allows admins to manage dynamic UI elements (sliders, banners, and cards) displayed on the frontend. These components support images, titles, subtitles, action URLs, and custom sorting.

**Base URL:** `/v1/ui-components`

**Authentication:** All admin endpoints require Bearer token authentication with `manageUsers` permission.

---

## Component Types

- **slider**: Hero sliders/carousels displayed on homepage
- **banner**: Promotional banners displayed across the site
- **card**: Featured content cards

---

## API Endpoints

### 1. Create UI Component

Create a new UI component with image upload.

**Endpoint:** `POST /v1/ui-components`

**Authentication:** Required (Admin with `manageUsers` permission)

**Content-Type:** `multipart/form-data`

**Request Body (Form Data):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| image | File | Yes | Image file (max 5MB, image formats only) |
| title | String | Yes | Component title |
| subtitle | String | No | Component subtitle |
| actionUrl | String | No | URL to navigate when component is clicked |
| status | Boolean | No | Active status (default: true) |
| sortOrder | Number | No | Display order (default: 0) |
| componentType | String | No | Type: 'slider', 'banner', or 'card' (default: 'slider') |

**Sample Request (JavaScript/Axios):**

```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]); // File object from input
formData.append('title', 'Summer Sale 2025');
formData.append('subtitle', 'Up to 50% off on all 3D models');
formData.append('actionUrl', 'https://3dos.io/promotions/summer-sale');
formData.append('status', 'true');
formData.append('sortOrder', '1');
formData.append('componentType', 'slider');

const response = await axios.post('/v1/ui-components', formData, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'multipart/form-data',
  },
});
```

**Sample Request (cURL):**

```bash
curl -X POST "https://api.3dos.io/v1/ui-components" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "image=@/path/to/image.jpg" \
  -F "title=Summer Sale 2025" \
  -F "subtitle=Up to 50% off on all 3D models" \
  -F "actionUrl=https://3dos.io/promotions/summer-sale" \
  -F "status=true" \
  -F "sortOrder=1" \
  -F "componentType=slider"
```

**Response (201 Created):**

```json
{
  "status": "success",
  "message": "UI Component created successfully",
  "data": {
    "image": {
      "url": "https://daebtr9zzzhgu.cloudfront.net/ui-components/a1b2c3d4-e5f6-4789-a1b2-c3d4e5f67890-summer-sale.jpg",
      "key": "ui-components/a1b2c3d4-e5f6-4789-a1b2-c3d4e5f67890-summer-sale.jpg"
    },
    "title": "Summer Sale 2025",
    "subtitle": "Up to 50% off on all 3D models",
    "actionUrl": "https://3dos.io/promotions/summer-sale",
    "status": true,
    "sortOrder": 1,
    "componentType": "slider",
    "id": "67e8f9a1b2c3d4e5f6789012",
    "createdAt": "2025-10-19T10:30:00.000Z",
    "updatedAt": "2025-10-19T10:30:00.000Z"
  }
}
```

**Error Responses:**

```json
// 400 Bad Request - Invalid file type
{
  "status": "error",
  "message": "Only image files are allowed",
  "code": 400
}

// 400 Bad Request - File too large
{
  "status": "error",
  "message": "File too large. Maximum size is 5MB",
  "code": 400
}

// 400 Bad Request - Missing required field
{
  "status": "error",
  "message": "\"title\" is required",
  "code": 400
}

// 401 Unauthorized
{
  "status": "error",
  "message": "Please authenticate",
  "code": 401
}

// 403 Forbidden
{
  "status": "error",
  "message": "Forbidden",
  "code": 403
}
```

---

### 2. Get All UI Components (Admin)

Retrieve all UI components with optional filtering and pagination.

**Endpoint:** `GET /v1/ui-components`

**Authentication:** Required (Admin with `manageUsers` permission)

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| componentType | String | No | Filter by type: 'slider', 'banner', or 'card' |
| status | Boolean | No | Filter by status (true/false) |
| sortBy | String | No | Sort format: `field:order` (e.g., 'sortOrder:asc') |
| limit | Number | No | Results per page (default: 10, max: 100) |
| page | Number | No | Page number (default: 1) |

**Sample Request (JavaScript/Axios):**

```javascript
const response = await axios.get('/v1/ui-components', {
  params: {
    componentType: 'slider',
    status: true,
    sortBy: 'sortOrder:asc',
    limit: 20,
    page: 1
  },
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

**Sample Request (cURL):**

```bash
curl -X GET "https://api.3dos.io/v1/ui-components?componentType=slider&status=true&sortBy=sortOrder:asc&limit=20&page=1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "UI Components fetched successfully",
  "data": {
    "results": [
      {
        "image": {
          "url": "https://daebtr9zzzhgu.cloudfront.net/ui-components/a1b2c3d4-summer-sale.jpg",
          "key": "ui-components/a1b2c3d4-summer-sale.jpg"
        },
        "title": "Summer Sale 2025",
        "subtitle": "Up to 50% off on all 3D models",
        "actionUrl": "https://3dos.io/promotions/summer-sale",
        "status": true,
        "sortOrder": 1,
        "componentType": "slider",
        "id": "67e8f9a1b2c3d4e5f6789012",
        "createdAt": "2025-10-19T10:30:00.000Z",
        "updatedAt": "2025-10-19T10:30:00.000Z"
      },
      {
        "image": {
          "url": "https://daebtr9zzzhgu.cloudfront.net/ui-components/b2c3d4e5-new-arrivals.jpg",
          "key": "ui-components/b2c3d4e5-new-arrivals.jpg"
        },
        "title": "New Arrivals",
        "subtitle": "Discover the latest 3D printable models",
        "actionUrl": "https://3dos.io/new-arrivals",
        "status": true,
        "sortOrder": 2,
        "componentType": "slider",
        "id": "67e8f9a1b2c3d4e5f6789013",
        "createdAt": "2025-10-19T11:00:00.000Z",
        "updatedAt": "2025-10-19T11:00:00.000Z"
      }
    ],
    "page": 1,
    "limit": 20,
    "totalPages": 1,
    "totalResults": 2
  }
}
```

---

### 3. Get Single UI Component

Retrieve a specific UI component by ID.

**Endpoint:** `GET /v1/ui-components/:componentId`

**Authentication:** Required (Admin with `manageUsers` permission)

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| componentId | String | Yes | MongoDB ObjectId of the component |

**Sample Request (JavaScript/Axios):**

```javascript
const componentId = '67e8f9a1b2c3d4e5f6789012';
const response = await axios.get(`/v1/ui-components/${componentId}`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

**Sample Request (cURL):**

```bash
curl -X GET "https://api.3dos.io/v1/ui-components/67e8f9a1b2c3d4e5f6789012" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "UI Component fetched successfully",
  "data": {
    "image": {
      "url": "https://daebtr9zzzhgu.cloudfront.net/ui-components/a1b2c3d4-summer-sale.jpg",
      "key": "ui-components/a1b2c3d4-summer-sale.jpg"
    },
    "title": "Summer Sale 2025",
    "subtitle": "Up to 50% off on all 3D models",
    "actionUrl": "https://3dos.io/promotions/summer-sale",
    "status": true,
    "sortOrder": 1,
    "componentType": "slider",
    "id": "67e8f9a1b2c3d4e5f6789012",
    "createdAt": "2025-10-19T10:30:00.000Z",
    "updatedAt": "2025-10-19T10:30:00.000Z"
  }
}
```

**Error Response (404 Not Found):**

```json
{
  "status": "error",
  "message": "UI Component not found",
  "code": 404
}
```

---

### 4. Update UI Component

Update an existing UI component. Image upload is optional.

**Endpoint:** `PATCH /v1/ui-components/:componentId`

**Authentication:** Required (Admin with `manageUsers` permission)

**Content-Type:** `multipart/form-data`

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| componentId | String | Yes | MongoDB ObjectId of the component |

**Request Body (Form Data):**

All fields are optional. Only include fields you want to update.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| image | File | No | New image file (max 5MB, image formats only) |
| title | String | No | Component title |
| subtitle | String | No | Component subtitle |
| actionUrl | String | No | URL to navigate when component is clicked |
| status | Boolean | No | Active status |
| sortOrder | Number | No | Display order |
| componentType | String | No | Type: 'slider', 'banner', or 'card' |

**Sample Request (JavaScript/Axios) - With Image Update:**

```javascript
const formData = new FormData();
formData.append('image', newFileInput.files[0]); // New image file
formData.append('title', 'Updated Summer Sale 2025');
formData.append('status', 'false'); // Deactivate component

const componentId = '67e8f9a1b2c3d4e5f6789012';
const response = await axios.patch(`/v1/ui-components/${componentId}`, formData, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'multipart/form-data',
  },
});
```

**Sample Request (JavaScript/Axios) - Without Image Update:**

```javascript
const formData = new FormData();
formData.append('title', 'Updated Title');
formData.append('sortOrder', '5');

const componentId = '67e8f9a1b2c3d4e5f6789012';
const response = await axios.patch(`/v1/ui-components/${componentId}`, formData, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'multipart/form-data',
  },
});
```

**Sample Request (cURL):**

```bash
curl -X PATCH "https://api.3dos.io/v1/ui-components/67e8f9a1b2c3d4e5f6789012" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "title=Updated Summer Sale 2025" \
  -F "status=false"
```

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "UI Component updated successfully",
  "data": {
    "image": {
      "url": "https://daebtr9zzzhgu.cloudfront.net/ui-components/c3d4e5f6-updated-summer-sale.jpg",
      "key": "ui-components/c3d4e5f6-updated-summer-sale.jpg"
    },
    "title": "Updated Summer Sale 2025",
    "subtitle": "Up to 50% off on all 3D models",
    "actionUrl": "https://3dos.io/promotions/summer-sale",
    "status": false,
    "sortOrder": 1,
    "componentType": "slider",
    "id": "67e8f9a1b2c3d4e5f6789012",
    "createdAt": "2025-10-19T10:30:00.000Z",
    "updatedAt": "2025-10-19T12:45:00.000Z"
  }
}
```

---

### 5. Delete UI Component

Delete a UI component by ID.

**Endpoint:** `DELETE /v1/ui-components/:componentId`

**Authentication:** Required (Admin with `manageUsers` permission)

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| componentId | String | Yes | MongoDB ObjectId of the component |

**Sample Request (JavaScript/Axios):**

```javascript
const componentId = '67e8f9a1b2c3d4e5f6789012';
const response = await axios.delete(`/v1/ui-components/${componentId}`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

**Sample Request (cURL):**

```bash
curl -X DELETE "https://api.3dos.io/v1/ui-components/67e8f9a1b2c3d4e5f6789012" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "UI Component deleted successfully",
  "data": null
}
```

---

### 6. Get Active Components by Type (Public)

Retrieve active UI components by type for frontend display. This endpoint is public and cached.

**Endpoint:** `GET /v1/ui-components/active/:type`

**Authentication:** Not required (Public endpoint)

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| type | String | Yes | Component type: 'slider', 'banner', or 'card' |

**Sample Request (JavaScript/Axios):**

```javascript
// Get active sliders
const response = await axios.get('/v1/ui-components/active/slider');
```

**Sample Request (cURL):**

```bash
curl -X GET "https://api.3dos.io/v1/ui-components/active/slider"
```

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "Active UI Components fetched successfully",
  "data": [
    {
      "image": {
        "url": "https://daebtr9zzzhgu.cloudfront.net/ui-components/a1b2c3d4-summer-sale.jpg",
        "key": "ui-components/a1b2c3d4-summer-sale.jpg"
      },
      "title": "Summer Sale 2025",
      "subtitle": "Up to 50% off on all 3D models",
      "actionUrl": "https://3dos.io/promotions/summer-sale",
      "status": true,
      "sortOrder": 1,
      "componentType": "slider",
      "id": "67e8f9a1b2c3d4e5f6789012",
      "createdAt": "2025-10-19T10:30:00.000Z",
      "updatedAt": "2025-10-19T10:30:00.000Z"
    },
    {
      "image": {
        "url": "https://daebtr9zzzhgu.cloudfront.net/ui-components/b2c3d4e5-new-arrivals.jpg",
        "key": "ui-components/b2c3d4e5-new-arrivals.jpg"
      },
      "title": "New Arrivals",
      "subtitle": "Discover the latest 3D printable models",
      "actionUrl": "https://3dos.io/new-arrivals",
      "status": true,
      "sortOrder": 2,
      "componentType": "slider",
      "id": "67e8f9a1b2c3d4e5f6789013",
      "createdAt": "2025-10-19T11:00:00.000Z",
      "updatedAt": "2025-10-19T11:00:00.000Z"
    }
  ]
}
```

**Note:** This endpoint is cached for 10 minutes (600 seconds) for better performance.

---

## Frontend Implementation Examples

### React Admin Dashboard Example

```javascript
import React, { useState } from 'react';
import axios from 'axios';

const UIComponentManager = () => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    actionUrl: '',
    componentType: 'slider',
    status: true,
    sortOrder: 0
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('image', file);
    data.append('title', formData.title);
    data.append('subtitle', formData.subtitle);
    data.append('actionUrl', formData.actionUrl);
    data.append('componentType', formData.componentType);
    data.append('status', formData.status);
    data.append('sortOrder', formData.sortOrder);

    try {
      const response = await axios.post('/v1/ui-components', data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      alert('Component created successfully!');
      console.log(response.data);
    } catch (error) {
      alert('Error creating component: ' + error.response?.data?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        required
      />
      
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleInputChange}
        required
      />
      
      <input
        type="text"
        name="subtitle"
        placeholder="Subtitle"
        value={formData.subtitle}
        onChange={handleInputChange}
      />
      
      <input
        type="url"
        name="actionUrl"
        placeholder="Action URL"
        value={formData.actionUrl}
        onChange={handleInputChange}
      />
      
      <select
        name="componentType"
        value={formData.componentType}
        onChange={handleInputChange}
      >
        <option value="slider">Slider</option>
        <option value="banner">Banner</option>
        <option value="card">Card</option>
      </select>
      
      <input
        type="number"
        name="sortOrder"
        placeholder="Sort Order"
        value={formData.sortOrder}
        onChange={handleInputChange}
      />
      
      <label>
        <input
          type="checkbox"
          name="status"
          checked={formData.status}
          onChange={handleInputChange}
        />
        Active
      </label>
      
      <button type="submit">Create Component</button>
    </form>
  );
};

export default UIComponentManager;
```

### React Public Slider Example

```javascript
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HeroSlider = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await axios.get('/v1/ui-components/active/slider');
        setSliders(response.data.data);
      } catch (error) {
        console.error('Error fetching sliders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSliders();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="slider-container">
      {sliders.map((slider) => (
        <div key={slider.id} className="slider-item">
          <a href={slider.actionUrl} target="_blank" rel="noopener noreferrer">
            <img src={slider.image.url} alt={slider.title} />
            <div className="slider-content">
              <h2>{slider.title}</h2>
              {slider.subtitle && <p>{slider.subtitle}</p>}
            </div>
          </a>
        </div>
      ))}
    </div>
  );
};

export default HeroSlider;
```

---

## Common Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created successfully |
| 400 | Bad request (validation error, invalid file type, etc.) |
| 401 | Unauthorized (missing or invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Resource not found |
| 413 | Payload too large (file size exceeds 5MB) |
| 500 | Internal server error |

---

## Best Practices

1. **Image Optimization**: Compress images before upload to reduce file size and improve load times
2. **Sort Order**: Use incremental values (10, 20, 30) to allow easy reordering
3. **Action URLs**: Always validate URLs on the frontend before submission
4. **Cache Invalidation**: Active components are cached for 10 minutes. Plan updates accordingly
5. **Status Management**: Set `status: false` to hide components without deleting them
6. **Component Types**: Choose appropriate types:
   - Use `slider` for hero/homepage carousels
   - Use `banner` for promotional content
   - Use `card` for featured items or call-to-actions

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Image URLs are served via CloudFront CDN for optimal performance
- Maximum file size for images is 5MB
- Supported image formats: JPEG, PNG, GIF, WebP
- The API uses pagination with a default limit of 10 items per page
- Public endpoint (`/active/:type`) is cached for 600 seconds (10 minutes)

