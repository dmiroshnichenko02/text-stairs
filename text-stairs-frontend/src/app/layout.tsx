import Layout from '@/components/layout/Layout'
import { AuthProvider } from '@/lib/context/auth-context'
import '@radix-ui/themes/styles.css'
import type { Metadata } from 'next'
import { Lato } from 'next/font/google'
import './globals.css'

const lato = Lato({
	weight: ['100', '300', '400', '700', '900'],
	variable: '--lato',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Text Stairs',
	description: 'AI solution for fast reading',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={`${lato.variable}`}>
				<AuthProvider>
					<Layout>{children}</Layout>
				</AuthProvider>
			</body>
		</html>
	)
}
