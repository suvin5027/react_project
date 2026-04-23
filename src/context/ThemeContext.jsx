import { createContext, useContext, useState, useEffect } from 'react';

// 테마 상태를 전역으로 공유하기 위한 Context 생성
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
	// 저장된 테마가 있으면 그걸 쓰고, 없으면 시스템 설정(다크/라이트) 감지
	const [theme, setTheme] = useState(() => {
		const saved = localStorage.getItem('theme');
		if (saved) return saved;
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	});

	// 테마가 바뀔 때마다 html에 data-theme 속성을 업데이트하고 localStorage에 저장
	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
	}, [theme]);

	return (
		// theme(현재 테마)과 setTheme(테마 변경 함수)을 하위 컴포넌트에 제공
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

// 다른 컴포넌트에서 useTheme()로 간편하게 테마 값을 꺼내 쓸 수 있도록 export
export const useTheme = () => useContext(ThemeContext);
