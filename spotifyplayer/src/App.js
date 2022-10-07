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
      setTime((data?.item.duration_ms - data?.progress_ms))
    })
  }, time)
  
  return (
    <div className="flex h-screen justify-center items-center bg-slate-900">
      <div className="h-[60%] w-[40%] border-2 border-slate-600 rounded-md bg-slate-800">
        <div className="flex justify-center items-center m-16">
            <img src={songImage} width="250" className="rounded-lg"/>
        </div>
        <div name="artist-yawa"className="font-mono items-center flex justify-center">
          <div className="w-[80%] text-center">
            <div className='font-bold text-white justify-center align-middle'>
              {songName}
              <div className='inline-flex align-middle ml-2 text-red-400 hover:text-red-600'>
                <button>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 hover:fill-red-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className='mt-1 text-slate-500'>{artists}</div> 
          </div>

        </div>
        <div className="flex justify-center items-center m-5">
          <div className='w-[500px] border-[0.5px]'></div>
        </div>
        <div className='flex justify-center'>
          <div className="flex flex-wrap justify-between items-center w-[20rem] text-white text-2xl">
              <button className="hover:text-red-300">↺</button>
              <button className="hover:text-red-300">▶</button>
              <button className="hover:text-red-300">↻</button>
          </div>
        </div>
      </div>
    </div>
    );
}

function App() {
  let queries = qs.parse(window.location.search);
  let [access_token, setAccessToken] = useState('')
  let [refresh_token, setRefreshToken] = useState('')
  let [logged_in, setLoggedIn] = useState(false)

  const RenewToken = () => {
    let new_access_token = refreshToken()
    setAccessToken(new_access_token)
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
  return <Player AccessToken={access_token}/>;
}


export default App;