import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [currentUser, setCurrentUser] = useState(() => {
		const saved = localStorage.getItem('currentUser');
		return saved ? JSON.parse(saved) : null;
	});

	const login = (user) => {
		setCurrentUser(user);
		localStorage.setItem('currentUser', JSON.stringify(user));
	};

	const logout = () => {
		setCurrentUser(null);
		localStorage.removeItem('currentUser');
	};

	return (
		<AuthContext.Provider value={{ currentUser, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
