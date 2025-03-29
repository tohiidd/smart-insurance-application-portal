# Smart Insurance Application Portal

## Features

- Dynamic form generation based on API configuration
- Dark/Light mode support
- Responsive design
- Form submission tracking
- Searchable and filterable submissions table
- Column visibility controls
- Pagination support
- Toast notifications

## Prerequisites

- Node.js (v14 or higher)
- pnpm (v7 or higher)

## Setup Instructions

1. Clone the repository:

```bash
git clone <repository-url>
cd smart-insurance-application-portal
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm run dev
```

4. Build for production:

```bash
pnpm run build
```

## API Usage

### Form Configuration API

#### Get Form Configuration

```typescript
GET /api/form
Response: FormData[]
```

Example response:

```json
[
  {
    "formId": "string",
    "title": "string",
    "fields": [
      {
        "id": "string",
        "type": "text|select|date|number|checkbox",
        "label": "string",
        "required": boolean,
        "options": string[],
        "validation": {
          "pattern": "string",
          "message": "string",
          "max": number,
          "min": number
        },
        "dynamicOptions": {
          "dependsOn": "string",
          "endpoint": "string",
          "method": "GET|POST"
        },
        "visibility": {
          "condition": "string",
          "dependsOn": "string",
          "value": "string"
        }
      }
    ]
  }
]
```

#### Submit Form

```typescript
POST /api/submit
Request Body: Record<string, unknown>
```

#### Get Submissions

```typescript
GET /api/submissions
Response: {
  columns: string[],
  data: Record<string, string | number>[]
}
```

## Assumptions

1. API Endpoints:

   - The application includes the existence of three main API endpoints:
     - `/api/form` for form configuration
     - `/api/submit` for form submissions
     - `/api/submissions` for retrieving submissions

2. Form Configuration:

   - Form fields support the following types:
     - text
     - select
     - date
     - number
     - checkbox
   - Dynamic options are supported for select fields
   - Field visibility can be controlled based on other field values
   - Validation rules are supported for all field types

3. State Management:
   - Theme preferences are persisted in localStorage
   - Form state is managed locally within components
   - API responses are cached appropriately

## Project Structure

```
src/
├── components/
│   ├── Form/
│   │   ├── DynamicForm.tsx
│   │   └── FormTabPanel.tsx
│   ├── Layout/
│   │   └── Navigation.tsx
│   ├── Submissions/
│   │   └── SubmissionsTable.tsx
│   └── Ui/
│       └── LoadingPlaceholder.tsx
├── context/
│   ├── ThemeContext.tsx
│   └── ToastContext.tsx
├── pages/
│   ├── FormPage.tsx
│   └── SubmissionsPage.tsx
├── services/
│   └── formService.ts
├── theme/
│   └── theme.ts
├── utils/
│   └── api.ts
└── App.tsx
```
