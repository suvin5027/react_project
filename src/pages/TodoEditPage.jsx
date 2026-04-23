import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TodoColorSelector from '../components/TodoColorSelector';
import TodoTagSelector from '../components/TodoTagSelector';

function TodoEditPage() {
	const { currentUser } = useAuth();
	const navigate = useNavigate();
	const { id } = useParams(); // URL에서 할 일 id 추출

	const storageKey = `myTodoList_${currentUser?.username}`;
	const savedList = JSON.parse(localStorage.getItem(storageKey) || '[]');
	const todo = savedList.find(item => item.id === Number(id));

	// 기존 값으로 폼 초기화 — 없으면 빈값 또는 기본값
	const [text, setText] = useState(todo?.text ?? '');
	const [description, setDescription] = useState(todo?.description ?? '');
	const [tags, setTags] = useState(todo?.tags ?? []);
	const [color, setColor] = useState(todo?.color ?? 'white');
	const [done, setDone] = useState(todo?.done ?? false);
	const [startDate, setStartDate] = useState(todo?.startDate ?? '');
	const [dueDate, setDueDate] = useState(todo?.dueDate ?? '');

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

	// 현재 시각을 "YYYY-MM-DD HH:mm" 형식으로 반환
	const getNow = () => {
		const now = new Date();
		return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (text.trim() === '') return;
		if (startDate && dueDate && dueDate < startDate) {
			alert('마감일은 시작일보다 빠를 수 없습니다.');
			return;
		}

		const updated = savedList.map(item => {
			if (item.id !== Number(id)) return item;
			// 완료 처리 시 completedAt 기록, 이미 있으면 유지 / 완료 해제 시 제거
			const completedAt = done ? (item.completedAt ?? getNow()) : undefined;
			return {
				...item,
				text: text.trim(),
				done,
				completedAt,
				// 값이 있으면 저장, 없으면 해당 키 자체를 undefined로 제거
				...(color ? { color } : { color: undefined }),
				...(startDate ? { startDate } : { startDate: undefined }),
				...(dueDate ? { dueDate } : { dueDate: undefined }),
				...(description.trim() ? { description: description.trim() } : { description: undefined }),
				...(tags.length > 0 ? { tags } : { tags: undefined }),
			};
		});
		localStorage.setItem(storageKey, JSON.stringify(updated));
		navigate('/todo');
	};

	return (
		<div className="todo_form_page">
			<h2 className="todo_form_title">할 일 수정</h2>
			<form onSubmit={handleSubmit}>
				<TodoColorSelector username={currentUser.username} selectedColor={color} onChange={setColor} />
				<input
					type="text"
					className="todo_input"
					value={text}
					onChange={(e) => setText(e.target.value)}
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
				<div className="todo_date_row">
					<label className="todo_date_label">시작일 (선택)</label>
					<input type="date" className="todo_input todo_date_input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
					<label className="todo_date_label">마감일 (선택)</label>
					<input type="date" className="todo_input todo_date_input" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
				</div>
				<TodoTagSelector username={currentUser.username} selectedTags={tags} onChange={setTags} />
				<label className="todo_done_label">
					<input type="checkbox" checked={done} onChange={(e) => setDone(e.target.checked)} />
					완료 표시
				</label>
				<div className="todo_edit_dates">
					{todo.createdAt && <span className="todo_completed_at">등록일: {todo.createdAt}</span>}
					{todo.completedAt && <span className="todo_completed_at _done">완료일: {todo.completedAt}</span>}
				</div>
				<div className="todo_form_btn_wrap">
					<button type="submit" className="btn_submit">수정</button>
					<button type="button" className="btn_cancel" onClick={() => navigate('/todo')}>취소</button>
				</div>
			</form>
		</div>
	);
}

export default TodoEditPage;
