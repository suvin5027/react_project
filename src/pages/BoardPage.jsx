import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

function BoardPage() {

	// 1. 게시글 목록 상태(초기값은 로컬스토리지에서 가져오기)
	const [postList, setPostList] = useState(() =>  {
		const savedPosts = localStorage.getItem('myBoardPosts');
		return savedPosts ? JSON.parse(savedPosts) : [];
	});

	// 2. 입력값 상태 (제목과 내용)
	const [title, setTitle] = useState('');
	// const [content, setContent] = useState('');
	const [writer, setWriter] = useState('');
	const [searchKeyword, setSearchKeyword] = useState('');
	const [editingPost, setEditingPost] = useState(null); // 수정 중인 게시글 정보(null이면 팝업 닫힘)

	const titleRef = useRef(null);
	const writerRef = useRef(null);

	// TipTap 에디터 (글쓰기용)
	const editor = useEditor({
		extensions: [StarterKit],
		content: '',
	});

	// TipTap 에디터 (수정 모달용)
	const editEditor = useEditor({
		extensions: [StarterKit],
		content: '',
	});

	// 수정 모달 열릴 때 에디터에 기존 내용 세팅
	useEffect(() => {
		if(editingPost && editEditor) {
			editEditor.commands.setContent(editingPost.content);
		}
	}, [editingPost]);


	// 3. 로컬스토리지 저장
	useEffect(() => {
		localStorage.setItem('myBoardPosts', JSON.stringify(postList));
	}, [postList]); // postList이 변경될 때마다 실행


	// 4. 글 추가
	const handleAddPost = (e) => {
		e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

		const content = editor.getHTML();
		const plainText = editor.getText();

		// if(title.trim() === '' || content.trim() === '' || writer.trim() === '') return;
		if(title.trim() === '') {
			alert('제목을 입력해주세요.');
			titleRef.current.focus();
			return;
		}
		if(writer.trim() === '') {
			alert('작성자를 입력해주세요.');
			writerRef.current.focus();
			return;
		}
		if(plainText.trim() === '') {
			alert('내용을 입력해주세요.');
			editor.commands.focus();
			return;
		}

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

		try {
			setPostList([newPost, ...postList]); // 최신글이 위로 오도록
			setTitle(''); // 입력창 초기화
			// setContent(''); // 입력창 초기화
			editor.commands.clearContent(); // 에디터 초기화
			setWriter(''); // 입력창 초기화
			alert('등록 되었습니다.');
		} catch (error) {
			console.error('게시글 등록 실패:', error);
			alert('등록에 실패했습니다. 다시 시도해주세요.');
		}
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
		const content = editEditor.getHTML();
		const plainText = editEditor.getText();

		if(editingPost.title.trim() === '') { alert('제목을 입력해주세요.'); return; }
		if(editingPost.writer.trim() === '') { alert('작성자를 입력해주세요.'); return; }
		if(plainText.trim() === '') { alert('내용을 입력해주세요.'); return; }

		try {
			setPostList(postList.map(post => post.id === editingPost.id ? {...editingPost, content} : post));
			setEditingPost(null);
			alert('수정 되었습니다.');
		} catch (error) {
			console.error('게시글 수정 실패:', error);
			alert('수정에 실패했습니다. 다시 시도해주세요.');
		}
	}

	// 8. 글 검색
	const filteredPosts = postList.filter(post => {
		const keyword = searchKeyword.toLowerCase();
		// HTML 태그 제거 후 plain text로 검색
		const plainContent = post.content.replace(/<[^>]*>/g, '');
		return (
			post.title.toLowerCase().includes(keyword) ||
			plainContent.toLowerCase().includes(keyword) ||
			post.writer.toLowerCase().includes(keyword)
		);
	});
	// const filteredPosts = postList.filter(post =>
	// 	post.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
	// 	post.content.toLowerCase().includes(searchKeyword.toLowerCase()) ||
	// 	post.writer.toLowerCase().includes(searchKeyword.toLowerCase())
	// );


	// UI반환 부분
	return (
		<div className="board_container">
			<h1 className="board_title">게시판</h1>

			{/* 검색, 글 목록 */}
			<div className="board_main">
				<section className='board_section'>
					{/* 검색 영역 */}
					<div className="board_search">
						<input type="text" className="board_input" placeholder="검색어를 입력하세요." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
					</div>

					{/* 글 목록 영역 */}
					<ul className="post_list">
						{filteredPosts.length === 0 ? (
							<li><p className="post_list_empty">{postList.length === 0 ? '게시글이 없습니다.' : '검색 결과가 없습니다.'}</p></li>
						) : (
							filteredPosts.map((post) => (
								<li className="post_item" key={post.id}>
									<h3 className="post_title">{post.title}</h3>
									{/* <p className="post_content">{post.content}</p> */}
									<div className="post_content" dangerouslySetInnerHTML={{ __html: post.content }} />
									<div className='post_footer'>
										<div className='post_info'>
											<div className="post_writer_box">작성자: {post.writer}</div>
											<span className="post_list_date">{post.createdAt}</span>
										</div>
										<div className='post_btn_wrap'>
											<button type="button" className="post_btn_edit" onClick={() => openEditModal(post)}>수정</button>
											<button type="button" className="post_btn_del" onClick={() => handleDeletePost(post.id)}>삭제</button>
										</div>
									</div>
								</li>
							))
						)}
					</ul>
				</section>

				{/* 글쓰기 영역 */}
				<form className="board_form" onSubmit={handleAddPost}>
					<div className='board_input_wrap'>
						<input ref={titleRef} type='text' className='board_input' placeholder='제목을 입력하세요.' value={title} onChange={(e) => setTitle(e.target.value)} />
						<input ref={writerRef} type='text' className='board_input_writer' placeholder='작성자를 입력하세요.' value={writer} onChange={(e) => setWriter(e.target.value)} />
					</div>
					{/* <textarea className='board_textarea' rows='5' placeholder='내용을 입력하세요.' value={content} onChange={(e) => setContent(e.target.value)}></textarea> */}
					<div className='board_editor'>
						<div className='board_editor_toolbar'>
							<button type='button' onClick={() => editor.chain().focus().toggleBold().run()} className={editor?.isActive('bold') ? '_on' : ''}>B</button>
							<button type='button' onClick={() => editor.chain().focus().toggleItalic().run()} className={editor?.isActive('italic') ? '_on' : ''}>I</button>
							<button type='button' onClick={() => editor.chain().focus().toggleStrike().run()} className={editor?.isActive('strike') ? '_on' : ''}>S</button>
							<span className='toolbar_divider' />
							<button type='button' onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor?.isActive('bulletList') ? '_on' : ''}>• 목록</button>
							<button type='button' onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor?.isActive('orderedList') ? '_on' : ''}>1. 목록</button>
						</div>
						<EditorContent editor={editor} />
					</div>
					<button type="submit" className="board_submit_btn">등록</button>
				</form>
			</div>

			{/* 수정 팝업 */}
			{editingPost && (
				<div className="modal_overlay">
					<div className="modal_content">
						<h2>게시글 수정</h2>
						<div className="modal_input_wrap">
							<input type="text" className="board_input" placeholder="제목" value={editingPost.title} onChange={(e) => setEditingPost({...editingPost, title: e.target.value})} />
							<input type="text" className="board_input_writer" placeholder="작성자" value={editingPost.writer} onChange={(e) => setEditingPost({...editingPost, writer: e.target.value})} />
						</div>
						<div className="board_editor">
							<div className="board_editor_toolbar">
								<button type="button" onClick={() => editEditor.chain().focus().toggleBold().run()} className={editEditor?.isActive('bold') ? '_on' : ''}>B</button>
								<button type="button" onClick={() => editEditor.chain().focus().toggleItalic().run()} className={editEditor?.isActive('italic') ? '_on' : ''}>I</button>
								<button type="button" onClick={() => editEditor.chain().focus().toggleStrike().run()} className={editEditor?.isActive('strike') ? '_on' : ''}>S</button>
								<span className="toolbar_divider" />
								<button type="button" onClick={() => editEditor.chain().focus().toggleBulletList().run()} className={editEditor?.isActive('bulletList') ? '_on' : ''}>• 목록</button>
								<button type="button" onClick={() => editEditor.chain().focus().toggleOrderedList().run()} className={editEditor?.isActive('orderedList') ? '_on' : ''}>1. 목록</button>
							</div>
							<EditorContent editor={editEditor} />
						</div>
						<div className="modal_btn">
							<button type="button" onClick={handleUpdatePost}>수정</button>
							<button type="button" onClick={() => { if(window.confirm('작업 중인 내용이 사라집니다. 취소하시겠습니까?')) setEditingPost(null); }}>취소</button>
						</div>
					</div>
				</div>
			)}
		</div> // board_container end
	);
}

// 🌟 이게 꼭 있어야 App.jsx에서 불러올 수 있음! 없으면 에러!
export default BoardPage;
