import { ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { v4 as uuidv4 } from "uuid";
import data from "./data/data1.json";
import { useEffect, useState } from "react";
import CustomNode from "./components/CustomNode";
import { transformMindmapData } from "./util/helper";

const nodeTypes = {
    selectorNode: CustomNode,
};

function App() {
    const [treeData, setTreeData] = useState(data);
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [collapsedNode, setCollapsedNode] = useState(new Set());
    const [activeNode, setActiveNode] = useState(null);

    const nodeClickHandler = (e, node) => {
        console.log("Clicked - " + node.id);
        setActiveNode(node.id);
        setCollapsedNode((prev) => {
            const next = new Set(prev);

            if (next.has(node.id)) {
                next.delete(node.id);
            } else {
                next.add(node.id);
            }

            return next;
        });
    };

    const addNode = (id) => {
        const newNode = {
            id: uuidv4(),
            name: "Untitled Node",
            description: "",
            children: [],
        };

        function addNodeRecursive(node) {
            if (node.id === id) {
                node.children.push(newNode);
                return true;
            }

            for (let child of node.children) {
                const added = addNodeRecursive(child);
                if (added) return true;
            }

            return false;
        }

        setTreeData((prev) => {
            addNodeRecursive(prev);
            // console.log("hello", prev);
            return { ...prev };
        });
    };

    const deleteNode = (id) => {
        const deleteRecursive = (node) => {
            return {
                ...node,
                children: node.children
                    .filter((child) => child.id !== id)
                    .map(deleteRecursive),
            };
        };

        setTreeData((prev) => deleteRecursive(prev));
    };

    useEffect(() => {
        const result = transformMindmapData(
            treeData,
            addNode,
            deleteNode,
            collapsedNode,
            activeNode
        );
        setNodes(result.nodes);
        setEdges(result.edges);
        console.log(result);
    }, [treeData, collapsedNode, activeNode]);

    return (
        <div className="container">
            <div style={{ height: "100vh", width: "100vw" }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    onNodeClick={nodeClickHandler}
                    fitView
                >
                    <Background />
                    <Controls />
                </ReactFlow>
            </div>
        </div>
    );
}

export default App;
