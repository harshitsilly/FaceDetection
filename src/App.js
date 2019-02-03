import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation//Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognation from './components/FaceRecognation/FaceRecognation';
import Rank from './components/Rank/Rank';
import { css } from '@emotion/core';
import { ClipLoader } from 'react-spinners';
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
  loading: false,
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

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;
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
    this.setState({input: event.target});
  }

  onPictureSubmit = () => {
    const {input} = this.state;
    this.setState({imageUrl: input});
    const formData = new FormData();
    formData.append('file',input.files[0]);
    this.setState ({
      loading : true})
    fetch('/getLPBBImage', {
            method: 'post',
           
            body: formData
          })
          .then(response => {
            if(response.status === 200) {
              response.blob().then(images =>{
                let container = document.getElementById('img');
                // let imgElem = document.createElement('img');
                // container.appendChild(imgElem);
                let imgUrl = URL.createObjectURL(images)
                 console.log(imgUrl)
                 container.src = imgUrl;
                //  this.setState({box: outside});
                this.setState ({
                  loading : false})
              })
              
            } else {
              this.setState ({
                loading : false})
              throw new Error('ERROOOOOOOOOOOORRRRR');
            }
          }).catch((error)=>{
            throw new Error('ERROOOOOOOOOOOORRRRR');
          })
        
        
     
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
      <ClipLoader
          css={override}
          sizeUnit={"px"}
          size={150}
          color={'#123abc'}
          loading={this.state.loading}
        />
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
              <img   alt="No Image" id="img"/> 
              {/* <Rank 
                name={this.state.user.name} 
                entries={this.state.user.entries}
              /> */}
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
