import React from 'react';
import './ImageLinkForm.css'

const ImageLinkForm = ({onInputChange, onPictureSubmit}) => {
  return (
    <div>
      <div className='f3'>
        {'This Magic Brain will detect faces in you picture. Give it a try'}
        <div className = 'center'>
          <div className = 'pa4 br3 shadow-5 center form'>
            <input className = 'f4 pa2 w-70 center' type='text' onChange = {onInputChange}/>
            <button className = 'w-30 grow f4 link ph3 pv2 dib white bg-light-purple' onClick = {onPictureSubmit}>Detect</button> 
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageLinkForm;