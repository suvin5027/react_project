// Created by psv
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import './App.scss';
import { AuthProvider, useAuth } from './context/AuthContext';
import TodoPage from './pages/TodoPage';
import BoardPage from './pages/BoardPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';

function NavBar() {
	const { currentUser, logout } = useAuth();
	return (
		<nav className="nav_menu">
			<NavLink to="/todo">할 일 목록</NavLink>
			<NavLink to="/board">게시판</NavLink>
			{currentUser?.username === 'admin' && <NavLink to="/admin">유저 관리</NavLink>}
			<div className="nav_auth">
				{currentUser ? (
					<>
						<span className="nav_username">{currentUser.username}</span>
						<button type="button" className="nav_logout_btn" onClick={logout}>로그아웃</button>
					</>
				) : (
					<NavLink to="/login">로그인</NavLink>
				)}
			</div>
		</nav>
	);
}

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<div className="App">
					<NavBar />
					<main>
						<Routes>
							<Route path="/todo" element={<TodoPage />} />
							<Route path="/board" element={<BoardPage />} />
							<Route path="/login" element={<LoginPage />} />
							<Route path="/admin" element={<AdminPage />} />
						</Routes>
					</main>
				</div>
			</BrowserRouter>
		</AuthProvider>
	);
}

export default App;
