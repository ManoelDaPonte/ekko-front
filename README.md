# Ekko - Audio Transcription Tool

Ekko is a web application that transforms audio and video files into accurate text transcriptions. It provides a simple, user-friendly interface for uploading files and getting high-quality transcriptions powered by OpenAI's Whisper model.

![Ekko Transcription Tool](/public/images/logo-removebg-preview.png)

## Features

-   **Audio & Video Transcription**: Upload and transcribe a wide variety of audio and video file formats
-   **Multi-language Support**: Transcribe content in English, French, and Spanish
-   **Export Options**: Download transcriptions in TXT or JSON formats
-   **Copy to Clipboard**: Easily copy transcriptions with a single click
-   **Responsive Design**: Works seamlessly across desktop and mobile devices

## Supported File Formats

### Audio

-   MP3, WAV, AAC, FLAC, OGG, WMA, AIFF, ALAC, MPEG

### Video

-   MP4, AVI, MOV, FLV, MKV, WEBM

## Getting Started

### Prerequisites

-   Node.js (version 14 or higher)
-   npm or yarn
-   An OpenAI API key for the Whisper model

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/ekko-transcription.git
    cd ekko-transcription
    ```

2. Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

3. Create a `.env.local` file in the root directory with your OpenAI API key:

    ```
    OPENAI_API_KEY=your_openai_api_key_here
    ```

4. Start the development server:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

-   `components/` - React components for the UI

    -   `body/` - Main application components
    -   `Button.jsx` - Reusable button component
    -   `Header.jsx` - Application header
    -   `Footer.jsx` - Application footer
    -   `Meta.jsx` - Head metadata component
    -   `LoadingSpinner.jsx` - Loading animation component

-   `pages/` - Next.js pages

    -   `api/transcribe.jsx` - API endpoint for file transcription
    -   `index.jsx` - Main application page

-   `styles/` - CSS modules for styling components

    -   `globals.css` - Global styles

-   `public/` - Static assets
    -   `images/` - Images including the logo

## How It Works

1. **Upload File**: Drop an audio or video file onto the upload area or click to select a file
2. **Select Language**: Choose the language of the audio content (English, French, or Spanish)
3. **Processing**: The file is processed through OpenAI's Whisper model
4. **Result**: The transcription appears in the text area below
5. **Export/Copy**: Download the transcription or copy it to your clipboard

## Technical Details

-   Built with **Next.js** for server-side rendering and API routes
-   Uses **OpenAI's Whisper** model for high-quality speech recognition
-   File processing with **FFmpeg** for audio extraction and format conversion
-   Styled with **CSS Modules** for component-scoped styling
-   File uploads handled with **Formidable**
-   Responsive UI built with **React**

## Deployment

This project is configured for deployment on Vercel with specific function configurations in `vercel.json`:

```json
{
	"version": 2,
	"functions": {
		"pages/api/transcribe.jsx": {
			"memory": 1024,
			"maxDuration": 60
		},
		"pages/api/*.jsx": {
			"memory": 512,
			"maxDuration": 30
		}
	}
}
```

## Limitations

-   Maximum file size: 25MB (OpenAI API limit)
-   Processing time depends on file length and server load
-   Internet connection required for API communication

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

-   OpenAI for the Whisper speech recognition model
-   Next.js team for the React framework
-   All open-source libraries used in this project
