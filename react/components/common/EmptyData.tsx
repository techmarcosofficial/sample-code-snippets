import React from 'react';
import Empty from '../../assets/images/empty-data.svg';

const EmptyData = (props: any) => {
  return (
    <div className="text-center">
      <img src={Empty} alt="Logo" className="img-fluid mx-auto" height="317" width={props.width} />
      <div className="text-muted">Sorry! No data to display.</div>
    </div>
  );
};

export default EmptyData;
