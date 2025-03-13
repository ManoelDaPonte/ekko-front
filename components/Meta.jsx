import Head from "next/head";

const Meta = ({ title, description }) => {
	return (
		<Head>
			<title>{title}</title>
			<meta name="description" content={description} />
			<meta
				name="viewport"
				content="width=device-width, initial-scale=1, maximum-scale=1"
			/>
			<meta charSet="utf-8" />

			{/* Favicon */}
			<link rel="icon" href="/favicon.ico" />

			{/* Open Graph / Facebook */}
			<meta property="og:type" content="website" />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:site_name" content="Ekko" />

			{/* Twitter */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />

			{/* Theme color for browser */}
			<meta name="theme-color" content="#192d3a" />
		</Head>
	);
};

Meta.defaultProps = {
	title: "Ekko | Audio Transcription Tool",
	description:
		"Transform your audio and video to text easily with Ekko transcription tool.",
};

export default Meta;
