# Vue Component Diagram

```mermaid
graph TD;
  %% Configure graph layout for better flow
  direction TB
  %% Root components at the top
  App["App"]:::rootComponent
  MainContent["MainContent"]
  Header["Header"]
  Footer["Footer"]
  Sidebar["Sidebar"]
  ContentArea["ContentArea"]
  App --> Header
  linkStyle 0 stroke:#2196F3,stroke-width:2px;
  App --> MainContent
  linkStyle 1 stroke:#2196F3,stroke-width:2px;
  App --> Footer
  linkStyle 2 stroke:#2196F3,stroke-width:2px;
  MainContent -. "v-if: showSidebar" .-> Sidebar
  linkStyle 3 stroke:#FF5722,stroke-width:2px,stroke-dasharray:3;
  class Sidebar condition;
  MainContent --> ContentArea
  linkStyle 4 stroke:#2196F3,stroke-width:2px;
  %% Style definitions
  classDef composable fill:#f9f,stroke:#333,stroke-width:1px;
  classDef component fill:#e6f7ff,stroke:#1890ff,stroke-width:1px;
  classDef rootComponent fill:#d4ffea,stroke:#389e0d,stroke-width:2px;
  classDef condition fill:#fff0e6,stroke:#FF5722,stroke-width:1px,stroke-dasharray:3;
  class App,MainContent,Header,Footer,Sidebar,ContentArea component;
  %% Legend
  subgraph Legend
    Parent["Parent Component"]:::component
    Child["Child Component"]:::component
    Parent --> Child
    legendNote["Note: Arrows point from parent to child components"]
  end
```

## Component Details

### App

- **File Path:** `example/App.vue`
- **Used in Components:** None (Root Component)
- **Child Components:**
  - Header
  - MainContent
  - Footer

### MainContent

- **File Path:** `example/components/MainContent.vue`
- **Used in Components:**
  - App
- **Child Components:**
  - Sidebar *(conditional: v-if="showSidebar")* 
  - ContentArea

### Header

- **File Path:** `example/components/Header.vue`
- **Used in Components:**
  - App
- **Child Components:**
  - None

### Footer

- **File Path:** `example/components/Footer.vue`
- **Used in Components:**
  - App
- **Child Components:**
  - None

### Sidebar

- **File Path:** `example/components/Sidebar.vue`
- **Used in Components:**
  - MainContent
- **Child Components:**
  - None

### ContentArea

- **File Path:** `example/components/ContentArea.vue`
- **Used in Components:**
  - MainContent
- **Child Components:**
  - None

