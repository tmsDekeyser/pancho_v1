import React from 'react';

const Genesis = ({ data }) => {
  return (
    <div>
      Initial badges: <br />
      {Object.keys(data).map((badgeName) => {
        return (
          <div key={badgeName}>
            {badgeName} | Address: {data[badgeName]}
            <br />
          </div>
        );
      })}
    </div>
  );
};

export default Genesis;
