export const getTagsFromTask = (task) => {
    try {
        const data = JSON.parse(task.taskData);
        return data?.tags || [];
    } catch (e) {
        return [];
    }
};