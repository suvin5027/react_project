import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminPage() {
	const { currentUser } = useAuth();
	const navigate = useNavigate();

	// admin 아닌 경우 접근 차단
	if (!currentUser || currentUser.username !== 'admin') {
		navigate('/board');
		return null;
	}

	const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem('myUsers') || '[]'));

	const handleDelete = (id) => {
		if (!window.confirm('정말 삭제하시겠습니까?')) return;
		const updated = users.filter(u => u.id !== id);
		setUsers(updated);
		localStorage.setItem('myUsers', JSON.stringify(updated));
	};

	return (
		<div className="admin_container">
			<h1 className="admin_title">유저 관리</h1>
			<table className="admin_table">
				<thead>
					<tr>
						<th>아이디</th>
						<th>가입일</th>
						<th>관리</th>
					</tr>
				</thead>
				<tbody>
					{users.length === 0 ? (
						<tr><td colSpan="3" className="admin_empty">가입된 유저가 없습니다.</td></tr>
					) : (
						users.map(user => (
							<tr key={user.id}>
								<td>{user.username}</td>
								<td>{user.createdAt ?? '-'}</td>
								<td>
									<button type="button" className="admin_btn_del" onClick={() => handleDelete(user.id)}>삭제</button>
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}

export default AdminPage;
