import React from 'react'

class Player extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            artists: '',
            songName: '',
            songImage: '',
            time: '',
            paused: false,
        }
    }

    componentDidUpdate() {
        setTimeout(() => {
            console.log('this is when the time gets 0')
            this.getPlaying((data) => {
                this.setState({
                    artists: data.item.artists.map((artist) => {
                        return artist.name
                    }).join(', '),
                    songName: data.item.name,
                    songImage: data.item.album.images[0].url,
                    time: (data.item.duration_ms - data.progress_ms)
                })
            })
        }, this.state.time)
    }
    
    componentDidMount() {
        //set the true initial state of things
        this.getPlaying((data) => {
            console.log('this is when i just got mounted')
            this.setState({
                artists: data.item.artists.map((artist) => {
                    return artist.name
                }).join(', '),
                songName: data.item.name,
                songImage: data.item.album.images[0].url,
                time: (data.item.duration_ms - data.progress_ms)
            })
        })
    }

    playPause() {
        if(!this.state.paused) {
            fetch(`http://localhost:8888/pause?access_token=${this.props.access_token}`)
                .then(res => {
                    console.log('this is when i click pause')
                }).catch(err => {
                    console.log('error', err)
                })
        }else {
            fetch(`http://localhost:8888/play?access_token=${this.props.access_token}`)
            .then(res => {
                console.log('this is when i click play')
            }).catch(err => {
                console.log('error', err)
            })
        }
        this.setState({
            paused: ! this.state.paused
        })
    }

    previous() {
        fetch(`http://localhost:8888/previous?access_token=${this.props.access_token}`)
            .then(res => {
                console.log('this is when i click previous')
                this.getPlaying((data) => {
                    this.setState({
                        artists: data.item.artists.map((artist) => {
                            return artist.name
                        }).join(', '),
                        songName: data.item.name,
                        songImage: data.item.album.images[0].url,
                        time: (data.item.duration_ms - data.progress_ms)
                    })
                })
            }).catch(err => {
                console.log('error', err)
            })
    }

    next() {
        fetch(`http://localhost:8888/next?access_token=${this.props.access_token}`)
            .then(res => {
                this.getPlaying((data) => {
                    console.log('this is when i click next')
                    this.setState({
                        artists: data.item.artists.map((artist) => {
                            return artist.name
                        }).join(', '),
                        songName: data.item.name,
                        songImage: data.item.album.images[0].url,
                        time: (data.item.duration_ms - data.progress_ms)
                    })
                })
            }).catch(err => {
                console.log('error', err)
            })
    }

    getPlaying(callback) {
        fetch(`http://localhost:8888/playing?access_token=${this.props.access_token}`)
            .then(res => {
                return res.json().then(data => {
                    callback(data);
                })
            }).catch(err => {
                console.log('error', err)
            })
    }

    render() {
        return (
            <div className="flex h-screen justify-center items-center bg-slate-900">
                <div className="h-[90%] w-[80%] border-2 border-slate-600 rounded-md bg-slate-800 mt-4">
                    <div className="flex justify-center items-center m-16">
                        <img src={this.state.songImage} width="250" className="rounded-lg" alt={this.state.songName}/>
                    </div>
                    <div name="artist-yawa" className="font-mono items-center flex justify-center">
                        <div className="w-[80%] text-center">
                            <div className='font-bold text-white justify-center align-middle'>
                                {this.state.songName}
                                {/* <div className='inline-flex align-middle ml-2 text-red-400 hover:text-red-600'>
                                    <button>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 hover:fill-red-600">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                        </svg>
                                    </button>
                                </div> */}
                            </div>
                            <div className='mt-1 text-slate-500'>{this.state.artists}</div>
                        </div>

                    </div>
                    <div className="flex justify-center items-center m-4">
                        <div className='w-[350px] border-[0.5px]'></div>
                    </div>
                    <div className='flex justify-center'>
                        <div className="flex flex-wrap justify-between items-center w-[15rem] text-white text-2xl mb-3">
                            <button onClick={() => { this.previous() }} className="hover:text-red-300">↺</button>
                            <button onClick={() => { this.playPause() }} className="hover:text-red-300">
                                {
                                !this.state.paused ? 
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                                    </svg>
                                    : '▶' 
                                }
                            </button>
                            <button onClick={() => { this.next() }} className="hover:text-red-300">↻</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Player;