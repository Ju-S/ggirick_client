export default function normalizeMessage(m) {
    return {
        id: m.id,
        senderId: m.senderId,
        senderName: m.senderName || "Unknown",
        type: m.type,
        content: JSON.parse(m.content || []),
        like: m.like_count || 0,
        likeUsers:m.likeUsers || [],
        viewer:m.viewer || [],
        files: m.files,
        reactions: m.reactions || [],
        time: new Date(m.createdAt).toLocaleTimeString([], {  year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit" }),
    };
}