export default function Dropdown({onClickHandler, selectedItem, title, items}) {
    return (
        <select className="select">
            <option disabled selected>{title}</option>
            {items && items.map(e =>
                <option
                    className={e.value === selectedItem ? "bg-primary text-primary-content" : "bg-base text-base-content"}
                    onClick={() => onClickHandler(e.value)}
                    selected={e.value === selectedItem}
                >
                    {e.name}
                </option>
            )}
        </select>

    );
}