import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function BoardDetailPage() {
	const { id } = useParams();
	const { currentUser } = useAuth();
	const navigate = useNavigate();

	const postList = JSON.parse(localStorage.getItem('myBoardPosts') || '[]');
	const post = postList.find(p => p.id === Number(id));

	if (!post) {
		return (
			<div className="board_detail_container">
				<p className="board_detail_not_found">존재하지 않는 게시글입니다.</p>
				<button type="button" className="btn_cancel" onClick={() => navigate('/board')}>목록으로</button>
			</div>
		);
	}

	const canEdit = currentUser && (currentUser.username === post.writer || currentUser.username === 'admin');

	const handleDelete = () => {
		if (!window.confirm('정말 삭제하시겠습니까?')) return;
		const updated = postList.filter(p => p.id !== Number(id));
		localStorage.setItem('myBoardPosts', JSON.stringify(updated));
		navigate('/board');
	};

	return (
		<div className="board_detail_container">
			<div className="board_detail_header">
				<span className={`board_detail_category _cat_${{ '공지사항': 'notice', '질문': 'question', '자유': 'free' }[post.category] ?? 'general'}`}>{post.category ?? '일반'}</span>
				<h2 className="board_detail_title">{post.category === '공지사항' && '📌 '}{post.title}</h2>
				<div className="board_detail_meta">
					<span>{post.writer}</span>
					<span>{post.createdAt}</span>
				</div>
			</div>
			<div className="board_detail_content" dangerouslySetInnerHTML={{ __html: post.content }} />
			<div className="board_detail_footer">
				<button type="button" className="btn_cancel" onClick={() => navigate('/board')}>목록</button>
				{canEdit && (
					<div className="btn_wrap">
						<button type="button" className="btn_edit" onClick={() => navigate(`/board/edit/${post.id}`)}>수정</button>
						<button type="button" className="btn_del" onClick={handleDelete}>삭제</button>
					</div>
				)}
			</div>
		</div>
	);
}

export default BoardDetailPage;
