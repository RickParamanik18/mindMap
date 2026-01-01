import "./NodeDetail.css";

const NodeDetail = ({ formData, formChangeHandler, submitHandler }) => {
    return (
        <div className="node-detail">
            <h1 className="node-detail__title">Node Detail</h1>

            <form className="node-detail__form" onSubmit={submitHandler}>
                <input
                    type="text"
                    name="name"
                    placeholder="Node name"
                    onChange={formChangeHandler}
                    value={formData.name || ""}
                    className="node-detail__input"
                    required
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    onChange={formChangeHandler}
                    value={formData.description || ""}
                    rows={4}
                    className="node-detail__textarea"
                />

                <input
                    type="submit"
                    value="Save"
                    className="node-detail__button"
                />
            </form>
        </div>
    );
};

export default NodeDetail;
