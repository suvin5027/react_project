import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function TodoAddPage() {
	const { currentUser } = useAuth();
	const navigate = useNavigate();
	const [inputValue, setInputValue] = useState('');

	useEffect(() => {
		if (!currentUser) navigate('/login');
	}, [currentUser]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (inputValue.trim() === '') return;

		const storageKey = `myTodoList_${currentUser.username}`;
		const savedList = JSON.parse(localStorage.getItem(storageKey) || '[]');
		const nextId = savedList.reduce((max, item) => Math.max(max, item.id), 0) + 1;

		const now = new Date();
		const createdAt = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

		const newTodo = { id: nextId, text: inputValue.trim(), done: false, createdAt };
		localStorage.setItem(storageKey, JSON.stringify([...savedList, newTodo]));
		navigate('/todo');
	};

	if (!currentUser) return null;

	return (
		<div className="todo_form_page">
			<h2 className="todo_form_title">할 일 추가</h2>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					className="todo_input"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					placeholder="새로운 할 일을 입력하세요."
					autoFocus
				/>
				<div className="todo_form_btn_wrap">
					<button type="button" className="btn_cancel" onClick={() => navigate('/todo')}>취소</button>
					<button type="submit" className="btn_submit">추가</button>
				</div>
			</form>
		</div>
	);
}

export default TodoAddPage;
