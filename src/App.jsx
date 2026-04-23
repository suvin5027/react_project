// Created by psv
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import './App.scss';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import TodoPage from './pages/TodoPage';
import TodoAddPage from './pages/TodoAddPage';
import TodoEditPage from './pages/TodoEditPage';
import TodoDetailPage from './pages/TodoDetailPage';
import BoardPage from './pages/BoardPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import BoardWritePage from './pages/BoardWritePage';
import BoardEditPage from './pages/BoardEditPage';
import BoardDetailPage from './pages/BoardDetailPage';

// 상단 네비게이션 바 컴포넌트
function NavBar() {
	const { currentUser, logout } = useAuth();
	const { theme, setTheme } = useTheme();
	return (
		<nav className="nav_menu">
			<NavLink to="/todo">할 일 목록</NavLink>
			<NavLink to="/board">게시판</NavLink>
			{/* admin 계정일 때만 유저 관리 메뉴 표시 */}
			{currentUser?.username === 'admin' && <NavLink to="/admin">유저 관리</NavLink>}
			<div className="nav_auth">
				{/* 다크/라이트 모드 토글 버튼 — 현재 테마에 _on 클래스로 강조 */}
				<div className="nav_theme_btns">
					<button type="button" className={`nav_theme_btn${theme === 'dark' ? ' _on' : ''}`} onClick={() => setTheme('dark')} title="다크 모드">🌙</button>
					<button type="button" className={`nav_theme_btn${theme === 'light' ? ' _on' : ''}`} onClick={() => setTheme('light')} title="라이트 모드">☀️</button>
				</div>
				{/* 로그인 상태에 따라 유저 정보 또는 로그인 링크 표시 */}
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
		// ThemeProvider → AuthProvider 순으로 감싸야 NavBar에서 두 Context 모두 사용 가능
		<ThemeProvider>
			<AuthProvider>
				<BrowserRouter>
					<div className="App">
						<NavBar />
						<main>
							<Routes>
								<Route path="/todo" element={<TodoPage />} />
								<Route path="/todo/add" element={<TodoAddPage />} />
								<Route path="/todo/edit/:id" element={<TodoEditPage />} />
								<Route path="/todo/detail/:id" element={<TodoDetailPage />} />
								<Route path="/board" element={<BoardPage />} />
								<Route path="/login" element={<LoginPage />} />
								<Route path="/admin" element={<AdminPage />} />
								<Route path="/board/write" element={<BoardWritePage />} />
								<Route path="/board/edit/:id" element={<BoardEditPage />} />
								<Route path="/board/detail/:id" element={<BoardDetailPage />} />
							</Routes>
						</main>
					</div>
				</BrowserRouter>
			</AuthProvider>
		</ThemeProvider>
	);
}

export default App;
