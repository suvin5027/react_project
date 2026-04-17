// Created by psv
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.scss';
import TodoPage from './pages/TodoPage';
import BoardPage from './pages/BoardPage';

function App() {
	return (
		// BrowserRouter: URL 기반 라우팅을 가능하게 해주는 최상위 컴포넌트
		<BrowserRouter>
			<div className="App">
				{/* 네비게이션 — button 대신 Link로 URL 이동 */}
				<nav className="nav_menu">
					<Link to="/todo">할 일 목록</Link>
					<Link to="/board">게시판</Link>
				</nav>

				{/* Routes: 현재 URL에 맞는 Route 하나만 렌더링 */}
				<main>
					<Routes>
						<Route path="/todo" element={<TodoPage />} />
						<Route path="/board" element={<BoardPage />} />
					</Routes>
				</main>
			</div>
		</BrowserRouter>
	);
}

export default App;
