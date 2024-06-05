import { ImageResponse } from 'next/og'
import { Londrina_Solid } from 'next/font/google'
const lol= Londrina_Solid({weight:"900",style:"normal",subsets:["latin"]})
import { Sansita_Swashed,Petrona } from "next/font/google";
const sasita = Sansita_Swashed ({ subsets: ["latin"] });
// App router includes @vercel/og.
// No need to install it.
export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const hasText = searchParams.has('text')
  const text = hasText ? searchParams.get('text') : ''

  const imageData = await fetch(
    new URL('./Color.png', import.meta.url)
  ).then((res) => res.arrayBuffer())
  
  const fontData = await fetch(
    new URL('./LondrinaSolid-Regular.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer())

if(text?.includes('already')){
  return  new ImageResponse(
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
        <img width="770" height="700" alt="noun" src={imageData}  />
                <p 
                  style={{
                    position: 'absolute',
                    margin:10,
                    color: '#FFE8D3',
                    top: '49%',
                    width: '530px',
                    lineHeight: 1.5,
                    fontSize: 54,
                    textAlign: 'center',
                    fontWeight:"bolder",
                    fontFamily: '"Londrina Bold"',
                  }}
                >
         {text}!
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
else if(text?.includes('Checkout')){
  return  new ImageResponse(
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
        <img width="770" height="700" alt="noun" src={imageData}  />
                <p 
                  style={{
                    position: 'absolute',
                    margin:10,
                    color: '#FFE8D3',
                    top: '49%',
                    width: '530px',
                    lineHeight: 1.5,
                    fontSize: 54,
                    textAlign: 'center',
                    fontWeight:"bolder",
                    fontFamily: '"Londrina Bold"',
                  }}
                >
         {text} !
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
else{
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
        <img width="770" height="700" alt="noun" src={imageData}  />


                <p 
                  style={{
                    position: 'absolute',
                    margin:10,
                    color: '#FFE8D3',
                    top: '49%',
                    width: '530px',
                    lineHeight: 1.5,
                    fontSize: 54,
                    textAlign: 'center',
                    fontWeight:"bolder",
                    fontFamily: '"Londrina Bold"',
                  }}
                >
        you've scored a {text}!
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
}
