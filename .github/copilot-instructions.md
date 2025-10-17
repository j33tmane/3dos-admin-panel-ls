# Copilot Instructions for 3DOS Admin Panel

## Architecture Overview

This is a **Next.js 14 admin panel** for the 3DOS marketplace using App Router, shadcn/ui, and TypeScript. Key architectural patterns:

- **App Router Structure**: All pages in `app/` directory with route-based organization (`app/categories/page.tsx`, `app/users/page.tsx`)
- **Component-First Design**: UI built with shadcn/ui components (`components/ui/`) + custom business components
- **Service Layer**: All API calls centralized in `services/` with base `ApiService` class for common functionality
- **Context-Based State**: Auth state managed via React Context (`store/auth.tsx`) instead of external state libraries
- **Type Safety**: Comprehensive TypeScript types organized by domain (`types/auth.ts`, `types/categories.ts`)

## Critical Development Patterns

### 1. API Service Pattern
All services use a base `ApiService` class that provides common HTTP methods and handles:
- **Auto CSRF token extraction**: Reads `X-CSRF-Token` from response headers and stores in localStorage
- **Request timeout**: Default 10s with AbortController
- **Auth header injection**: Automatically includes `Authorization: Bearer ${token}` and `X-CSRF-Token`
- **Environment-aware base URLs**: `NEXT_PUBLIC_API_BASE_URL` (client) vs `API_BASE_URL` (server)

```typescript
// services/categories.ts - Real pattern from codebase
class CategoriesService {
  async getCategories(params: CategoriesParams = {}): Promise<CategoriesResponse> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.name) queryParams.append("name", params.name);
    // ... build query string
    
    const response = await apiService.get<CategoriesResponse>(
      `/categories${queryString ? `?${queryString}` : ""}`
    );
    return response.data;
  }
}
```

### 2. Page Component Structure
Pages follow a consistent pattern with URL-driven filters and state management:

```tsx
// app/categories/page.tsx - Standard page pattern
export default function CategoriesPage() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, ... });
  
  // Read filters from URL params
  const getFiltersFromURL = () => { /* parse searchParams */ };
  
  // Fetch data on mount and filter changes
  useEffect(() => { fetchCategories(); }, [searchParams]);
  
  return (
    <SidebarInset>
      <DashboardHeader title="Categories" />
      <FiltersComponent onFilterChange={...} />
      <DataTable data={data} loading={loading} />
    </SidebarInset>
  );
}
```

### 3. Table Components with Actions
Tables use consistent patterns for row actions, loading states, and hierarchical data:

```tsx
// components/categories-table.tsx - Level-based badge colors
const levelColors: Record<number, string> = {
  0: "bg-blue-100 text-blue-800",
  1: "bg-green-100 text-green-800",
  2: "bg-orange-100 text-orange-800",
};

// Dropdown menus for row actions
<DropdownMenu>
  <DropdownMenuItem onClick={() => router.push(`/categories/${id}/edit`)}>
    <Edit className="mr-2 h-4 w-4" /> Edit
  </DropdownMenuItem>
</DropdownMenu>
```

### 4. Route-Based File Organization
- Pages: `app/{section}/page.tsx` (e.g., `app/categories/page.tsx`)
- Nested routes: `app/categories/[categoryId]/edit/page.tsx`
- Auth routes bypass AppShell wrapper (`pathname === "/login" || pathname === "/register"`)

## Development Workflow

### Build Commands
```bash
pnpm dev              # Development server
pnpm build:prod       # Production build
pnpm start:prod       # Production server
```

### Key Environment Variables
- `NEXT_PUBLIC_API_BASE_URL`: Client-side API endpoint
- `API_BASE_URL`: Server-side API endpoint  
- Configure in `env.example` → `.env.local`

## Project-Specific Conventions

### 1. Import Paths & Module Organization
- **Always use `@/` prefix**: `import { categoriesService } from "@/services"`
- **Central re-exports**: Each directory has `index.ts` for clean imports
  ```typescript
  // types/index.ts
  export * from "./auth";
  export * from "./categories";
  // Allows: import { User, Category } from "@/types"
  ```

### 2. UI Components & Styling
- **shadcn/ui config**: `components.json` specifies New York style with Lucide icons
- **Tailwind class merging**: Use `cn()` from `lib/utils.ts` for conditional styles
  ```tsx
  <Badge className={cn("text-xs", levelColors[category.level])} />
  ```
- **Icon patterns**: Import from `lucide-react`, size classes: `h-4 w-4` (small), `h-5 w-5` (medium)
- **DO NOT modify** `components/ui/*` - these are managed by shadcn CLI

### 3. Navigation & Sidebar
Defined in `constants/navigation.ts` with grouped sections:
```typescript
export const NAVIGATION_ITEMS = [
  {
    title: "Management",
    items: [
      { title: "Users", url: "/users", icon: Users },
      { title: "Categories", url: "/categories", icon: FolderTree }
    ]
  }
];
```
Active route detection via `usePathname()` in `admin-sidebar.tsx`

### 4. Authentication Flow (OTP-Based)
- **No password login**: System uses OTP sent to email
- **Token storage**: `access_token` and `csrf_token` in localStorage
- **Context provider**: `store/auth.tsx` wraps entire app in `layout.tsx`
- **Route protection**: `AppShell` component conditionally renders sidebar
  ```tsx
  const isAuthRoute = pathname === "/login" || pathname === "/register";
  if (isAuthRoute) return <>{children}</>;  // No sidebar
  ```

### 5. Data Formatting Utilities
Use centralized formatters from `utils/format.ts`:
- `formatCurrency(1234.56)` → "$1,234.56"
- `formatDate(date)` → "Oct 17, 2025"
- `formatRelativeTime(date)` → "2h ago" or "Just now"

## Integration Points

### External Dependencies
- **shadcn/ui**: Component library (do not modify `components/ui/` directly)
- **Radix UI**: Headless component primitives
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon system

### API Integration
- RESTful endpoints via base service class
- CSRF token support built-in
- Server/client environment handling
- Standardized error handling

## Common Development Tasks

### Adding New Page/Module
1. **Create page**: `app/{section}/page.tsx` (must be "use client" for state/hooks)
2. **Add navigation**: Update `constants/navigation.ts` with route + icon
3. **Create service**: `services/{section}.ts` with API methods
4. **Define types**: `types/{section}.ts` for request/response shapes
5. **Export**: Add to `services/index.ts` and `types/index.ts`

### Creating Data Tables
Follow the established pattern from `components/categories-table.tsx`:
```tsx
export function MyTable({ data, loading, error, pagination, onPageChange }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  
  if (loading) return <TableSkeleton />;
  if (error) return <ErrorAlert message={error} />;
  
  return (
    <Card>
      <Table>
        <TableHeader>...</TableHeader>
        <TableBody>
          {data.map(item => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuItem onClick={() => router.push(`/path/${item.id}/edit`)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
```

### Adding API Endpoints
Services don't extend ApiService - they import the singleton instance:
```typescript
// services/myservice.ts
import { apiService } from "./api";
import { MyResponse, MyParams } from "@/types";

class MyService {
  async getData(params: MyParams): Promise<MyResponse> {
    const queryParams = new URLSearchParams();
    if (params.filter) queryParams.append("filter", params.filter);
    
    const response = await apiService.get<MyResponse>(
      `/endpoint?${queryParams.toString()}`
    );
    return response.data;
  }
}

export const myService = new MyService();
```

### Handling Errors & Loading States
- **Toast notifications**: Use `toast()` from `sonner` (already imported via `<Toaster />`)
  ```tsx
  try {
    await service.doSomething();
    toast.success("Operation completed");
  } catch (error) {
    toast.error(error.message || "Operation failed");
  }
  ```
- **Loading states**: Always show skeleton/spinner during data fetches
- **Error states**: Display user-friendly error messages with retry options