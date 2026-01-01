import { ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { v4 as uuidv4 } from "uuid";
import data from "./data/data1.json";
import { useEffect, useState } from "react";
import CustomNode from "./components/CustomNode";
import { transformMindmapData } from "./util/helper";
import NodeDetail from "./components/NodeDetail";
import "./app.css";
import Controllers from "./components/Controllers";

const nodeTypes = {
    selectorNode: CustomNode,
};

function App() {
    const [treeData, setTreeData] = useState(data);
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [collapsedNode, setCollapsedNode] = useState(new Set());
    const [activeNode, setActiveNode] = useState(null);
    const [formData, setFormData] = useState({});

    const formChangeHandler = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const submitHandler = (e) => {
        e.preventDefault();
        if (!activeNode) {
            alert("Select a Node to Edit");
            return;
        }

        function updateNodeById(node, targetId, updates) {
            if (node.id === targetId) {
                return {
                    ...node,
                    ...updates,
                };
            }

            return {
                ...node,
                children: node.children.map((child) =>
                    updateNodeById(child, targetId, updates)
                ),
            };
        }

        setTreeData((prev) =>
            updateNodeById(prev, activeNode.id, {
                name: formData.name,
                description: formData.description,
            })
        );
        alert("Node Edited");
    };

    const nodeClickHandler = (e, node) => {
        setActiveNode(node);
        setFormData({
            name: node.data.label,
            description: node.data.description,
        });

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
            description: "Empty Desctiption",
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
            activeNode?.id
        );
        setNodes(result.nodes);
        setEdges(result.edges);
        console.log(result);
    }, [treeData, collapsedNode, activeNode]);

    return (
        <>
            <div
                className="container"
                style={{ display: "grid", gridTemplateColumns: "70% 30%" }}
            >
                <div style={{ height: "100vh", width: "100%" }}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        nodeTypes={nodeTypes}
                        onNodeClick={nodeClickHandler}
                        fitView
                    >
                        <Controllers
                            treeData={treeData}
                            setCollapsedNode={setCollapsedNode}
                        />
                        <Background />
                        <Controls />
                    </ReactFlow>
                </div>
                <NodeDetail
                    formData={formData}
                    formChangeHandler={formChangeHandler}
                    submitHandler={submitHandler}
                />
            </div>
        </>
    );
}

export default App;
