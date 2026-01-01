import { ReactFlow, Background, Controls, useReactFlow } from "@xyflow/react";
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
    const [formData, setFormData] = useState({});

    // const { fitView } = useReactFlow();

    const formChangeHandler = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const submitHandler = (e) => {
        e.preventDefault();
        console.log(formData);
        //update json
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

        // if (!activeNode) return;

        setTreeData((prev) =>
            updateNodeById(prev, activeNode.id, {
                name: formData.name,
                description: formData.description,
            })
        );
        alert("Node Edited");
    };

    const nodeClickHandler = (e, node) => {
        console.log("Clicked - " + node.id);
        setActiveNode(node);
        setFormData({
            name: node.data.label,
            description: node.data.description,
        });
        console.log(formData);
        setCollapsedNode((prev) => {
            const next = new Set(prev);

            if (next.has(node.id)) {
                next.delete(node.id);
            } else {
                next.add(node.id);
            }

            return next;
        });
        // console.log(formData);
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
            activeNode?.id
        );
        setNodes(result.nodes);
        setEdges(result.edges);
        console.log(result);
    }, [treeData, collapsedNode, activeNode]);

    return (
        <>
            <div
                className="controllers"
                style={{
                    padding: "5px",
                    position: "absolute",
                    top: "0px",
                    zIndex: 999,
                }}
            >
                <span
                    style={{
                        borderRadius: "5px",
                        padding: "5px",
                        margin: "5px",
                        background: "#00ff0055",
                        cursor: "pointer",
                    }}
                    onClick={() => setCollapsedNode(new Set(treeData.id))}
                >
                    Collapse All
                </span>
                <span
                    style={{
                        borderRadius: "5px",
                        padding: "5px",
                        margin: "5px",
                        background: "#00ff0055",
                        cursor: "pointer",
                    }}
                    onClick={() => setCollapsedNode(new Set())}
                >
                    Expand All
                </span>
                <span
                    style={{
                        borderRadius: "5px",
                        padding: "5px",
                        margin: "5px",
                        background: "#00ff0055",
                        cursor: "pointer",
                    }}
                    // onClick={() => fitView({ padding: 0.2 })}
                >
                    Fit View
                </span>
            </div>
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
                        <Background />
                        <Controls />
                    </ReactFlow>
                </div>
                <div
                    style={{
                        background: "#1f7a4d",
                        padding: "20px",
                        borderRadius: "10px",
                        color: "#fff",
                        fontFamily: "Arial, sans-serif",
                    }}
                >
                    <h1
                        style={{
                            marginBottom: "15px",
                            fontSize: "20px",
                            textAlign: "center",
                        }}
                    >
                        Node Detail
                    </h1>

                    <form
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                        }}
                    >
                        <input
                            type="text"
                            name="name"
                            placeholder="Node name"
                            onChange={formChangeHandler}
                            value={formData.name}
                            style={{
                                padding: "8px",
                                borderRadius: "5px",
                                border: "none",
                                outline: "none",
                                fontSize: "14px",
                            }}
                        />

                        <textarea
                            name="description"
                            placeholder="Description"
                            onChange={formChangeHandler}
                            value={formData.description}
                            rows={4}
                            style={{
                                padding: "8px",
                                borderRadius: "5px",
                                border: "none",
                                outline: "none",
                                fontSize: "14px",
                                resize: "none",
                            }}
                        />

                        <input
                            type="submit"
                            value="Save"
                            onClick={submitHandler}
                            style={{
                                padding: "10px",
                                borderRadius: "5px",
                                border: "none",
                                cursor: "pointer",
                                background: "#ffffff",
                                color: "#1f7a4d",
                                fontWeight: "bold",
                            }}
                        />
                    </form>
                </div>
            </div>
        </>
    );
}

export default App;
