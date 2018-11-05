import React from 'react';

const Rank = ({name, entries}) => {
  return (
    <div>
      <div className = 'f3 white'>
        {`${name}, your currect rank is ...`}
      </div>
      <div className ='white f2'>
        {entries}
      </div>
    </div>
  )
}

export default Rank;