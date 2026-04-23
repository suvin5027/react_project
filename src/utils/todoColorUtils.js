import { TODO_COLORS } from '../constants/todoColors';

export const getColorObj = (username, colorId) => {
	const preset = TODO_COLORS.find(c => c.id === colorId);
	if (preset) return preset;
	const custom = JSON.parse(localStorage.getItem(`myTodoColors_${username}`) || '[]');
	return custom.find(c => c.id === colorId) ?? null;
};
