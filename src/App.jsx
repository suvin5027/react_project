import React, { useState } from 'react';
import './App.scss';
import TodoPage from './pages/TodoPage';   // 방금 만든 파일 불러오기
import BoardPage from './pages/BoardPage'; // 게시판 파일 불러오기

function App() {
	const [currentPage, setCurrentPage] = useState('todo'); // 현재 페이지 상태

	return (
		<div className="App">
			{/* 네비게이션 메뉴 */}
			<nav className="nav-menu">
				<button type='button' onClick={() => setCurrentPage('todo')}>할 일 목록</button>
				<button type='button' onClick={() => setCurrentPage('board')}>게시판</button>
			</nav>

			{/* 상태에 따라 다른 페이지 보여주기 */}
			<main>
				{currentPage === 'todo' ? <TodoPage /> : <BoardPage />}
			</main>
		</div>
	);
}

export default App;