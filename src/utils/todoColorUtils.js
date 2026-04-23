import { TODO_COLORS } from '../constants/todoColors';

// colorId로 프리셋 또는 커스텀 컬러 객체를 반환 — 없으면 null
export const getColorObj = (username, colorId) => {
	const preset = TODO_COLORS.find(c => c.id === colorId);
	if (preset) return preset;
	const custom = JSON.parse(localStorage.getItem(`myTodoColors_${username}`) || '[]');
	return custom.find(c => c.id === colorId) ?? null;
};
