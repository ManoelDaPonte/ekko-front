import Image from 'next/image'
import Head from 'next/head';

export default function Home() {
  return (
    <>

      <body>
        <h1>Speech-To-Text App</h1>
          <h2>Quentin tu pues</h2>

        <form>
            <input type="file" id="audioFile" accept="audio/*"></input>
        </form>

      </body>


    </>
  )
}
