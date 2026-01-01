# Mind Map Editor – React Flow

## 1. Technologies Used

-   **React (JavaScript)**

    -   Used for building the UI using a component-based approach.
    -   Helps manage state and re-render the UI efficiently when data changes.

-   **React Flow (@xyflow/react)**

    -   Used to visualize the tree structure as an interactive graph.
    -   Handles nodes, edges, zooming, panning, and canvas interactions.

-   **UUID**

    -   Used to generate unique IDs when adding new nodes dynamically.
    -   Ensures each node can be uniquely identified and updated.

-   **CSS**

    -   Keeps the project simple and easy to understand.

---

## 2. Libraries Used (and Why)

### @xyflow/react (React Flow)

-   Converts structured data into a visual node-edge graph.
-   Provides built-in features like:

    -   Fit view
    -   Zoom and pan
    -   Custom nodes

-   Ideal for mind maps, flowcharts, and tree visualizations.

### uuid

-   Generates unique IDs for new nodes.
-   Prevents ID conflicts when dynamically adding or deleting nodes.

---

## 3. Overall Architecture / Approach

The project follows a **data-driven architecture**.

### Core Idea:

> **The JSON tree is the single source of truth**

-   All node data (name, description, children) lives in a tree-structured JSON object.
-   The UI is **derived from this data**, not managed separately.

### Key States:

-   `treeData` → Main tree structure (root JSON)
-   `nodes` → React Flow nodes (derived)
-   `edges` → React Flow edges (derived)
-   `collapsedNode` → Tracks collapsed/expanded nodes
-   `activeNode` → Currently selected node
-   `formData` → Editable node details

### Separation of Concerns:

-   **Data Logic** → Tree manipulation (add, delete, update)
-   **Transformation Logic** → JSON → React Flow nodes & edges
-   **UI Logic** → Rendering graph and forms

---

## 4. Data Flow (JSON → UI)

### Step-by-step Flow:

1. **Initial Load**

    - JSON data is loaded into `treeData` state.
    - This represents the full tree structure.

2. **Transformation**

    - `transformMindmapData()` converts `treeData` into:

        - `nodes` (positions, labels, custom nodes)
        - `edges` (parent-child relationships)

3. **Rendering**

    - React Flow receives `nodes` and `edges`.
    - The graph is rendered on the canvas.

4. **User Interaction**

    - Clicking a node:

        - Sets `activeNode`
        - Loads node details into the form

    - Adding / deleting nodes:

        - Updates `treeData` immutably

    - Editing node details:

        - Updates the matching node in `treeData` by ID

5. **Re-render**

    - Any change to `treeData` triggers:

        - Re-transformation
        - Graph re-render with updated layout
