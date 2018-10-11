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
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
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

  onButtonSubmit = () => {
    const {input} = this.state;
    this.setState({imageUrl: input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL, input)
      .then(response => {
        this.setState({box: this.calculateFaceLocation(response)});
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState({isSignedIn: false});
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  render() {
    const {isSignedIn, box, route, imageUrl} = this.state;
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
              <Rank/>
              <ImageLinkForm 
                onInputChange = {this.onInputChange} 
                onButtonSubmit = {this.onButtonSubmit}
              />
              <FaceRecognation 
                imageUrl = {imageUrl}
                box = {box}
              />
          </div>
          : ((route === 'signin' || route === 'signout')
            ? <Signin onRouteChange = {this.onRouteChange}/>
            : <Register onRouteChange = {this.onRouteChange}/>)
        }
      </div>
    );
  }
}

export default App;
