import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getColorObj } from '../utils/todoColorUtils';

function TodoDetailPage() {
	const { id } = useParams(); // URL에서 할 일 id 추출
	const { currentUser } = useAuth();
	const navigate = useNavigate();

	const storageKey = `myTodoList_${currentUser?.username}`;
	const savedList = JSON.parse(localStorage.getItem(storageKey) || '[]');
	const todo = savedList.find(item => item.id === Number(id));

	if (!currentUser) {
		navigate('/login');
		return null;
	}

	if (!todo) {
		return (
			<div className="todo_detail_container">
				<p className="todo_detail_not_found">존재하지 않는 항목입니다.</p>
				<button type="button" className="btn_cancel" onClick={() => navigate('/todo')}>목록으로</button>
			</div>
		);
	}

	// 프리셋 + 커스텀 컬러 중 현재 todo의 color id에 맞는 색상 객체 반환
	const colorObj = getColorObj(currentUser.username, todo.color);

	// 마감일 상태 반환 — 기한 초과면 'overdue', 오늘이면 'today'
	const getDueDateStatus = () => {
		if (!todo.dueDate || todo.done) return null;
		const today = new Date().toISOString().slice(0, 10);
		if (todo.dueDate < today) return 'overdue';
		if (todo.dueDate === today) return 'today';
		return null;
	};

	const handleDelete = () => {
		if (!window.confirm('정말 삭제하시겠습니까?')) return;
		const updated = savedList.filter(item => item.id !== Number(id));
		localStorage.setItem(storageKey, JSON.stringify(updated));
		navigate('/todo');
	};

	const dueDateStatus = getDueDateStatus();

	return (
		<div className="todo_detail_container">
			{/* 헤더 — 컬러 칩, 완료 뱃지, 제목/내용/태그 */}
			<div className="todo_detail_header">
				<div className="todo_detail_status_row">
					{/* 흰색(기본값)이면 칩 숨김 */}
					{colorObj && colorObj.id !== 'white' && (
						<span className="todo_detail_color_chip" style={{ backgroundColor: colorObj.color }} />
					)}
					<span className={`todo_detail_badge${todo.done ? ' _done' : ''}`}>
						{todo.done ? '완료' : '진행 중'}
					</span>
				</div>
				<div className="todo_detail_info_list">
					<div className="todo_detail_info_row">
						<span className="todo_detail_info_label">제목</span>
						{/* 완료된 항목은 취소선(_done_text) 적용 */}
						<span className={`todo_detail_info_value _title${todo.done ? ' _done_text' : ''}`}>{todo.text}</span>
					</div>
					{todo.description && (
						<div className="todo_detail_info_row">
							<span className="todo_detail_info_label">내용</span>
							<span className="todo_detail_info_value">{todo.description}</span>
						</div>
					)}
					{todo.tags?.length > 0 && (
						<div className="todo_detail_info_row">
							<span className="todo_detail_info_label">태그</span>
							<div className="todo_detail_tags">
								{todo.tags.map(tag => (
									<span key={tag} className="todo_detail_tag">#{tag}</span>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* 날짜 정보 — 등록일, 완료일, 시작일, 마감일 */}
			<div className="todo_detail_body">
				<div className="todo_detail_info_list">
					<div className="todo_detail_info_row">
						<span className="todo_detail_info_label">등록일</span>
						<span className="todo_detail_info_value">{todo.createdAt}</span>
					</div>
					{todo.done && todo.completedAt && (
						<div className="todo_detail_info_row">
							<span className="todo_detail_info_label">완료일</span>
							<span className="todo_detail_info_value _done">{todo.completedAt}</span>
						</div>
					)}
					{todo.startDate && (
						<div className="todo_detail_info_row">
							<span className="todo_detail_info_label">시작일</span>
							<span className="todo_detail_info_value">{todo.startDate}</span>
						</div>
					)}
					{todo.dueDate && (
						<div className="todo_detail_info_row">
							<span className="todo_detail_info_label">마감일</span>
							{/* dueDateStatus가 있으면 _overdue 또는 _today 클래스 추가 */}
							<span className={`todo_detail_info_value${dueDateStatus ? ` _${dueDateStatus}` : ''}`}>
								{todo.dueDate}
								{dueDateStatus === 'overdue' && ' (기한 초과)'}
								{dueDateStatus === 'today' && ' (오늘 마감)'}
							</span>
						</div>
					)}
				</div>
			</div>

			<div className="todo_detail_footer">
				<button type="button" className="btn_cancel" onClick={() => navigate('/todo')}>목록</button>
				<div className="btn_wrap">
					<button type="button" className="btn_edit" onClick={() => navigate(`/todo/edit/${todo.id}`)}>수정</button>
					<button type="button" className="btn_del" onClick={handleDelete}>삭제</button>
				</div>
			</div>
		</div>
	);
}

export default TodoDetailPage;
