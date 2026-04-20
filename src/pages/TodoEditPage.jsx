import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function TodoEditPage() {
	const { currentUser } = useAuth();
	const navigate = useNavigate();
	const { id } = useParams();

	const storageKey = `myTodoList_${currentUser?.username}`;
	const savedList = JSON.parse(localStorage.getItem(storageKey) || '[]');
	const todo = savedList.find(item => item.id === Number(id));

	const [text, setText] = useState(todo?.text ?? '');
	const [done, setDone] = useState(todo?.done ?? false);

	useEffect(() => {
		if (!currentUser) navigate('/login');
	}, [currentUser]);

	if (!todo) {
		return (
			<div className="todo_form_page">
				<p>존재하지 않는 항목입니다.</p>
				<button type="button" className="btn_cancel" onClick={() => navigate('/todo')}>목록으로</button>
			</div>
		);
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		if (text.trim() === '') return;

		const updated = savedList.map(item =>
			item.id === Number(id) ? { ...item, text: text.trim(), done } : item
		);
		localStorage.setItem(storageKey, JSON.stringify(updated));
		navigate('/todo');
	};

	return (
		<div className="todo_form_page">
			<h2 className="todo_form_title">할 일 수정</h2>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					className="todo_input"
					value={text}
					onChange={(e) => setText(e.target.value)}
					autoFocus
				/>
				<label className="todo_done_label">
					<input type="checkbox" checked={done} onChange={(e) => setDone(e.target.checked)} />
					완료 표시
				</label>
				<div className="todo_form_btn_wrap">
					<button type="button" className="btn_cancel" onClick={() => navigate('/todo')}>취소</button>
					<button type="submit" className="btn_submit">수정</button>
				</div>
			</form>
		</div>
	);
}

export default TodoEditPage;
