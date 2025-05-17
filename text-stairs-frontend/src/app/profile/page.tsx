'use client'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/context/auth-context'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { FC, FormEvent, useEffect, useState } from 'react'

interface ProfileData {
	email: string
	full_name: string
	status: string
	role: string
	page_per_book: number
	book_limit: number
}

const ProfilePage: FC = () => {
	const { user } = useAuth()
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')
	const [profileData, setProfileData] = useState<ProfileData | null>(null)

	useEffect(() => {
		if (!user) {
			router.push('/auth/sign-in')
			return
		}

		fetchProfile()
	}, [user])

	const fetchProfile = async () => {
		try {
			const accessToken =
				localStorage.getItem('auth_token') || Cookies.get('auth_token')
			const refreshToken =
				localStorage.getItem('refresh_token') || Cookies.get('refresh_token')

			if (!accessToken || !refreshToken) {
				throw new Error('No authentication tokens found')
			}

			const response = await fetch('http://localhost:3001/user/profile', {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			})

			if (response.status === 401) {
				// Token expired, try to refresh
				const refreshResponse = await fetch(
					'http://localhost:3001/auth/login/access-token',
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ refresh_token: refreshToken }),
					}
				)

				if (!refreshResponse.ok) {
					throw new Error('Failed to refresh token')
				}

				const data = await refreshResponse.json()

				// Store new tokens
				localStorage.setItem('auth_token', data.accessToken)
				if (data.refreshToken) {
					localStorage.setItem('refresh_token', data.refreshToken)
				}

				// Retry the profile request with new token
				const retryResponse = await fetch(
					'http://localhost:3001/user/profile',
					{
						headers: {
							Authorization: `Bearer ${data.accessToken}`,
							'Content-Type': 'application/json',
						},
					}
				)

				if (!retryResponse.ok) {
					throw new Error('Failed to fetch profile after token refresh')
				}

				const profileData = await retryResponse.json()
				setProfileData(profileData)
			} else if (!response.ok) {
				throw new Error('Failed to fetch profile')
			} else {
				const data = await response.json()
				setProfileData(data)
			}
		} catch (error) {
			console.error('Error fetching profile:', error)
			setError('Помилка при завантаженні профілю')
		}
	}

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setError('')
		setSuccess('')
		setIsLoading(true)

		const formData = new FormData(e.currentTarget)
		const data = {
			email: formData.get('email') as string,
			full_name: formData.get('full-name') as string,
			password: formData.get('password') as string,
		}

		try {
			const response = await fetch('http://localhost:3001/user/profile', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
				},
				body: JSON.stringify(data),
			})

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.message || 'Failed to update profile')
			}

			setSuccess('Профіль успішно оновлено')
			fetchProfile()
		} catch (error) {
			console.error('Error updating profile:', error)
			setError('Помилка при оновленні профілю')
		} finally {
			setIsLoading(false)
		}
	}

	if (!profileData) {
		return (
			<div className='container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)] py-12'>
				<div className='text-center'>Завантаження...</div>
			</div>
		)
	}

	return (
		<div className='container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)] py-12'>
			<Card className='w-full max-w-md'>
				<CardHeader className='space-y-1'>
					<CardTitle className='text-2xl font-bold'>Профіль</CardTitle>
					<CardDescription>
						Керуйте своїм обліковим записом та налаштуваннями
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className='space-y-4'>
						{error && (
							<div className='p-3 text-sm text-red-500 bg-red-50 rounded-md'>
								{error}
							</div>
						)}
						{success && (
							<div className='p-3 text-sm text-green-500 bg-green-50 rounded-md'>
								{success}
							</div>
						)}
						<div className='space-y-2'>
							<Label htmlFor='full-name'>Повне ім&apos;я</Label>
							<Input
								id='full-name'
								name='full-name'
								type='text'
								defaultValue={profileData.full_name}
								minLength={2}
								maxLength={100}
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='email'>Email</Label>
							<Input
								id='email'
								name='email'
								type='email'
								defaultValue={profileData.email}
								required
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='password'>Новий пароль</Label>
							<Input
								id='password'
								name='password'
								type='password'
								minLength={8}
							/>
							<p className='text-xs text-gray-500'>
								Залиште порожнім, якщо не хочете змінювати пароль
							</p>
						</div>
						<div className='space-y-2'>
							<Label>Статус</Label>
							<div className='p-2 bg-gray-50 rounded-md'>
								{profileData.status}
							</div>
						</div>
						<div className='space-y-2'>
							<Label>Роль</Label>
							<div className='p-2 bg-gray-50 rounded-md'>
								{profileData.role}
							</div>
						</div>
						<div className='space-y-2'>
							<Label>Ліміти</Label>
							<div className='grid grid-cols-2 gap-4'>
								<div className='p-2 bg-gray-50 rounded-md'>
									Сторінок на книгу: {profileData.page_per_book}
								</div>
								<div className='p-2 bg-gray-50 rounded-md'>
									Ліміт книг: {profileData.book_limit}
								</div>
							</div>
						</div>
						<Button
							type='submit'
							className='w-full bg-emerald-600 hover:bg-emerald-700'
							disabled={isLoading}
						>
							{isLoading ? 'Збереження...' : 'Зберегти зміни'}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}

export default ProfilePage
