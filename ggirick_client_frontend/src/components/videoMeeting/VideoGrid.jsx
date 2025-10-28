import VideoTile from "./VideoTile";

export default function VideoGrid({ users }) {
    return (
        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 overflow-y-auto">
            {users.map((user, idx) => (
                <VideoTile key={idx} user={user} />
            ))}
        </div>
    );
}
