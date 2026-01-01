import { useReactFlow } from "@xyflow/react";

const Controllers = ({ treeData, setCollapsedNode }) => {
    const { fitView } = useReactFlow();

    return (
        <div className="controller_bar">
            <span
                className="controller-btn"
                onClick={() => setCollapsedNode(new Set([treeData.id]))}
            >
                Collapse All
            </span>

            <span
                className="controller-btn"
                onClick={() => setCollapsedNode(new Set())}
            >
                Expand All
            </span>

            <span
                className="controller-btn"
                onClick={() => fitView({ padding: 0.2, duration: 300 })}
            >
                Fit View
            </span>
        </div>
    );
};

export default Controllers;
