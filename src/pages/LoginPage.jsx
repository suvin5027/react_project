import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
	const [tab, setTab] = useState('login'); // 'login' | 'signup'
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const { login } = useAuth();
	const navigate = useNavigate();

	const getUsers = () => JSON.parse(localStorage.getItem('myUsers') || '[]');

	// 로그인
	const handleLogin = (e) => {
		e.preventDefault();
		const users = getUsers();
		const found = users.find(u => u.username === username && u.password === password);
		if (!found) {
			alert('아이디 또는 비밀번호가 올바르지 않습니다.');
			return;
		}
		login({ id: found.id, username: found.username });
		navigate('/board');
	};

	// 회원가입
	const handleSignup = (e) => {
		e.preventDefault();
		if (username.trim() === '' || password.trim() === '') {
			alert('아이디와 비밀번호를 입력해주세요.');
			return;
		}
		const users = getUsers();
		if (users.find(u => u.username === username)) {
			alert('이미 사용 중인 아이디입니다.');
			return;
		}
		const now = new Date();
		const createdAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
		const newUser = {
			id: Date.now(),
			username: username.trim(),
			password: password.trim(),
			createdAt,
		};
		localStorage.setItem('myUsers', JSON.stringify([...users, newUser]));
		alert('회원가입이 완료되었습니다. 로그인해주세요.');
		setTab('login');
		setPassword('');
	};

	return (
		<div className="login_container">
			<div className="login_box">
				<div className="login_tabs">
					<button type="button" className={tab === 'login' ? '_on' : ''} onClick={() => setTab('login')}>로그인</button>
					<button type="button" className={tab === 'signup' ? '_on' : ''} onClick={() => setTab('signup')}>회원가입</button>
				</div>

				<form onSubmit={tab === 'login' ? handleLogin : handleSignup}>
					<input
						type="text"
						className="login_input"
						placeholder="아이디"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
					<input
						type="password"
						className="login_input"
						placeholder="비밀번호"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<button type="submit" className="login_submit_btn">
						{tab === 'login' ? '로그인' : '회원가입'}
					</button>
				</form>
			</div>
		</div>
	);
}

export default LoginPage;
