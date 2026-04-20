import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useAuth } from '../context/AuthContext';

function BoardEditPage() {
	const { id } = useParams();
	const { currentUser } = useAuth();
	const navigate = useNavigate();

	const postList = JSON.parse(localStorage.getItem('myBoardPosts') || '[]');
	const post = postList.find(p => p.id === Number(id));

	const [title, setTitle] = useState(post?.title || '');
	const [category, setCategory] = useState(post?.category || '일반');

	const editor = useEditor({
		extensions: [StarterKit, Placeholder.configure({ placeholder: '내용을 입력하세요.' })],
		content: post?.content || '',
	});

	// 존재하지 않는 글이거나 권한 없으면 차단
	if (!post) return <div className="board_form_page"><p>존재하지 않는 게시글입니다.</p></div>;
	if (!currentUser || (currentUser.username !== post.writer && currentUser.username !== 'admin')) {
		navigate('/board');
		return null;
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		const content = editor.getHTML();
		const plainText = editor.getText();

		if (title.trim() === '') { alert('제목을 입력해주세요.'); return; }
		if (plainText.trim() === '') { alert('내용을 입력해주세요.'); return; }

		try {
			const updated = postList.map(p => p.id === Number(id) ? { ...p, title, content, category } : p);
			localStorage.setItem('myBoardPosts', JSON.stringify(updated));
			alert('수정되었습니다.');
			navigate('/board');
		} catch (error) {
			alert('수정에 실패했습니다. 다시 시도해주세요.');
		}
	};

	return (
		<div className="board_form_page">
			<h2 className="board_form_title">게시글 수정</h2>
			<form onSubmit={handleSubmit}>
				<div className="board_input_wrap">
					<select className="board_category_select" value={category} onChange={(e) => setCategory(e.target.value)}>
						{currentUser?.username === 'admin' && <option value="공지사항">공지사항</option>}
						<option value="일반">일반</option>
						<option value="질문">질문</option>
						<option value="자유">자유</option>
					</select>
					<input type="text" className="board_input" placeholder="제목을 입력하세요." value={title} onChange={(e) => setTitle(e.target.value)} />
					<span className="modal_writer">{post.writer}</span>
				</div>
				<div className="board_editor">
					<div className="board_editor_toolbar">
						<button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor?.isActive('bold') ? '_on' : ''}>B</button>
						<button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor?.isActive('italic') ? '_on' : ''}>I</button>
						<button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor?.isActive('strike') ? '_on' : ''}>S</button>
						<span className="toolbar_divider" />
						<button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor?.isActive('bulletList') ? '_on' : ''}>• 목록</button>
						<button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor?.isActive('orderedList') ? '_on' : ''}>1. 목록</button>
					</div>
					<EditorContent editor={editor} />
				</div>
				<div className="board_form_btn_wrap">
					<button type="submit" className="btn_submit">수정 완료</button>
					<button type="button" className="btn_cancel" onClick={() => { if (window.confirm('수정을 취소하시겠습니까?')) navigate('/board'); }}>취소</button>
				</div>
			</form>
		</div>
	);
}

export default BoardEditPage;
