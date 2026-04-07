import React, { useState, useEffect } from 'react'; // 여기에 useState랑 useEffect를 추가!
import './App.scss';

function App() {
	// 백엔드 없으니까 일단 가짜 데이터!
	// const todoList = [
	// 	{ id: 1, text: '리액트랑 절친 되기', done: false },
	// 	{ id: 2, text: '퇴근하고 맛있는 거 먹기', done: false },
	// 	{ id: 3, text: '10분마다 체크 완료!', done: false },
	// ];

	// ✅ 일반 const 대신 useState를 사용해야 setTodoList를 쓸 수 있음! *주의*
	const [todoList, setTodoList] = useState([
		{ id: 1, text: '리액트랑 절친 되기', done: false },
		{ id: 2, text: '퇴근하고 맛있는 거 먹기', done: false },
		{ id: 3, text: '10분마다 체크 완료!', done: false },
	]);

	// 퇴근 시간 알림
	useEffect(() => {
		const checkTime = () => {
		const now = new Date();
		const mins = now.getMinutes();
		const hours = now.getHours();

		setTodoList((prevList) =>
			prevList.map((item) => {
				if (item.id === 2 && hours >= 17) return { ...item, done: true };
				if (item.id === 3 && mins % 10 === 0) return { ...item, done: true };
				return item;
			})
		);

		// ✅ 바로 여기야! 테스트용으로 16시 55분으로 설정!
		if (hours === 16 && mins === 55) {
			alert('55분이다! 이제 가방 싸자! 🎒');
		}

		// ✅ 5시 정각 알람 (17시 00분에 딱 뜨게!)
		if (hours === 17 && mins === 0) {
			alert('드디어 5시다!🏃‍♀️💨');
		}
	};

		const timer = setInterval(checkTime, 60000); // 1분마다 체크
		checkTime(); // 컴포넌트가 마운트될 때도 한 번 체크

		return () => clearInterval(timer); // 컴포넌트가 언마운트될 때 타이머 정리
	}, []);

	// return 안에는 JSX 문법으로 HTML-like한 코드를 작성
	return (
		<div className="todo-container">
			<h1 className="title">오늘 할 일 📝</h1>
			<ol className="todo-list">
				{todoList.map((item) => (
					<li key={item.id} className={item.done ? 'done' : ''}>
						{item.text}
					</li>
				))}
			</ol>

			<div className="input-box">
				<input type="text" placeholder="새로운 할 일을 입력해!" />
				<button className="add-btn">추가</button>
			</div>
		</div>
	);
}

export default App;