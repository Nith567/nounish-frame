import { ImageResponse } from 'next/og'
// App router includes @vercel/og.
// No need to install it.
export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)


  console.log("hai ",searchParams.get('text'))
  // console.log("sc ",searchParams.get('score'))
  const hasText = searchParams.has('text')
  const text = hasText ? searchParams.get('text') : ''
  let text2=text?.split('_')[0]
let score2=text?.split('_')[1]

  const hasScore = searchParams.has('score')
  const score = hasScore ? searchParams.get('score') : ''

  const imageData = await fetch(
    new URL('./Result.png', import.meta.url)
  ).then((res) => res.arrayBuffer())

  
  const fontData = await fetch(
    new URL('./LondrinaSolid-Regular.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          background: '#caf6c6',
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* @ts-ignore */}
        <img width="770" height="700" alt="meme" src={imageData}  />
        <p
          style={{
            position: 'absolute',
            margin:2,
            color: '#FFE8D3',
            bottom: '4%',
            lineHeight: "50px",
            fontSize: 42,
             left: "55%",
            textAlign: 'right',
            textTransform: 'uppercase'
          }}
        >
         score: {score2}/5
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Londrina Bold',
          data: fontData,
          style: 'normal',
        },
      ],
    }
  )
}
