import type { Config } from 'tailwindcss'

export default {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				'accent-color': '#4240DB',
				'second-color': '#282A36',
				'body-color': '#969FB0',
				'bg-color': 'rgb(218,228,253)',
				'card-gradient':
					'linear-gradient(145deg, rgba(218,228,253,1) 25%, rgba(244,247,255,1) 100%)',
				'main-bg': '#FFFFFF',
			},
		},
	},
	plugins: [],
} satisfies Config
