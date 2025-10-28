export default function VideoTile({ user}) {
  return (
    <div className="card bg-base-200 shadow rounded-lg overflow-hidden">
      <div className="absolute top-2 left-2 badge badge-secondary">{user.name}</div>
      <img
        src={user.avatar || `https://flowbite.com/docs/images/people/profile-picture-${(idx % 5) + 1}.jpg`}
        className="w-full h-48 object-cover"
      />
    </div>
  )
}
