import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PAGE_SIZE = 10;

function BoardPage() {
	const { currentUser } = useAuth();
	const navigate = useNavigate();

	const [postList, setPostList] = useState(() => JSON.parse(localStorage.getItem('myBoardPosts') || '[]'));
	const [searchKeyword, setSearchKeyword] = useState('');
	const [searchType, setSearchType] = useState('all');
	const [appliedKeyword, setAppliedKeyword] = useState('');
	const [appliedType, setAppliedType] = useState('all');
	const [currentPage, setCurrentPage] = useState(1);
	const [categoryTab, setCategoryTab] = useState('전체');

	const CATEGORIES = ['전체', '공지사항', '일반', '질문', '자유'];

	const handleDeletePost = (id) => {
		if (!window.confirm('정말 삭제하시겠습니까?')) return;
		const updated = postList.filter(post => post.id !== id);
		setPostList(updated);
		localStorage.setItem('myBoardPosts', JSON.stringify(updated));
	};

	const handleSearch = () => {
		setAppliedKeyword(searchKeyword);
		setAppliedType(searchType);
		setCurrentPage(1);
	};

	const handleCategoryTab = (cat) => {
		setCategoryTab(cat);
		setCurrentPage(1);
	};

	const filteredPosts = postList.filter(post => {
		if (categoryTab !== '전체' && (post.category ?? '일반') !== categoryTab) return false;
		const keyword = appliedKeyword.toLowerCase();
		const plainContent = post.content.replace(/<[^>]*>/g, '');
		if (appliedType === 'writer') return post.writer.toLowerCase().includes(keyword);
		if (appliedType === 'title_content') return post.title.toLowerCase().includes(keyword) || plainContent.toLowerCase().includes(keyword);
		return post.title.toLowerCase().includes(keyword) || plainContent.toLowerCase().includes(keyword) || post.writer.toLowerCase().includes(keyword);
	});

	const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
	const pagedPosts = filteredPosts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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
					<input
						type="text"
						className="board_search_input"
						placeholder="검색어를 입력하세요."
						value={searchKeyword}
						onChange={(e) => setSearchKeyword(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
					/>
					<button type="button" className="board_search_btn" onClick={handleSearch}>검색</button>
				</div>
			</div>
			{currentUser && (
				<div className="board_write_row">
					<button type="button" className="btn_write" onClick={() => navigate('/board/write')}>글쓰기</button>
				</div>
			)}

			<div className="board_category_tabs">
				{CATEGORIES.map(cat => (
					<button key={cat} type="button" className={categoryTab === cat ? '_on' : ''} onClick={() => handleCategoryTab(cat)}>{cat}</button>
				))}
			</div>

			<div className="post_table_wrap">
			<table className="post_table">
				<thead>
					<tr>
						<th className="col_category">카테고리</th>
						<th className="col_title">제목</th>
						<th className="col_writer">작성자</th>
						<th className="col_date">등록일</th>
					</tr>
				</thead>
				<tbody>
					{pagedPosts.length === 0 ? (
						<tr>
							<td colSpan={4} className="post_list_empty">
								{postList.length === 0 ? '게시글이 없습니다.' : '검색 결과가 없습니다.'}
							</td>
						</tr>
					) : (
						pagedPosts.map((post, idx) => (
							<tr className="post_row" key={post.id}>
								<td className="col_category">{post.category ?? '일반'}</td>
								<td className="col_title post_title" onClick={() => navigate(`/board/detail/${post.id}`)}>
									{post.category === '공지사항' && '📌 '}{post.title}
								</td>
								<td className="col_writer">{post.writer}</td>
								<td className="col_date">{post.createdAt}</td>
							</tr>
						))
					)}
				</tbody>
			</table>
			</div>

			{totalPages > 1 && (
				<div className="board_pagination">
					<button type="button" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>이전</button>
					{Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
						<button
							key={page}
							type="button"
							className={currentPage === page ? '_on' : ''}
							onClick={() => setCurrentPage(page)}
						>
							{page}
						</button>
					))}
					<button type="button" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>다음</button>
				</div>
			)}
		</div>
	);
}

export default BoardPage;
