import React, { memo, useEffect, useRef } from "react";
import { Handle, Position, useUpdateNodeInternals } from "@xyflow/react";

export default memo(({ data, isConnectable }) => {
    const controllersRef = useRef(null);
    // const updateNodeInternals = useUpdateNodeInternals();

    const toggleControllers = (val) => {
        if (controllersRef.current) {
            controllersRef.current.style.display = val;
            // updateNodeInternals(data.id);
        }
    };

    const addNode = (e) => {
        e.stopPropagation();
        console.log("adding node");
        data.addNode(data.id);
        // updateNodeInternals(data.id);
    };

    const deleteNode = (e) => {
        e.stopPropagation();
        console.log("deleting node");
        data.deleteNode(data.id);
        // updateNodeInternals(data.id);
    };

    const btnStyle = {
        margin: "2px",
        padding: "5px 10px",
        borderRadius: "3px",
        border: "1px solid gray",
        backgroundColor: "#00000055",
        cursor: "pointer",
    };

    useEffect(() => {
        // updateNodeInternals(data.id);
        // console.log(data);
    }, []);

    return (
        <div
            onMouseEnter={() => toggleControllers("block")}
            onMouseLeave={() => toggleControllers("none")}
        >
            <div
                className="controllers"
                style={{
                    display: "none",
                    position: "absolute",
                    top: "-30px",
                    right: 0,
                }}
                ref={controllersRef}
            >
                <button style={btnStyle} onClick={addNode}>
                    {" "}
                    +{" "}
                </button>
                <button style={btnStyle} onClick={deleteNode}>
                    {" "}
                    -{" "}
                </button>
            </div>
            <div
                style={{
                    border: "1.5px solid black",
                    minWidth: "200px",
                    textAlign: "center",
                    padding: 10,
                    borderRadius: 5,
                    cursor: "pointer",
                    background: data.bgColor,
                }}
            >
                <Handle
                    type="target"
                    position={Position.Left}
                    isConnectable={isConnectable}
                />
                <div
                    title={
                        data.description.length > 30
                            ? data.description.slice(0, 30) + "..."
                            : data.description
                    }
                >
                    {data.label}
                </div>
                <Handle
                    type="source"
                    position={Position.Right}
                    isConnectable={isConnectable}
                />
            </div>
        </div>
    );
});
