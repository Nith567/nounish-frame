
/** @jsxImportSource frog/jsx */

import axios from 'axios';
import { Button, Frog, TextInput, parseEther } from 'frog'
import { handle } from 'frog/vercel'
import { neynar } from 'frog/hubs'
import { FrameRequest, getFrameHtmlResponse, getFrameMessage } from '@coinbase/onchainkit'
import { erc20Abi, parseUnits } from 'viem';
import { isHolderOfContracts } from '@/utils/query';
import { saved,checkPlayed, removePlayed,saveColor,checkColor } from '@/lib/save';
import redis from '@/lib/redis';
import { Calistoga } from 'next/font/google';

const app = new Frog({
  basePath: '/api',
  hub: neynar({ apiKey: process.env.NEYNAR_API_KEY as string}),
  verify:'silent',
})

let scores=0;
let currentQuestionIndex = 0;
const questions = [
  {
    question: 'What is the capital of France?',
    answer: 1,
    options: [
      'Paris',
      'London',
      'Berlin',
      'Madrid'
    ]
  },
  {
    question: 'Which planet is known as the Red Planet?',
    answer: 2,
    options: [
      'Earth',
      'Mars',
      'Jupiter',
      'Venus'
    ]
  },
  {
    question: 'What is the largest ocean on Earth?',
    answer: 3,
    options: [
      'Indian ',
      'Atlantic ',
      'Pacific ',
      'Arctic'
    ]
  },
  {
    question: 'Who wrote "Romeo and Juliet"?',
    answer: 4,
    options: [
      'Charles Dickens',
      'J.K. Rowling',
      'Mark Twain',
      'Shakespeare'
    ]
  },
  {
    question: 'What is the chemical symbol for water?',
    answer: 1,
    options: [
      'H2O',
      'CO2',
      'O2',
      'NaCl'
    ]
  }
];

const points_to_url = {
  1: "https://example.com/blue",
  2: "https://example.com/green",
  3: "https://example.com/yellow",
  4: "https://example.com/red",
  5: "https://example.com/black",
};

app.frame('/', async(c) => {
  return c.res({
    action: '/after1',
    image: `${process.env.NEXT_PUBLIC_SITE_URL}/Frame1.png`,
    imageAspectRatio:"1:1",
    headers:{
      'Content-Type': 'image/png'
    },
    intents: [
      <Button>Start</Button>,
      <Button.Link href='https://warpcast.com/~/channel/outpaint'>Follow outpaint⌁</Button.Link>
    ]
  })

})


app.frame('/after1',async(c) => {
     const address=c.frameData?.address;
    const { frameData,verified} = c;
  
    const { fid } = frameData || {}
    const body: FrameRequest = await c.req.json()
    const { isValid, message } = await getFrameMessage(body, {
      neynarApiKey: process.env.NEYNAR_API
    })



    if(verified){ //verfied checks if the user is verified through hub or use isValid from frameValidationResponse
      //@ts-ignore
      let colorPlayed=await checkColor(parseInt(fid))//tracks fid with color directly checkout to ecommerce if color is already played make sure to add your api endpoint
      
   if(colorPlayed){
    return c.res({
      action: `/done/${colorPlayed}`,
      image: `${process.env.NEXT_PUBLIC_SITE_URL}/Frame1.png`,//add convinient image here
      imageAspectRatio:"1:1",
      headers:{
        'Content-Type': 'image/png'
      },
      intents: [
        <Button>Already played: checkout</Button>,
      ]
    })

   }
    //@ts-ignore
     removePlayed(fid)//this is to remove player in db while testing it helps to reset the game again while deploying make sure to remove so that each fid play only one time

        const channelNeedToFollow = "outpaint";
        const baseUrlNeynarV2 = 'https://api.neynar.com/v2/farcaster';
        const responseChannel = await fetch(`${baseUrlNeynarV2}/channel?id=${channelNeedToFollow}&viewer_fid=${fid}`, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'api_key': process.env.NEYNAR_API_KEY || '',
          },
        });

        const channelData = (await responseChannel.json()).channel;
        const userFollowing = channelData.viewer_context.following;
        const neynarURL = `https://api.neynar.com/v2/farcaster/cast?identifier=${process.env.HASH}&type=hash`;
  //HASH='0x59c8ca215a8220611829cd96e9018ea2ba34e3cc' selected a random cast hash, after deploying make sure to change it to your own hash
      
        const neynarResponse = await fetch(neynarURL, {
       
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'api_key': process.env.NEYNAR_API_KEY || '',
          },
        });
    
        const data = await neynarResponse.json();
        const reactions = await data.cast.reactions;
        const hasRecasted = reactions.recasts.some(
          (recast: { fid: Number }) => recast.fid === message?.interactor.fid
        );

        if (!hasRecasted || !userFollowing) {
          return c.res({
            action: '/',
            image: `${process.env.NEXT_PUBLIC_SITE_URL}/Frame1.png`,
            imageAspectRatio:"1:1",
            headers:{
              'Content-Type': 'image/png'
            },
            intents: [
              <Button action='/after1'>Please Recast and Follow</Button>,
            ]
          })
        }  
else{

    return c.res({
      action: '/after3',
      image: `${process.env.NEXT_PUBLIC_SITE_URL}/Frame2.png`,
      imageAspectRatio:"1:1",
      headers:{
        'Content-Type': 'image/png'
      },
      intents: [
        <Button action='/after3'>START QUIZ</Button>,
      ]
    })
  }
}
else{
  return c.res({
    action: '/',
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
        Invalid User
      </div>
    ),
    intents: [<Button>Try Again 🔄</Button>],
  })
}
})


app.frame('/after3',async(c) => {

  const { frameData,verified } = c;
  const { fid } = frameData as unknown as { buttonIndex?: number; fid?: string };

  if(verified){
  //@ts-ignore
let hasPlayed=await checkPlayed(parseInt(fid))

  //@ts-ignore

  const plays = await redis.hgetall("played");

if(hasPlayed){
  const newSearchParams = new URLSearchParams({
    text: `You have already Played`,
  })
  return c.res({
    action: `/after4`,
    image: `${process.env.NEXT_PUBLIC_SITE_URL}/score/c?${newSearchParams}`,
    imageAspectRatio:"1:1",
    headers:{
      'Content-Type': 'image/png'
    },
    intents: [
      <Button value="1">Already Played</Button>
    ]
  })
}
else {
  scores=0;
    //@ts-ignore
    const newSearchParams = new URLSearchParams({
      text: questions[0].question + `_${scores}`,
      score: scores
    })
      return c.res({
        action: `/after4`,
        image: `${process.env.NEXT_PUBLIC_SITE_URL}/score/a?${newSearchParams}`,
        imageAspectRatio:"1:1",
        headers:{
          'Content-Type': 'image/png'
        },
        intents: [
          <Button value="1">{questions[0].options[0]}</Button>,
          <Button value="2">{questions[0].options[1]}</Button>,
          <Button value="3">{questions[0].options[2]}</Button>,
          <Button value="4">{questions[0].options[3]}</Button>
        ]
      })
    }
  }
  else{

    return c.res({
      action: '/after3',
      image: `${process.env.NEXT_PUBLIC_SITE_URL}/Frame2.png`,
      imageAspectRatio:"1:1",
      headers:{
        'Content-Type': 'image/png'
      },
      intents: [
        <Button action='/after3'>START QUIZ</Button>,
      ]
    })
  }
    })


app.frame('/after4',async(c) => {
    const {verified} = c;
    if(verified){
  const body: FrameRequest = await c.req.json()
  const { isValid, message } = await getFrameMessage(body, {
    neynarApiKey: process.env.NEYNAR_API
  })

    if(currentQuestionIndex >= questions.length){
    currentQuestionIndex=0;
    }
    let question = questions[currentQuestionIndex];

    let {buttonValue}=c
   
     //@ts-ignore
   if(buttonValue==question.answer){
    scores++;
    currentQuestionIndex++;
    console.log(scores);
    console.log("correct answer after with ", currentQuestionIndex);
   }
   else{
    currentQuestionIndex++;
    console.log(scores);
    console.log('wrong answer after with ', currentQuestionIndex);
   }

  
   if(currentQuestionIndex <questions.length){
        //@ts-ignore
        const newSearchParams = new URLSearchParams({
          text: questions[currentQuestionIndex].question + `_${scores}`,
          score: scores
        })
    return c.res({
      action: `/after4`,
      image: `${process.env.NEXT_PUBLIC_SITE_URL}/score/a?${newSearchParams}`,
      imageAspectRatio:"1:1",
      headers:{
        'Content-Type': 'image/png'
      },
      intents: [
        <Button value="1">{questions[currentQuestionIndex].options[0]}</Button>,
        <Button value="2">{questions[currentQuestionIndex].options[1]}</Button>,
        <Button value="3">{questions[currentQuestionIndex].options[2]}</Button>,
        <Button value="4">{questions[currentQuestionIndex].options[3]}</Button>
      ]
    })
}
const { frameData } = c;
const { fid } = frameData as unknown as { buttonIndex?: number; fid?: string };
const wallets = message?.interactor.verified_accounts;
//wallets?.push('0x214118a2AE1E01f4107B0c8751d5f397742fB23F') //Added dummy-address having noun NFT for demo

//@ts-ignore
const isHolder= await isHolderOfContracts(wallets, ['0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03', '0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B', '0x9C8216A60422dC117a0206611ED0A3E4925bFC17', '0xd9E49f550d0F605e3cCEE3167eC14ee7a9134DdB'])


if(currentQuestionIndex==questions.length && isHolder){

  if (fid !== undefined) {
    saved(parseInt(fid));
  }

  console.log(wallets);
     //@ts-ignore
      const newSearchParams = new URLSearchParams({
       score: scores
      })

       return c.res({
    image: `${process.env.NEXT_PUBLIC_SITE_URL}/score/d?${newSearchParams}`,
    imageAspectRatio:"1:1",
    headers:{
      'Content-Type': 'image/png'
    },
    intents: [
      <Button.Link href='https://opensea.io/collection/lil-nouns'>mint lilnoun</Button.Link>,
      <Button action='/color'>check your color</Button>,
      <Button action='/after3'>play again</Button>
    ]
  })
}

else{
  const { frameData } = c;
  const { fid } = frameData as unknown as { buttonIndex?: number; fid?: string };
  console.log('saving, ',fid);

  if (fid !== undefined) {
    saved(parseInt(fid));
  }
//@ts-ignore
  const newSearchParams = new URLSearchParams({
    text: 'score' + `_${scores}`,
    score: scores
  })

  return c.res({
    image: `${process.env.NEXT_PUBLIC_SITE_URL}/score/b?${newSearchParams}`,
    imageAspectRatio:"1:1",
    action:'/color',
    headers:{
      'Content-Type': 'image/png'
    },
    intents: [
      <Button.Link href='https://opensea.io/collection/lil-nouns'>mint lilnoun</Button.Link>,
    ]
  })
}

}
else{


  return c.res({
    action: '/after3',
    image: `${process.env.NEXT_PUBLIC_SITE_URL}/Frame2.png`,
    imageAspectRatio:"1:1",
    headers:{
      'Content-Type': 'image/png'
    },
    intents: [
      <Button action='/after3'>START QUIZ</Button>,
    ]
  })
}
}
)

app.frame('/color',async(c) => {
  const {verified,frameData} = c;
if(verified){


  //@ts-ignore
  let color = points_to_url[scores].split("/")[3];
  //@ts-ignore
  console.log('points ranger ', points_to_url[scores]);
  //@ts-ignore

  const fid = frameData?.fid;
  if (fid !== undefined) {
    saveColor(fid, color);
  } else {
    console.error('fid is undefined');
  }

  const newSearchParams = new URLSearchParams({
    text: `${color}`,
  });
    return c.res({
      action:`/done/${color}`,
      image: `${process.env.NEXT_PUBLIC_SITE_URL}/score/c?${newSearchParams}`,
      imageAspectRatio:"1:1",
      headers:{
        'Content-Type': 'image/png'
      },
      intents: [
       <Button.Link href='https://opensea.io/collection/lil-nouns'>mint any noun</Button.Link>,
       <Button>grab your {color}</Button>,
       <Button.Link href='https://warpcast.com/~/channel/outpaint'>Share</Button.Link>,
      ]
    })
  }
  else{

    return c.res({
      action: '/after3',
      image: `${process.env.NEXT_PUBLIC_SITE_URL}/Frame2.png`,
      imageAspectRatio:"1:1",
      headers:{
        'Content-Type': 'image/png'
      },
      intents: [
        <Button action='/after3'>START QUIZ</Button>,
      ]
    })
  }
})

app.frame('/done/:color', async(c) => {
//add necesary changes here to your custom logic, send the color to the end point
  const color= c.req.param('color')
  try {
    // const response = await axios.post('/ecom-end-point', {
    //     color
    // });

        setTimeout(() => {
            console.log('Points submitted successfully');
        }, 2000);
        const newSearchParams = new URLSearchParams({
          text: 'Checkout Ecommerce'

        })

    return c.res({
        image: `${process.env.NEXT_PUBLIC_SITE_URL}/score/c?${newSearchParams}`,
        imageAspectRatio:"1:1",
        headers:{
          'Content-Type': 'image/png'
        },
        intents: [
          <Button.Link href='https://warpcast.com/~/channel/outpaint'>checkOut:{} </Button.Link>
        ]
      })
} catch (error) {
//c.error({ message: "error " });
  return c.res({
    action: '/',
    image: `${process.env.NEXT_PUBLIC_SITE_URL}/Frame1.png`,//any add any error Image here
    imageAspectRatio:"1:1",
    headers:{
      'Content-Type': 'image/png'
    },
    intents: [
      <Button>Retry</Button>,
    ]
  })
}

})
export const GET = handle(app)
export const POST = handle(app)
