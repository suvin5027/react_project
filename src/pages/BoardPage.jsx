import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function BoardPage() {
	const { currentUser } = useAuth();
	const navigate = useNavigate();

	const [postList, setPostList] = useState(() => JSON.parse(localStorage.getItem('myBoardPosts') || '[]'));
	const [searchKeyword, setSearchKeyword] = useState('');
	const [searchType, setSearchType] = useState('all');

	// 삭제
	const handleDeletePost = (id) => {
		if (!window.confirm('정말 삭제하시겠습니까?')) return;
		const updated = postList.filter(post => post.id !== id);
		setPostList(updated);
		localStorage.setItem('myBoardPosts', JSON.stringify(updated));
	};

	// 검색 필터
	const filteredPosts = postList.filter(post => {
		const keyword = searchKeyword.toLowerCase();
		const plainContent = post.content.replace(/<[^>]*>/g, '');
		if (searchType === 'writer') return post.writer.toLowerCase().includes(keyword);
		if (searchType === 'title_content') return post.title.toLowerCase().includes(keyword) || plainContent.toLowerCase().includes(keyword);
		return post.title.toLowerCase().includes(keyword) || plainContent.toLowerCase().includes(keyword) || post.writer.toLowerCase().includes(keyword);
	});

	const canEdit = (post) => currentUser && (currentUser.username === post.writer || currentUser.username === 'admin');

	return (
		<div className="board_container">
			<h1 className="board_title">게시판</h1>

			<div className="board_top">
				<div className="board_search">
					<select className="board_search_select" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
						<option value="all">전체</option>
						<option value="title_content">제목+내용</option>
						<option value="writer">작성자</option>
					</select>
					<input type="text" className="board_search_input" placeholder="검색어를 입력하세요." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
				</div>
				{currentUser && (
					<button type="button" className="btn_write" onClick={() => navigate('/board/write')}>글쓰기</button>
				)}
			</div>

			<ul className="post_list">
				{filteredPosts.length === 0 ? (
					<li><p className="post_list_empty">{postList.length === 0 ? '게시글이 없습니다.' : '검색 결과가 없습니다.'}</p></li>
				) : (
					filteredPosts.map((post) => (
						<li className="post_item" key={post.id}>
							<h3 className="post_title">{post.category === '공지사항' && '📌 '}{post.title}</h3>
							<div className="post_content" dangerouslySetInnerHTML={{ __html: post.content }} />
							<div className="post_footer">
								<div className="post_info">
									<span className="post_writer_box">작성자: {post.writer}</span>
									<span className="post_list_date">{post.createdAt}</span>
								</div>
								<div className="btn_wrap">
									<button type="button" className="btn_detail" onClick={() => navigate(`/board/detail/${post.id}`)}>상세보기</button>
									{canEdit(post) && (
										<>
											<button type="button" className="btn_edit" onClick={() => navigate(`/board/edit/${post.id}`)}>수정</button>
											<button type="button" className="btn_del" onClick={() => handleDeletePost(post.id)}>삭제</button>
										</>
									)}
								</div>
							</div>
						</li>
					))
				)}
			</ul>
		</div>
	);
}

export default BoardPage;
