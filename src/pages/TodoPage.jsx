import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getColorObj } from '../utils/todoColorUtils';

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
	const [searchKeyword, setSearchKeyword] = useState('');
	const [appliedKeyword, setAppliedKeyword] = useState('');

	const handleSearch = () => setAppliedKeyword(searchKeyword);

	useEffect(() => {
		if (!currentUser) return;
		localStorage.setItem(storageKey, JSON.stringify(todoList));
	}, [todoList]);

	const getDueDateStatus = (dueDate, done) => {
		if (!dueDate || done) return null;
		const today = new Date().toISOString().slice(0, 10);
		if (dueDate < today) return 'overdue';
		if (dueDate === today) return 'today';
		return null;
	};

	const handleDeleteTodo = (id) => {
		setTodoList(todoList.filter(item => item.id !== id));
	};

	const getNow = () => {
		const now = new Date();
		return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
	};

	const handleToggleTodo = (id) => {
		setTodoList(todoList.map(item => {
			if (item.id !== id) return item;
			const toggled = !item.done;
			return toggled
				? { ...item, done: true, completedAt: getNow() }
				: { ...item, done: false, completedAt: undefined };
		}));
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
		.filter(item => appliedKeyword === '' || item.text.toLowerCase().includes(appliedKeyword.toLowerCase()))
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

			<div className="todo_tabs">
				<button className={activeTab === 'ALL' ? '_on' : ''} onClick={() => setActiveTab('ALL')}>전체</button>
				<button className={activeTab === 'TODO' ? '_on' : ''} onClick={() => setActiveTab('TODO')}>할 일</button>
				<button className={activeTab === 'DONE' ? '_on' : ''} onClick={() => setActiveTab('DONE')}>완료</button>
			</div>

			<div className="todo_search_row">
				<input
					type="text"
					className="todo_search_input"
					placeholder="검색어를 입력하세요."
					value={searchKeyword}
					onChange={(e) => setSearchKeyword(e.target.value)}
					onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
				/>
				<button type="button" className="board_search_btn" onClick={handleSearch}>검색</button>
			</div>

			<div className="todo_write_row">
				<button type="button" className="btn_write" onClick={() => navigate('/todo/add')}>+ 추가</button>
			</div>

			<ul className="todo_list">
				{filteredList.length === 0 && (
					<li className="todo_list_empty">할 일이 없어요!</li>
				)}
				{filteredList.map(item => (
					<li
						key={item.id}
						className={item.done ? 'done' : ''}
						style={{ borderLeft: `4px solid ${getColorObj(currentUser.username, item.color)?.color ?? 'transparent'}` }}
					>
						<input type="checkbox" checked={item.done} onChange={() => handleToggleTodo(item.id)} disabled={item.done} />
						<div className="todo_main">
							<span className="todo_text" onClick={() => navigate(`/todo/detail/${item.id}`)}>{item.text}</span>
							{item.tags?.length > 0 && (
								<div className="todo_tag_list">
									{item.tags.map(tag => <span key={tag} className="todo_tag_chip_sm">#{tag}</span>)}
								</div>
							)}
							<div className="todo_dates">
								<div className="todo_dates_record">
									{item.done && item.completedAt
										? <span className="date_text date_done">완료: {item.completedAt}</span>
										: <span className="date_text">등록: {item.createdAt}</span>
									}
								</div>
								{(item.startDate || item.dueDate) && (
									<div className="todo_dates_plan _divider">
										{item.startDate && <span className="date_text">시작: {item.startDate}</span>}
										{item.dueDate && (
											<span className={`date_text due_date ${getDueDateStatus(item.dueDate, item.done) ?? ''}`}>
												마감: {item.dueDate}
											</span>
										)}
									</div>
								)}
							</div>
						</div>
						<div className="btn_wrap">
							<button type="button" className="btn_edit" onClick={() => navigate(`/todo/edit/${item.id}`)}>수정</button>
							<button type="button" className="btn_del" onClick={() => handleDeleteTodo(item.id)}>삭제</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}

export default TodoPage;
