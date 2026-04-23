import React, { useState } from 'react';
import { DEFAULT_TAGS } from '../constants/todoTags';

function TodoTagSelector({ username, selectedTags, onChange }) {
	const storageKey = `myTodoTags_${username}`;

	const [customTags, setCustomTags] = useState(() =>
		JSON.parse(localStorage.getItem(storageKey) || '[]')
	);
	const [showInput, setShowInput] = useState(false);
	const [inputValue, setInputValue] = useState('');

	const allTags = [...DEFAULT_TAGS, ...customTags];

	const toggleTag = (tag) => {
		onChange(
			selectedTags.includes(tag)
				? selectedTags.filter(t => t !== tag)
				: [...selectedTags, tag]
		);
	};

	const handleAddTag = () => {
		const tag = inputValue.trim();
		if (!tag || allTags.includes(tag)) { setInputValue(''); return; }
		const updated = [...customTags, tag];
		localStorage.setItem(storageKey, JSON.stringify(updated));
		setCustomTags(updated);
		onChange([...selectedTags, tag]);
		setInputValue('');
		setShowInput(false);
	};

	const handleDeleteCustomTag = (tag) => {
		const updated = customTags.filter(t => t !== tag);
		localStorage.setItem(storageKey, JSON.stringify(updated));
		setCustomTags(updated);
		onChange(selectedTags.filter(t => t !== tag));
	};

	return (
		<div className="todo_tag_selector">
			<div className="todo_tag_chips">
				{allTags.map(tag => (
					<span key={tag} className={`todo_tag_chip${selectedTags.includes(tag) ? ' _on' : ''}`}>
						<button type="button" className="todo_tag_chip_label" onClick={() => toggleTag(tag)}>#{tag}</button>
						{customTags.includes(tag) && (
							<button type="button" className="todo_tag_chip_del" onClick={() => handleDeleteCustomTag(tag)}>×</button>
						)}
					</span>
				))}
				<button type="button" className="todo_tag_add_trigger" onClick={() => setShowInput(v => !v)}>
					+ 추가
				</button>
			</div>
			{showInput && (
				<div className="todo_tag_add_row">
					<input
						type="text"
						className="todo_input todo_tag_input"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
						placeholder="태그 이름 입력"
						maxLength={10}
						autoFocus
					/>
					<button type="button" className="todo_tag_add_btn" onClick={handleAddTag}>추가</button>
					<button type="button" className="btn_cancel" onClick={() => { setShowInput(false); setInputValue(''); }}>취소</button>
				</div>
			)}
		</div>
	);
}

export default TodoTagSelector;
