import React, { useState, useEffect } from 'react';

function BoardPage() {

	// 1. 게시글 목록 상태(초기값은 로컬스토리지에서 가져오기)
	const [postList, setPostList] = useState(() =>  {
		const savedPosts = localStorage.getItem('myBoardPosts');
		return savedPosts ? JSON.parse(savedPosts) : [];
	});

	// 2. 입력값 상태 (제목과 내용)
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [writer, setWriter] = useState('');
	const [searchKeyword, setSearchKeyword] = useState('');
	const [editingPost, setEditingPost] = useState(null); // 수정 중인 게시글 정보(null이면 팝업 닫힘)





	// 3. 로컬스토리지 저장
	useEffect(() => {
		localStorage.setItem('myBoardPosts', JSON.stringify(postList));
	}, [postList]); // postList이 변경될 때마다 실행





	// 4. 글 추가
	const handleAddPost = (e) => {
		e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
		if(title.trim() === '' || content.trim() === '' || writer.trim() === '') return;

		const nextId = postList.reduce((maxId, post) => Math.max(maxId, post.id), 0) + 1; // 현재 최대 id + 1
		const now = new Date();
		const dateString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

		const newPost = {
			id: nextId,
			title: title,
			content: content,
			writer: writer,
			createdAt: dateString,
		};

		setPostList([newPost, ...postList]) // 최신글이 위로 오도록
		setTitle(''); // 입력창 초기화
		setContent(''); // 입력창 초기화
		setWriter(''); // 입력창 초기화
	};

	// 5. 글 삭제
	const handleDeletePost = (id) => {
		if(window.confirm('정말 삭제하시겠습니까?')) {
			const updatedPosts = postList.filter(post => post.id !== id);
			setPostList(updatedPosts);
		}
	}

	// 6. 글 수정 팝업 열기
	const openEditModal = (post) => {
		setEditingPost({...post}); // 수정할 게시글 정보 저장
	}

	// 7. 글 수정 저장
	const handleUpdatePost = () => {
		if(editingPost.title.trim() === '' || editingPost.content.trim() === '' || editingPost.writer.trim() === '') return;

		setPostList(postList.map(post => post.id === editingPost.id ? editingPost : post)); // 수정된 게시글로 업데이트
		setEditingPost(null); // 팝업 닫기
	}

	// 8. 글 검색
	const filteredPosts = postList.filter(post =>
		post.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
		post.content.toLowerCase().includes(searchKeyword.toLowerCase()) ||
		post.writer.toLowerCase().includes(searchKeyword.toLowerCase())
	);








	// UI반환 부분
	return (
		<div className="board_container">
			<h1 className="board_title">자유 게시판</h1>

			{/* 글쓰기 영역 */}
			<form className="board_form" onSubmit={handleAddPost}>
				<div className='board_input_wrap'>
					<input type='text' className='board_input' placeholder='제목을 입력하세요.' value={title} onChange={(e) => setTitle(e.target.value)} />
					<input type='text' className='board_input_writer' placeholder='작성자를 입력하세요.' value={writer} onChange={(e) => setWriter(e.target.value)} />
				</div>
				<textarea className='board_textarea' rows='5' placeholder='내용을 입력하세요.' value={content} onChange={(e) => setContent(e.target.value)}></textarea>
				<button type="submit" className="board_submit_btn">등록</button>
			</form>

			{/* 검색 영역 */}
			<div className="board_search">
				<input type="text" className="board_input" placeholder="검색어를 입력하세요." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
			</div>

			{/* 글 목록 영역 */}
			<div className="post_list">
				{filteredPosts.length === 0 ? (
					<p className="post_list_empty">검색 결과가 없습니다.</p>
				) : (
					filteredPosts.map((post) => (
						<div className="post_item" key={post.id}>
							<h3 className="post_title">{post.title}</h3>
							<p className="post_content">{post.content}</p>
							<div className='post_footer'>
								<div className="post_writer_box">작성자: {post.writer}</div>
								<span className="post_list_date">{post.createdAt}</span>
								<button type="button" className="post_btn_del" onClick={() => handleDeletePost(post.id)}>삭제</button>
							</div>
						</div>
					))
				)}
			</div>

			{/* 수정 팝업 */}
			{editingPost && (
				<div className="edit_modal">

				</div>
			)}
		</div> // board_container end
	);
}

// 🌟 이게 꼭 있어야 App.jsx에서 불러올 수 있음! 없으면 에러!
export default BoardPage;