import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TodoColorSelector from '../components/TodoColorSelector';
import TodoTagSelector from '../components/TodoTagSelector';

function TodoAddPage() {
	const { currentUser } = useAuth();
	const navigate = useNavigate();
	const inputRef = useRef(null);
	const [inputValue, setInputValue] = useState('');
	const [description, setDescription] = useState('');
	const [tags, setTags] = useState([]);
	const [color, setColor] = useState('white');
	const [showDates, setShowDates] = useState(false);
	const [startDate, setStartDate] = useState('');
	const [dueDate, setDueDate] = useState('');

	const handleShowDates = (checked) => {
		setShowDates(checked);
		setStartDate(checked ? new Date().toISOString().slice(0, 10) : '');
		setDueDate('');
	};

	useEffect(() => {
		if (!currentUser) navigate('/login');
	}, [currentUser]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (inputValue.trim() === '') {
			alert('할 일을 입력해주세요.');
			inputRef.current?.focus();
			return;
		}
		if (startDate && dueDate && dueDate < startDate) {
			alert('마감일은 시작일보다 빠를 수 없습니다.');
			return;
		}

		const storageKey = `myTodoList_${currentUser.username}`;
		const savedList = JSON.parse(localStorage.getItem(storageKey) || '[]');
		const nextId = savedList.reduce((max, item) => Math.max(max, item.id), 0) + 1;

		const now = new Date();
		const createdAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

		const newTodo = {
			id: nextId,
			text: inputValue.trim(),
			done: false,
			createdAt,
			...(color && { color }),
			...(startDate && { startDate }),
			...(dueDate && { dueDate }),
			...(description.trim() && { description: description.trim() }),
			...(tags.length > 0 && { tags }),
		};
		localStorage.setItem(storageKey, JSON.stringify([...savedList, newTodo]));
		navigate('/todo');
	};

	if (!currentUser) return null;

	return (
		<div className="todo_form_page">
			<h2 className="todo_form_title">할 일 추가</h2>
			<form onSubmit={handleSubmit}>
				<TodoColorSelector username={currentUser.username} selectedColor={color} onChange={setColor} />
				<input
					ref={inputRef}
					type="text"
					className="todo_input"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					placeholder="새로운 할 일을 입력하세요."
					autoFocus
				/>
				<textarea
					className="todo_input todo_textarea"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					placeholder="설명을 입력하세요."
					maxLength={200}
					rows={3}
				/>
				<TodoTagSelector username={currentUser.username} selectedTags={tags} onChange={setTags} />
				<label className="todo_done_label">
					<input type="checkbox" checked={showDates} onChange={(e) => handleShowDates(e.target.checked)} />
					시작/마감 추가
				</label>
				{showDates && (
					<div className="todo_date_row">
						<label className="todo_date_label">시작일</label>
						<input type="date" className="todo_input todo_date_input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
						<label className="todo_date_label">마감일</label>
						<input type="date" className="todo_input todo_date_input" value={dueDate} onChange={(e) => {
								const val = e.target.value;
								setDueDate(val);
								if (val && startDate && val < startDate) setStartDate('');
							}} />
					</div>
				)}
				<div className="todo_form_btn_wrap">
					<button type="submit" className="btn_submit">추가</button>
					<button type="button" className="btn_cancel" onClick={() => navigate('/todo')}>취소</button>
				</div>
			</form>
		</div>
	);
}

export default TodoAddPage;
