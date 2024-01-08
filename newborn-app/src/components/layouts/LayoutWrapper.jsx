// LayoutWrapper.js
import React from 'react';
import ApplicationLayout from './ApplicationLayout';

const LayoutWrapper = (WrappedComponent) => {
  return (props) => (
    <ApplicationLayout>
      <WrappedComponent {...props} />
    </ApplicationLayout>
  );
};                              

export default LayoutWrapper;