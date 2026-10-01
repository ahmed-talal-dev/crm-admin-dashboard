# Admin Dashboard CRM

A modern CRM-style admin dashboard built with **React**, **Refine**, **Ant Design**, **GraphQL**, and **TypeScript**.

The project focuses on reusable UI components, resource-based routing, GraphQL data management, authentication, responsive layouts, and a Kanban-style task workflow with drag-and-drop support.

---

## Features

- Dashboard overview with companies, contacts, and deals statistics
- Upcoming events section
- Deals performance chart
- Latest activity feed
- Companies management
  - List companies
  - Search and filter
  - Create companies
  - Edit company details
  - View company contacts
- Task management with a Kanban board
  - Drag and drop tasks between stages
  - Create tasks inside a specific stage
  - Edit task title, stage, description, due date, and assigned users
  - Delete tasks
  - Optimistic task stage updates
- Authentication and protected routes
- GraphQL queries and mutations
- GraphQL subscriptions for live updates
- Reusable loading skeletons
- Responsive layouts for desktop, tablet, and mobile

---

## Tech Stack

| Technology | Usage |
| --- | --- |
| React | UI development |
| TypeScript | Type safety |
| Refine | Admin application framework |
| Ant Design | UI components and design system |
| GraphQL | API communication |
| `@refinedev/nestjs-query` | GraphQL data provider |
| React Router | Application routing |
| dnd-kit | Kanban drag and drop |
| Day.js | Date formatting and manipulation |
| `@uiw/react-md-editor` | Task description editor |
| GraphQL Code Generator | Generated schema and operation types |
| Vite | Development and build tooling |

---

## Application Structure

```text
src/
├── components/
│   ├── home/
│   ├── tasks/
│   │   ├── form/
│   │   └── kanban/
│   ├── skeleton/
│   └── tags/
│
├── config/
│   └── resources.tsx
│
├── constants/
│
├── graphql/
│   ├── mutations.ts
│   ├── queries.ts
│   ├── schema.types.ts
│   └── types.ts
│
├── pages/
│   ├── company/
│   └── tasks/
│
├── providers/
│   ├── auth.ts
│   └── data/
│
├── utilities/
│
└── App.tsx
```

---

## Main Application Flow

### Dashboard

The dashboard combines multiple GraphQL queries to display:

- Total companies
- Total contacts
- Total deals
- Upcoming calendar events
- Deals chart data
- Latest activities

### Companies

Companies are managed through Refine resources and GraphQL operations.

```text
Company List
    ↓
Create Company
    ↓
Edit Company
    ↓
Company Contacts
```

The company list supports filtering, sorting, pagination, and resource-aware navigation.

### Tasks / Kanban

Tasks are displayed in a Kanban board grouped by their current stage.

```text
Unassigned
TODO
IN PROGRESS
IN REVIEW
DONE
```

Tasks can be dragged between columns. When a task is dropped into a new stage, the application performs an optimistic GraphQL update for a faster user experience.

---

## GraphQL Architecture

The GraphQL layer is split into dedicated files:

```text
graphql/
├── queries.ts        # Read operations
├── mutations.ts      # Create and update operations
├── schema.types.ts   # Generated GraphQL schema types
└── types.ts          # Generated operation types
```

Refine hooks such as `useList`, `useTable`, `useForm`, `useSelect`, and `useUpdate` communicate with the API through the GraphQL data provider.

```text
Refine Hook
    ↓
Data Provider
    ↓
GraphQL Client
    ↓
Fetch Wrapper
    ↓
GraphQL API
```

---

## Authentication

Authentication is handled through a custom Refine `authProvider`.

The provider is responsible for:

- Login
- Logout
- Session validation
- Authentication error handling
- Loading the current user identity

Protected application routes are wrapped with Refine's `Authenticated` component.

---

## Responsive Design

The project includes responsive behavior across the main UI sections.

Examples include:

- Responsive dashboard cards
- Flexible forms and modals
- Horizontal scrolling for the Kanban board on smaller screens
- Fixed readable Kanban column widths
- Responsive tags and user selectors
- Flexible loading skeletons

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd admin-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

---

## Available Scripts

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

### Generate GraphQL Types

```bash
npm run codegen
```

---

## Key Concepts Used

- Resource-based routing with Refine
- Protected routes
- GraphQL data fetching
- GraphQL mutations
- GraphQL subscriptions
- Generated TypeScript GraphQL types
- Optimistic updates
- Drag and drop
- Reusable UI components
- Reusable loading skeletons
- Responsive UI design
- Component composition

---

## Project Goals

This project was built to practice and demonstrate:

- Building a real-world admin dashboard
- Structuring a scalable React application
- Integrating Refine with a GraphQL backend
- Managing complex forms and resource-based CRUD operations
- Building reusable UI components
- Creating responsive interfaces
- Implementing a Kanban workflow with drag and drop
- Working with generated GraphQL and TypeScript types

---

## Built With Refine

This project uses [Refine](https://refine.dev/) to simplify common admin application concerns such as routing, authentication, data fetching, mutations, notifications, and resource management.

Useful documentation:

- [Refine Documentation](https://refine.dev/docs/)
- [Refine Ant Design Integration](https://refine.dev/docs/ui-integrations/ant-design/introduction/)
- [NestJS Query Data Provider](https://refine.dev/docs/data/packages/nestjs-query/)
- [Ant Design](https://ant.design/)

---

## License

This project is available under the MIT License.
