import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// 댓글 전체를 저장하는 localStorage 키
const COMMENTS_KEY = 'myBoardComments';

function BoardDetailPage() {
	const { id } = useParams(); // URL에서 게시글 id 추출
	const { currentUser } = useAuth();
	const navigate = useNavigate();
	const postId = Number(id);

	// 게시글 데이터 불러오기
	const postList = JSON.parse(localStorage.getItem('myBoardPosts') || '[]');
	const post = postList.find(p => p.id === postId);

	// 현재 게시글의 댓글만 필터링해서 초기값으로 설정
	const [comments, setComments] = useState(() =>
		JSON.parse(localStorage.getItem(COMMENTS_KEY) || '[]').filter(c => c.postId === postId)
	);
	const [commentInput, setCommentInput] = useState('');

	// 게시글이 없을 때 안내 메시지 표시
	if (!post) {
		return (
			<div className="board_detail_container">
				<p className="board_detail_not_found">존재하지 않는 게시글입니다.</p>
				<button type="button" className="btn_cancel" onClick={() => navigate('/board')}>목록으로</button>
			</div>
		);
	}

	// 작성자 본인 또는 admin만 수정/삭제 버튼 노출
	const canEdit = currentUser && (currentUser.username === post.writer || currentUser.username === 'admin');

	// 게시글 삭제
	const handleDelete = () => {
		if (!window.confirm('정말 삭제하시겠습니까?')) return;
		const updated = postList.filter(p => p.id !== postId);
		localStorage.setItem('myBoardPosts', JSON.stringify(updated));
		navigate('/board');
	};

	// 현재 시각을 "YYYY-MM-DD HH:mm" 형식으로 반환
	const getNow = () => {
		const now = new Date();
		return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
	};

	// 댓글 등록
	const handleCommentSubmit = (e) => {
		e.preventDefault();
		if (commentInput.trim() === '') return;

		// 전체 댓글 목록에 새 댓글 추가 후 저장
		const allComments = JSON.parse(localStorage.getItem(COMMENTS_KEY) || '[]');
		const nextId = allComments.reduce((max, c) => Math.max(max, c.id), 0) + 1;
		const newComment = {
			id: nextId,
			postId,
			writer: currentUser.username,
			content: commentInput.trim(),
			createdAt: getNow(),
		};
		const updated = [...allComments, newComment];
		localStorage.setItem(COMMENTS_KEY, JSON.stringify(updated));
		// 화면에는 현재 게시글 댓글만 다시 필터링해서 표시
		setComments(updated.filter(c => c.postId === postId));
		setCommentInput('');
	};

	// 댓글 삭제
	const handleCommentDelete = (commentId) => {
		if (!window.confirm('댓글을 삭제하시겠습니까?')) return;
		const allComments = JSON.parse(localStorage.getItem(COMMENTS_KEY) || '[]');
		const updated = allComments.filter(c => c.id !== commentId);
		localStorage.setItem(COMMENTS_KEY, JSON.stringify(updated));
		setComments(updated.filter(c => c.postId === postId));
	};

	return (
		<div className="board_detail_container">
			{/* 게시글 헤더 — 카테고리, 제목, 작성자/날짜 */}
			<div className="board_detail_header">
				<span className={`board_detail_category _cat_${{ '공지사항': 'notice', '질문': 'question', '자유': 'free' }[post.category] ?? 'general'}`}>{post.category ?? '일반'}</span>
				<h2 className="board_detail_title">{post.category === '공지사항' && '📌 '}{post.title}</h2>
				<div className="board_detail_meta">
					<span>{post.writer}</span>
					<span>{post.createdAt}</span>
				</div>
			</div>

			{/* 게시글 본문 — TipTap이 생성한 HTML을 그대로 렌더링 */}
			<div className="board_detail_content" dangerouslySetInnerHTML={{ __html: post.content }} />

			{/* 하단 버튼 — 목록 / 수정 / 삭제 */}
			<div className="board_detail_footer">
				<button type="button" className="btn_cancel" onClick={() => navigate('/board')}>목록</button>
				{canEdit && (
					<div className="btn_wrap">
						<button type="button" className="btn_edit" onClick={() => navigate(`/board/edit/${post.id}`)}>수정</button>
						<button type="button" className="btn_del" onClick={handleDelete}>삭제</button>
					</div>
				)}
			</div>

			{/* 댓글 영역 */}
			<div className="board_comments">
				<h3 className="board_comments_title">
					댓글 {comments.length > 0 && <span className="board_comments_count">{comments.length}</span>}
				</h3>

				{/* 댓글 목록 */}
				<ul className="board_comment_list">
					{comments.length === 0 && (
						<li className="board_comment_empty">아직 댓글이 없어요.</li>
					)}
					{comments.map(c => {
						// 본인 댓글이거나 admin이면 삭제 버튼 노출
						const canDelete = currentUser && (currentUser.username === c.writer || currentUser.username === 'admin');
						return (
							<li key={c.id} className="board_comment_item">
								<div className="board_comment_meta">
									<span className="board_comment_writer">{c.writer}</span>
									<span className="board_comment_date">{c.createdAt}</span>
									{canDelete && (
										<button type="button" className="board_comment_del" onClick={() => handleCommentDelete(c.id)}>삭제</button>
									)}
								</div>
								<p className="board_comment_content">{c.content}</p>
							</li>
						);
					})}
				</ul>

				{/* 댓글 작성 폼 — 로그인한 사용자만 표시 */}
				{currentUser ? (
					<form className="board_comment_form" onSubmit={handleCommentSubmit}>
						<textarea
							className="board_comment_input"
							value={commentInput}
							onChange={(e) => setCommentInput(e.target.value)}
							placeholder="댓글을 입력하세요."
							rows={3}
							maxLength={500}
							// Enter 단독 입력 시 등록, Shift+Enter는 줄바꿈
							onKeyDown={(e) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault();
									handleCommentSubmit(e);
								}
							}}
						/>
						<div className="board_comment_form_footer">
							<span className="board_comment_char">{commentInput.length} / 500</span>
							<button type="submit" className="btn_submit">등록</button>
						</div>
					</form>
				) : (
					// 미로그인 시 로그인 유도
					<p className="board_comment_login_msg">
						댓글을 작성하려면 <button type="button" onClick={() => navigate('/login')}>로그인</button>이 필요합니다.
					</p>
				)}
			</div>
		</div>
	);
}

export default BoardDetailPage;
