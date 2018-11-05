import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation//Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognation from './components/FaceRecognation/FaceRecognation';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';
import 'tachyons';
import Clarifai from 'clarifai';

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '125',
    name: '',
    email: '',
    entries: 0,
    password: '',
    joined: ''
  }
};
const app = new Clarifai.App({
 apiKey: '27469a6f2bba40cd8f5abe881176b04d'
});

const particlesOptions = {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}
class App extends Component {
  constructor(){
    super();
    this.state = initialState;
  }
  
  loadUser = (_user) =>{
    this.setState({
      user: {
        id: _user.id,
        name: _user.name,
        email: _user.email,
        entries: _user.entries,
        password: _user.password,
        joined: _user.joined
      }
    });
  }
  calculateFaceLocation = (data) => {
    const clerifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('input_image');
    const imageWidth = Number(image.width);
    const imageHeight = Number(image.height);
    return {
      leftCol: clerifaiFace.left_col * imageWidth,
      topRow: clerifaiFace.top_row * imageHeight,
      rightCol: imageWidth - clerifaiFace.right_col * imageWidth,
      bottomRow: imageHeight - clerifaiFace.bottom_row * imageHeight
    }
  }
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onPictureSubmit = () => {
    const {input} = this.state;
    this.setState({imageUrl: input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL, input)
      .then(response => {
        if(response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => {
            if(response.status === 200) {
              return response.json();
            } else {
              throw new Error('ERROOOOOOOOOOOORRRRR');
            }
          }).then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}));
          })
          .catch(err => {
            console.log(err);
          })
        }
        this.setState({box: this.calculateFaceLocation(response)});
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  render() {
    const {isSignedIn, box, route, imageUrl, user} = this.state;
    return (
      <div className="App">
        <Particles className = 'particles'
          params={particlesOptions}
        />
        <Navigation 
          onRouteChange = {this.onRouteChange}
          isSignedIn = {isSignedIn}
          />
        {route === 'home' 
          ? <div>
              <Logo/>
              <Rank 
                name={this.state.user.name} 
                entries={this.state.user.entries}
              />
              <ImageLinkForm 
                onInputChange = {this.onInputChange} 
                onPictureSubmit = {this.onPictureSubmit}
              />
              <FaceRecognation 
                imageUrl = {imageUrl}
                box = {box}
              />
          </div>
          : ((route === 'signin' || route === 'signout')
            ? <Signin 
              onRouteChange = {this.onRouteChange}
              loadUser = {this.loadUser}
            />
            : <Register 
                onRouteChange = {this.onRouteChange}
                loadUser = {this.loadUser}
              />)
        }
      </div>
    );
  }
}

export default App;
