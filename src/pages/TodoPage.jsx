import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function TodoPage() {
	const { currentUser } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!currentUser) navigate('/login');
	}, [currentUser]);

	const storageKey = `myTodoList_${currentUser?.username}`;

	const [todoList, setTodoList] = useState(() => {
		if (!currentUser) return [];
		const saved = localStorage.getItem(storageKey);
		return saved ? JSON.parse(saved) : [];
	});

	const [activeTab, setActiveTab] = useState('ALL');

	useEffect(() => {
		if (!currentUser) return;
		localStorage.setItem(storageKey, JSON.stringify(todoList));
	}, [todoList]);

	const handleDeleteTodo = (id) => {
		setTodoList(todoList.filter(item => item.id !== id));
	};

	const handleToggleTodo = (id) => {
		setTodoList(todoList.map(item =>
			item.id === id ? { ...item, done: !item.done } : item
		));
	};

	const totalCount = todoList.length;
	const doneCount = todoList.filter(item => item?.done).length;
	const remainingCount = totalCount - doneCount;

	const filteredList = todoList
		.filter(item => {
			if (activeTab === 'TODO') return !item.done;
			if (activeTab === 'DONE') return item.done;
			return true;
		})
		.sort((a, b) => {
			if (activeTab === 'ALL') {
				if (a.done !== b.done) return a.done ? -1 : 1;
			}
			return a.id - b.id;
		});

	if (!currentUser) return null;

	return (
		<div className="todo_container">
			<h1 className="title">📌 할 일 목록</h1>

			<div className="todo_stats">
				<p><span>전체:</span> {totalCount}개</p>
				<p><span>완료:</span> {doneCount}개</p>
				<p><span>남은 할 일:</span> {remainingCount}개</p>
			</div>

			<div className="todo_top">
				<div className="todo_tabs">
					<button className={activeTab === 'ALL' ? '_on' : ''} onClick={() => setActiveTab('ALL')}>전체</button>
					<button className={activeTab === 'TODO' ? '_on' : ''} onClick={() => setActiveTab('TODO')}>할 일</button>
					<button className={activeTab === 'DONE' ? '_on' : ''} onClick={() => setActiveTab('DONE')}>완료</button>
				</div>
				<button type="button" className="btn_write" onClick={() => navigate('/todo/add')}>+ 추가</button>
			</div>

			<ul className="todo_list">
				{filteredList.length === 0 && (
					<li className="todo_list_empty">할 일이 없어요!</li>
				)}
				{filteredList.map(item => (
					<li key={item.id} className={item.done ? 'done' : ''}>
						<label>
							<input type="checkbox" checked={item.done} onChange={() => handleToggleTodo(item.id)} />
							<span>{item.text}</span>
						</label>
						<div className="todo_item_right">
							{item.createdAt && <span className="date_text">{item.createdAt}</span>}
							<div className="btn_wrap">
								<button type="button" className="btn_edit" onClick={() => navigate(`/todo/edit/${item.id}`)}>수정</button>
								<button type="button" className="btn_del" onClick={() => handleDeleteTodo(item.id)}>삭제</button>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}

export default TodoPage;
