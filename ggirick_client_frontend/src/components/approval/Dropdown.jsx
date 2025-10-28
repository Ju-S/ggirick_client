export default function Dropdown({onClickHandler, selectedItem, title, items, disabled}) {
    return (
        <select className="select" required disabled={disabled}>
            <option disabled selected>{title}</option>
            {items && items.map(e =>
                <option
                    className={e.id === selectedItem ? "active:bg-base-300 active:shadow-none bg-primary text-primary-content" : "active:bg-base-300 active:shadow-none bg-base text-base-content"}
                    onClick={() => onClickHandler(e)}
                    selected={e.id === selectedItem}
                >
                    {e.name}
                </option>
            )}
        </select>

    );
}