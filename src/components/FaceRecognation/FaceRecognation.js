import React from 'react';
import './FaceRecognation.css';
const FaceRecognation = ({imageUrl, box}) => {
  return (
    <div className='center pb5 pt2 ma'>
      <div className = 'absolute'>
        <img id = 'input_image' src={imageUrl} alt='' style = {{width:'500px', height: 'auto'}}/>
        <div className = 'boundingBox' style = {{left: box.leftCol, top:box.topRow, right: box.rightCol, bottom: box.bottomRow}}></div>
      </div>
    </div>
  )
}

export default FaceRecognation;