import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
	const authToken = request.cookies.get('auth_token')?.value
	const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
	const isProfilePage = request.nextUrl.pathname.startsWith('/profile')
	const isChatPage = request.nextUrl.pathname.startsWith('/chat')

	// Если пользователь авторизован и пытается зайти на страницы auth
	if (authToken && isAuthPage) {
		return NextResponse.redirect(new URL('/profile', request.url))
	}

	// Если пользователь не авторизован и пытается зайти на защищенные страницы
	if (!authToken && (isProfilePage || isChatPage)) {
		return NextResponse.redirect(new URL('/auth/sign-in', request.url))
	}

	return NextResponse.next()
}

// Указываем, для каких путей должен срабатывать middleware
export const config = {
	matcher: ['/auth/:path*', '/profile/:path*', '/chat/:path*'],
}
