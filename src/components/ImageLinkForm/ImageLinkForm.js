import React from 'react';
import './ImageLinkForm.css'
import Camera from 'react-html5-camera-photo';

const ImageLinkForm = ({onInputChange, onPictureSubmit}) => {
  return (
    <div>
     
      <div className='f3'>
        
        <div className = 'center'>
          <div className = 'pa4 br3 shadow-5 center form'>
          {/* <Camera
          onTakePhoto = { (dataUri) => { this.onTakePhoto(dataUri); } }
        /> */}
            <input className = 'f4 pa2 w-70 center' type='file' onChange = {onInputChange}/>
            <button className = 'w-30 grow f4 link ph3 pv2 dib white bg-light-purple' onClick = {onPictureSubmit}>Detect</button>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageLinkForm;