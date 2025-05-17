'use client'

import Cookies from 'js-cookie'
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'

interface User {
	id: number
	email: string
	full_name: string
	status: string
	role: string
	page_per_book: number
	book_limit: number
}

interface AuthContextType {
	user: User | null
	signIn: (
		email: string,
		password: string,
		rememberMe: boolean
	) => Promise<void>
	signUp: (
		email: string,
		password: string,
		fullName: string,
		rememberMe: boolean
	) => Promise<void>
	signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null)

	useEffect(() => {
		checkAuth()
	}, [])

	const refreshAccessToken = async (refreshToken: string) => {
		try {
			const response = await fetch(`${API_URL}/auth/login/access-token`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ refresh_token: refreshToken }),
			})

			if (!response.ok) {
				throw new Error('Failed to refresh token')
			}

			const data = await response.json()
			return data
		} catch (error) {
			console.error('Token refresh error:', error)
			throw error
		}
	}

	const checkAuth = async () => {
		try {
			const accessToken =
				localStorage.getItem('auth_token') || Cookies.get('auth_token')
			const refreshToken =
				localStorage.getItem('refresh_token') || Cookies.get('refresh_token')

			if (!accessToken || !refreshToken) {
				setUser(null)
				return
			}

			try {
				// First try to verify the current access token
				const response = await fetch(`${API_URL}/user/profile`, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
						'Content-Type': 'application/json',
					},
				})

				if (response.ok) {
					const userData = await response.json()
					setUser(userData)
					return
				}
			} catch (error) {
				console.error('Profile fetch error:', error)
			}

			// If access token is invalid, try to refresh it
			const data = await refreshAccessToken(refreshToken)

			if (data.accessToken) {
				// Store new tokens
				localStorage.setItem('auth_token', data.accessToken)
				if (data.refreshToken) {
					localStorage.setItem('refresh_token', data.refreshToken)
				}

				// Set user data
				setUser({
					id: data.id,
					email: data.email,
					full_name: data.full_name,
					status: data.status,
					role: data.role,
					page_per_book: data.page_per_book,
					book_limit: data.book_limit,
				})
			} else {
				throw new Error('No access token in response')
			}
		} catch (error) {
			console.error('Auth check error:', error)
			localStorage.removeItem('auth_token')
			localStorage.removeItem('refresh_token')
			Cookies.remove('auth_token')
			Cookies.remove('refresh_token')
			setUser(null)
		}
	}

	const verifyUserState = async (accessToken: string) => {
		try {
			const response = await fetch(`${API_URL}/user/profile`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			})

			if (response.ok) {
				const userData = await response.json()
				setUser(userData)
				return true
			}
			return false
		} catch (error) {
			console.error('User verification error:', error)
			return false
		}
	}

	const signIn = async (
		email: string,
		password: string,
		rememberMe: boolean
	) => {
		try {
			const response = await fetch(`${API_URL}/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			})

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.message || 'Failed to sign in')
			}

			const data = await response.json()

			if (rememberMe) {
				// Store tokens in cookies for 30 days
				Cookies.set('auth_token', data.accessToken, { expires: 30 })
				if (data.refreshToken) {
					Cookies.set('refresh_token', data.refreshToken, { expires: 30 })
				}
			} else {
				// Store tokens in localStorage
				localStorage.setItem('auth_token', data.accessToken)
				if (data.refreshToken) {
					localStorage.setItem('refresh_token', data.refreshToken)
				}
			}

			// Set user data from the response
			setUser({
				id: data.id,
				email: data.email,
				full_name: data.full_name,
				status: data.status,
				role: data.role,
				page_per_book: data.page_per_book,
				book_limit: data.book_limit,
			})
		} catch (error) {
			console.error('Sign in error:', error)
			// Clean up tokens on error
			localStorage.removeItem('auth_token')
			localStorage.removeItem('refresh_token')
			Cookies.remove('auth_token')
			Cookies.remove('refresh_token')
			setUser(null)
			throw error
		}
	}

	const signUp = async (
		email: string,
		password: string,
		fullName: string,
		rememberMe: boolean
	) => {
		try {
			const response = await fetch(`${API_URL}/auth/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password, full_name: fullName }),
			})

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.message || 'Failed to sign up')
			}

			const data = await response.json()

			if (rememberMe) {
				// Store tokens in cookies for 30 days
				Cookies.set('auth_token', data.accessToken, { expires: 30 })
				if (data.refreshToken) {
					Cookies.set('refresh_token', data.refreshToken, { expires: 30 })
				}
			} else {
				// Store tokens in localStorage
				localStorage.setItem('auth_token', data.accessToken)
				if (data.refreshToken) {
					localStorage.setItem('refresh_token', data.refreshToken)
				}
			}

			// Set user data from the response
			setUser({
				id: data.id,
				email: data.email,
				full_name: data.full_name,
				status: data.status,
				role: data.role,
				page_per_book: data.page_per_book,
				book_limit: data.book_limit,
			})
		} catch (error) {
			console.error('Sign up error:', error)
			// Clean up tokens on error
			localStorage.removeItem('auth_token')
			localStorage.removeItem('refresh_token')
			Cookies.remove('auth_token')
			Cookies.remove('refresh_token')
			setUser(null)
			throw error
		}
	}

	const signOut = async () => {
		try {
			setUser(null)
			localStorage.removeItem('auth_token')
			localStorage.removeItem('refresh_token')
			Cookies.remove('auth_token')
			Cookies.remove('refresh_token')
		} catch (error) {
			console.error('Sign out error:', error)
			throw error
		}
	}

	return (
		<AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
