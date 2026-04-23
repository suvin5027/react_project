import React, { useState } from 'react';
import { TODO_COLORS } from '../constants/todoColors';

function TodoColorSelector({ username, selectedColor, onChange }) {
	const storageKey = `myTodoColors_${username}`;

	const [customColors, setCustomColors] = useState(() =>
		JSON.parse(localStorage.getItem(storageKey) || '[]')
	);
	const [showPopup, setShowPopup] = useState(false);
	const [pickerColor, setPickerColor] = useState('#4a90e2');

	const handleAddCustom = () => {
		if (customColors.length >= 10) { alert('커스텀 컬러는 최대 10개까지 추가할 수 있습니다.'); return; }
		if (customColors.find(c => c.color === pickerColor)) return;
		const id = `custom_${Date.now()}`;
		const newColor = { id, color: pickerColor };
		const updated = [...customColors, newColor];
		localStorage.setItem(storageKey, JSON.stringify(updated));
		setCustomColors(updated);
		onChange(id);
		setShowPopup(false);
	};

	const handleDeleteCustom = (id) => {
		const updated = customColors.filter(c => c.id !== id);
		localStorage.setItem(storageKey, JSON.stringify(updated));
		setCustomColors(updated);
		if (selectedColor === id) onChange('white');
	};

	return (
		<div className="todo_color_section">
			{/* 프리셋 컬러 */}
			<div className="todo_color_row">
				<span className="todo_date_label">컬러 라벨</span>
				<div className="todo_color_swatches">
					{TODO_COLORS.map(c => (
						<button
							key={c.id}
							type="button"
							className={`color_swatch${selectedColor === c.id ? ' _on' : ''}`}
							style={{ backgroundColor: c.color }}
							onClick={() => onChange(c.id)}
						/>
					))}
				</div>
			</div>

			{/* 커스텀 컬러 */}
			<div className="todo_color_row">
				<span className="todo_date_label">커스텀 라벨</span>
				<div className="todo_color_swatches">
					{customColors.map(c => (
						<span key={c.id} className="todo_swatch_wrap">
							<button
								type="button"
								className={`color_swatch${selectedColor === c.id ? ' _on' : ''}`}
								style={{ backgroundColor: c.color }}
								onClick={() => onChange(c.id)}
							/>
							<button
								type="button"
								className="todo_swatch_del"
								onClick={() => handleDeleteCustom(c.id)}
							>×</button>
						</span>
					))}

					<div className="todo_swatch_add_wrap">
						<button
							type="button"
							className={`todo_swatch_add${showPopup ? ' _on' : ''}`}
							title="커스텀 컬러 추가"
							onClick={() => setShowPopup(v => !v)}
						/>
						{showPopup && (
							<div className="todo_color_popup">
								<div className="todo_color_popup_header">
									<span>사용자 컬러 관리</span>
									<button type="button" className="todo_color_popup_close" onClick={() => setShowPopup(false)}>×</button>
								</div>
								<div className="todo_color_popup_add">
									<div className="todo_color_popup_add_row">
										<div className="todo_color_popup_preview" style={{ backgroundColor: pickerColor }} />
										<button type="button" className="todo_tag_add_btn" onClick={handleAddCustom}>추가</button>
									</div>
									<input
										type="color"
										className="todo_color_picker"
										value={pickerColor}
										onChange={(e) => setPickerColor(e.target.value)}
									/>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default TodoColorSelector;
