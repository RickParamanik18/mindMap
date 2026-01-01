export function transformMindmapData(
    root,
    addNode,
    deleteNode,
    collapsedNode,
    activeNode
) {
    const nodes = [];
    const edges = [];

    const LEVEL_GAP = 300;
    const NODE_GAP = 120;

    // Compute subtree width
    function computeSubtreeWidth(node) {
        if (!node.children || node.children.length === 0) {
            node.subtreeWidth = 1;
            return 1;
        }

        let width = 0;
        for (const child of node.children) {
            width += computeSubtreeWidth(child);
        }

        node.subtreeWidth = width;
        return width;
    }

    let highlightedNodes = new Set();
    // Assign positions using subtree width
    function layout(node, x, y, parentId = null) {
        if (node.id === activeNode) {
            const ids = node.children.map((child) => child.id);
            highlightedNodes = new Set(ids);
        }

        nodes.push({
            id: node.id.toString(),
            position: { x, y },
            data: {
                id: node.id,
                label: node.name,
                description: node.description,
                addNode: addNode,
                deleteNode: deleteNode,
                bgColor: highlightedNodes.has(node.id) ? "#00ff0055" : "white",
            },
            type: "selectorNode",
        });

        if (parentId !== null) {
            edges.push({
                id: `${parentId}-${node.id}`,
                source: parentId.toString(),
                target: node.id.toString(),
                type: "default",
            });
        }

        let currentY = y - ((node.subtreeWidth - 1) * NODE_GAP) / 2;

        if (!collapsedNode.has(node.id)) {
            for (const child of node.children) {
                const childCenterY =
                    currentY + (child.subtreeWidth * NODE_GAP) / 2;

                layout(child, x + LEVEL_GAP, childCenterY, node.id);

                currentY += child.subtreeWidth * NODE_GAP;
            }
        }
    }

    computeSubtreeWidth(root);
    layout(root, 0, 0);

    return { nodes, edges };
}
