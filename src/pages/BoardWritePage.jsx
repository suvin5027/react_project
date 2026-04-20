import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useAuth } from '../context/AuthContext';

function BoardWritePage() {
	const { currentUser } = useAuth();
	const navigate = useNavigate();

	const [title, setTitle] = useState('');
	const [category, setCategory] = useState('자유');
	const titleRef = useRef(null);

	const editor = useEditor({
		extensions: [StarterKit, Placeholder.configure({ placeholder: '내용을 입력하세요.' })],
		content: '',
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		const content = editor.getHTML();
		const plainText = editor.getText();

		if (title.trim() === '') { alert('제목을 입력해주세요.'); titleRef.current.focus(); return; }
		if (plainText.trim() === '') { alert('내용을 입력해주세요.'); editor.commands.focus(); return; }

		const postList = JSON.parse(localStorage.getItem('myBoardPosts') || '[]');
		const nextId = postList.reduce((max, p) => Math.max(max, p.id), 0) + 1;
		const now = new Date();
		const createdAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

		const newPost = { id: nextId, title, content, writer: currentUser.username, category, createdAt };

		try {
			localStorage.setItem('myBoardPosts', JSON.stringify([newPost, ...postList]));
			alert('등록되었습니다.');
			navigate('/board');
		} catch (error) {
			alert('등록에 실패했습니다. 다시 시도해주세요.');
		}
	};

	return (
		<div className="board_form_page">
			<h2 className="board_form_title">글쓰기</h2>
			<form onSubmit={handleSubmit}>
				<div className="board_input_wrap">
					<select className="board_category_select" value={category} onChange={(e) => setCategory(e.target.value)}>
						{currentUser?.username === 'admin' && <option value="공지사항">공지사항</option>}
						<option value="일반">일반</option>
						<option value="질문">질문</option>
						<option value="자유">자유</option>
					</select>
					<input ref={titleRef} type="text" className="board_input" placeholder="제목을 입력하세요." value={title} onChange={(e) => setTitle(e.target.value)} />
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
					<button type="submit" className="btn_submit">등록</button>
					<button type="button" className="btn_cancel" onClick={() => { if (window.confirm('작성을 취소하시겠습니까?')) navigate('/board'); }}>취소</button>
				</div>
			</form>
		</div>
	);
}

export default BoardWritePage;
