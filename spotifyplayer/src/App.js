import './App.css';
import React from 'react';
import Player from './Player';

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

class App extends React.Component
{
  constructor(props) {
    super(props)
    this.state = {
      access_token: '',
      refresh_token: '',
      logged_in: false,
      queries: qs.parse(window.location.search)
    }
  }

  componentDidUpdate() {
    setInterval(() => {
      console.log('refreshing access_token')
      this.renewToken((data) => {
        this.setState({
          access_token: data
        })
      })
    }, 60 * 45 * 1000)
  }

  componentDidMount() {
    if(
      this.state.queries.access_token == '' && this.state.queries.refresh_token == '' ||
      this.state.queries.access_token == undefined && this.state.queries.refresh_token == undefined
    ) {
      console.log('you\'re not logged in')
    } else {
      this.setState({
        access_token: this.state.queries.access_token,
        refresh_token: this.state.queries.refresh_token,
        logged_in: true
      })
    }
  }

  renewToken(callback) {
    fetch(`http://localhost:8888/refresh_token?refresh_token=${this.state.refresh_token}`)
        .then(res => {
            return res.json()
        }).then(data => {
            callback(data.access_token)
        })
  }
  
  render() {
    if(this.state.logged_in) {
      return <Player access_token={this.state.access_token}/>
    }
    return <Login/>
  }
}

export default App;