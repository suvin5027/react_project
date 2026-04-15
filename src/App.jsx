import React, { useState, useEffect } from 'react'; // 여기에 useState랑 useEffect를 추가!
import './App.scss';

function App() {
	// 백엔드 없으니까 일단 가짜 데이터!
	// const todoList = [
	// 	{ id: 1, text: '리액트랑 절친 되기', done: false },
	// 	{ id: 2, text: '퇴근하고 맛있는 거 먹기', done: false },
	// 	{ id: 3, text: '10분마다 체크 완료!', done: false },
	// ];


	// 1. 상태(state) 정의 구역
	// ✅ 일반 const 대신 useState를 사용해야 setTodoList를 쓸 수 있음! *주의*
	// 1) 처음 시작할 때 창고에서 데이터 가져오기
	const [todoList, setTodoList] = useState(() => {
		const saveTodo = localStorage.getItem('myTodoList'); // 로컬스토리지에서 데이터 가져오기

		// 2) 가져온 데이터가 있으면 JSON.parse로 객체로 변환해서 초기값으로 사용, 없으면 빈 배열로 초기화
		return saveTodo ? JSON.parse(saveTodo) : [];
	});

	// 3) todoList(데이터)가 변경될 때마다 로컬스토리지에 저장하기
	useEffect(() => {
		localStorage.setItem('myTodoList', JSON.stringify(todoList)); // todoList를 문자열로 변환해서 저장
		console.log('로컬스토리지에 저장된 데이터:', JSON.stringify(todoList));
	}, [todoList]); // todoList가 변경될 때마다 이 함수 실행


	// 입력값을 저장할 state 추가
	const [inputValue, setInputValue] = useState('');

	// 수정 중인 할 일의 정보를 저장할 state 추가
	const [editingTodo, setEditingTodo] = useState(null); // 현재 수정 중인 객체 전체를 저장할 state 추가

	// 탭 상태 : 'ALL'(전체), 'TODO'(할 일), 'DONE'(완료)
	const [activeTab, setActiveTab] = useState('ALL');















	// 2. 기능(function) 정의 구역
	// 버튼을 눌렀을 때 실행될 함수
	const handleAddTodo = () => {
		if (inputValue.trim() === '') return; // 빈 문자열은 추가하지 않음

		const nextId = todoList.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1; // 기존 아이디 중 최대값 + 1로 새로운 ID 생성

		// 현재 날짜와 시간을 "YYYY-MM-DD HH:mm:ss" 형식
		const now = new Date();
		const dateString = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;


		const newTodo = {
			id: nextId,
			text: inputValue,
			done: false,
			createdAt: dateString, // 생성 날짜 추가
		};

		// 전개 연산자로 리스트 업데이트
		setTodoList([...todoList, newTodo]);
		console.log('새로운 할 일 추가:', newTodo);
		console.log('업데이트된 할 일 목록:', [...todoList, newTodo]);

		// 입력값 초기화
		setInputValue('');
	} // handleAddTodo 함수 끝

	// 특정 id를 가진 할 일을 목록에서 삭제하는 함수
	const handleDeleteTodo = (id) => {
		// filter를 사용해서 내가 클릭한 id가 아닌 것들만 골라내서 새로운 배열 생성
		const updateedList = todoList.filter((item) => item.id !== id);
		setTodoList(updateedList); // 업데이트된 배열로 상태 업데이트
		console.log(id + "번 할 일 삭제");
	}

	// 특정 id를 가진 할 일의 완료 상태를 토글하는 함수
	const handleToggleTodo = (id) => {
		const updatedList = todoList.map((item) => {
			if(item.id === id) {
				// 1. 아이디가 같은 녀석을 찾으면, 기존 내용을 복사하고 done 속성만 바꿔서 리턴
				return {...item, done: !item.done};
			}
			// 2. id가 다르면 그대로 리턴
			return item;
		})
		setTodoList(updatedList); // 업데이트된 배열로 상태 업데이트
		console.log(id + "번 할 일 완료 상태 토글");
	};

	// 수정 팝업 열 때 실행될 함수
	const openEditModal = (todo) => {
		setEditingTodo({...todo}); // 수정할 객체 전체를 상태에 저장
	};

	// 팝업 안에서 수정 완료 버튼을 눌렀을 때 실행될 함수
	const handleUpdateTodo = () => {
		if(editingTodo.text.trim() === "") return; // 빈 문자열은 업데이트하지 않음

		setTodoList(todoList.map(item => {
			return item.id === editingTodo.id ? editingTodo : item // 아이디가 같은 녀석을 찾으면, 수정된 객체로 바꿔치기
		}));
		setEditingTodo(null); // 수정 완료 후 팝업 닫기
		console.log(editingTodo.id + "번 할 일 수정 완료");
	};

















	//	3. 화면(render) 구역
	// return 안에는 JSX 문법으로 HTML-like한 코드를 작성
	const totalCount = todoList.length; // 총 할 일 개수
	const doneCount = todoList.filter(item => item?.done).length; // 완료된 할 일 개수
	const remainingCount = totalCount - doneCount; // 남은 할 일 개수

	// activeTab 상태에 따라 보여줄 할 일 목록 필터링
	const filteredList = todoList.filter((item) => {
												if(activeTab === "TODO") return !item.done; // 미완료만
												if(activeTab === "DONE") return item.done; // 완료만
												return true; // "ALL"일 때는 전부 다
											})
											.sort((a, b) => {
												// 탭이 '전체(ALL)' 일 때만 특별한 정렬 적용
												if(activeTab === "ALL") {
													// 1. 완료 상태가 다르면, 완료된 것(done: true)을 우선순위로!
													if(a.done !== b.done){
														return a.done ? -1 : 1; // a가 완료면 앞으로, b가 완료면 뒤로
													}
												}
												// 2. 완료 상태가 같으면 id 순(오름차순)으로 정렬
												return a.id - b.id;
											});

	return (
		<div className="todo-container">
			{/* 할 일 목록 통계 */}
			<h1 className="title">할 일 목록📝</h1>
			<div className='todo-stats'>
				<p><span>전체:</span> {totalCount}개</p>
				<p><span>완료:</span> {doneCount}개</p>
				<p><span>남은 할 일:</span> {remainingCount}개</p>
			</div>

			{/* 할 일 추가 입력창 */}
			<div className="input-box">
				<form onSubmit={(e) => {
					e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
					handleAddTodo(); // 엔터키로도 할 일 추가 가능하게!
				}}>
					<input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="새로운 할 일을 입력해!" />
					<button className="add-btn">추가</button>
				</form>
			</div>

			{/* 탭 메뉴 */}
			<div className='todo-tabs'>
				<button className={activeTab === 'ALL' ? '_on' : ''} onClick={() => setActiveTab('ALL')}>전체</button>
				<button className={activeTab === 'TODO' ? '_on' : ''} onClick={() => setActiveTab('TODO')}>할 일</button>
				<button className={activeTab === 'DONE' ? '_on' : ''} onClick={() => setActiveTab('DONE')}>완료</button>
			</div>

			{/* 할 일 목록 */}
			<ul className="todo-list">
				{/* 필터링된 할 일 목록을 렌더링 */}
				{filteredList.map((item) => {
					if(!item) return null; // item이 null이나 undefined인 경우 렌더링하지 않음
					return (
						<li key={item.id} className={item.done ? 'done' : ''}>
							<label>
								<input type="checkbox" checked={item.done} onChange={() => handleToggleTodo(item.id)} disabled={item.done} />
								<span>{item.text}</span>
							</label>

							{/* 삭제 버튼 추가! 클릭하면 handleDeleteTodo 함수 실행되도록! */}
							<button type='button' className='edit-btn' onClick={() => openEditModal(item)}>✏️</button>
							<button type='button' className='delete-btn' onClick={() => handleDeleteTodo(item.id)}>❌</button>

							{/* 날짜 표시 추가! (item.createdAt이 있을 때만 보여주도록 안전하게 작성) */}
							{item.createdAt && <span className='date-text'>{item.createdAt}</span>}
						</li>
					)}
				)}
			</ul>

			{/* 수정 팝업(모달) - editingTodo가 있을 때만 렌더링 */}
			{editingTodo && (
				<div className='modal-overlay'>
					<div className='modal-content'>
						<h2>할 일 수정</h2>
						{/* 팝업 안의 입력창 : 글자 입력 시 editingTodo 상태 업데이트 */}
						<input type='text' value={editingTodo.text} onChange={(e) => setEditingTodo({...editingTodo, text: e.target.value})} />
						{/* 팝업 안에서만 완료 상태 취소 가능! */}
						<label>
							<input type='checkbox' checked={editingTodo.done} onChange={(e) => setEditingTodo({...editingTodo, done: e.target.checked})} />
							완료 표시
						</label>
						<div className='modal-btn'>
							<button type='button' onClick={handleUpdateTodo}>수정</button>
							<button type='button'onClick={() => setEditingTodo(null)}>취소</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
} // App 컴포넌트 끝

export default App;