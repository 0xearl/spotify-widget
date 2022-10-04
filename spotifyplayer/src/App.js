import './App.css';
import {useEffect, useState} from 'react';
const qs = require('query-string');


function Login() {
  return(
    <div className="flex items-center justify-center h-screen">
          <a href="http://localhost:8888/login"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Login with spotify
          </a>
    </div>
  );
}


function Player(props) {
  let [artists, setArtists] = useState('')
  let [songName, setSongName] = useState('')
  let [songImage, setSongImage] = useState('')
  let [imageWidth, setImageWidth] = useState('')
  let [imageHeight, setImageHeight] = useState('')
  let [time, setTime] = useState(0)

  let access_token = props.AccessToken

  const getPlaying = (callback) => {
    fetch(`http://localhost:8888/playing?access_token=${access_token}`)
      .then(res => {
          return res.json().then(data => {
            callback(data);
          })
      }).catch(err => {
          console.log('error', err.toString())
      })
  }
  setTimeout(() => {
    getPlaying((data) => {
      setArtists(data.item.artists.map((artist) => {
        return artist.name
      }).join(', '))
      setSongName(data?.item.name)
      setSongImage(data?.item.album.images[0].url)
      setImageHeight(data.item.album.images[0].height)
      setImageWidth(data.item.album.images[0].width)
      setTime((data?.item.duration_ms - data?.progress_ms))
    })
  }, time)
  
  console.log('songName', songName)
  console.log('artists', artists)
  console.log('songImage', songImage)
  console.log('time remaining', time)
  return (
    <div className="flex h-screen justify-center items-center bg-slate-900">
      <div className="h-[80%] w-[50%] border-2 border-slate-600 rounded-md bg-slate-800 ">
        <div className="flex justify-center items-center m-16">
            <img src={songImage} width="250" className="rounded-lg"/>
        </div>
        <div name="artist-yawa"className="font-mono items-center flex justify-center">
          <div className="w-[80%] text-center">
            <div className='font-bold text-white'>{songName}</div>
            <div className='mt-1 text-slate-500'>{artists}</div> 
          </div>

        </div>
        <div className="flex justify-center items-center m-5">
          <div className='w-[500px] border-[0.5px]'></div>
        </div>
        <div className='flex justify-center'>
          <div className="flex flex-wrap justify-between items-center w-[20rem] text-white text-2xl">
              <button>↺</button>
              <button>▶</button>
              <button>↻</button>
          </div>
        </div>
      </div>
    </div>
      // <div className='relative flex h-full w-full flex-col justify-center overflow-hidden bg-gray-900'>
      //   <div className="divide-y overflow-hidden rounded-lg">
      //     <div className="h-full">
      //       <img src={songImage} width={imageWidth} height={imageHeight}/>
      //     </div>
      //     <div className="px-4 py-4 sm:px-6">
      //       {/* <div className="flex justify-center align-middle items-center mb-4">
      //         <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      //           <div className="bg-indigo-600 h-2.5 rounded-full" style={{width: '45%'}}></div>
      //         </div>
      //       </div> */}
      //       <div className="grid grid-rows-3 grid-flow-col gap-4 justify-center align-middle text-center h-24">
      //         <div className="row text-2xl font-mono font-medium text-white">{songName}</div>
      //         <div className="row text-sm font-mono text-gray-500">{artists}</div>
      //         <div className="row-span-3 col-span-1 ml-auto text-red-500">
      //           <button>
      //           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      //             <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      //           </svg>
      //           </button>
      //         </div>
      //       </div>
      //       <div className="flex justify-between align-middle text-white p-4 py-1 m-5">
      //         <div>
      //           <button alt="previous">
      //             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
      //               <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
      //             </svg>
      //           </button>
      //         </div>
      //       <div>
      //         <button alt="play" id="togglePlay">
      //           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
      //             <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
      //           </svg>
      //         </button>
      //       </div>
      //       <div>
      //         <button>
      //           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
      //             <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
      //           </svg>
      //         </button>
      //       </div>
      //     </div>
      //     </div>
      //   </div>
      // </div>
    );
}

function App() {
  let queries = qs.parse(window.location.search);
  let [access_token, setAccessToken] = useState('')
  let [refresh_token, setRefreshToken] = useState('')
  let [logged_in, setLoggedIn] = useState(false)

  const RenewToken = () => {
    useEffect(() => {
      let new_access_token = refreshToken()
      setRefreshToken(new_access_token)
    }, [])
  }
  const refreshToken = () => {
    fetch(`http://localhost:8888/refresh_token?refresh_token=${refresh_token}`)
      .then(res => {
        return res.json()
      }).then(data => {
        return data.access_token
      })
  }
  setTimeout(() => {
    RenewToken()
  }, 60 * 45 * 1000)

  useEffect(() => {
    if( queries.access_token == '' && queries.refresh_token == ''||
        queries.access_token == undefined && queries.refreshToken == undefined
    ) {
      setLoggedIn(false)
    } else {
      setAccessToken(queries.access_token)
      setRefreshToken(queries.refresh_token)
      setLoggedIn(true)
    }
  }, [])
  
  if(!logged_in) {
    return <Login/>;
  }
  return <Player AccessToken={access_token} setAccessToken={setAccessToken} RefreshToken={refresh_token} setRefreshToken={setRefreshToken}/>;
}

// class App extends React.Component 
// {
//   constructor(props) {
//     super(props)
//     let url = window.location.search;
//     this.queries = qs.parse(url)
//     this.state = {
//       access_token: '',
//       refresh_token: '',
//       logged_in: false,
//     }
//   }


//   render() {
//     return (
//       <div>Hello World</div>
//     )
//   }
// }


export default App;