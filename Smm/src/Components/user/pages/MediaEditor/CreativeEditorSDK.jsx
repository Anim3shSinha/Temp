import React from 'react';


import CreativeEditorSDK from '@cesdk/cesdk-js';

import { useRef, useEffect } from 'react';

const Component = (props = {}) => {
  const cesdk_container = useRef(null);
  useEffect(() => {
    if (cesdk_container.current) {
        let cesdk;
      CreativeEditorSDK.init(cesdk_container.current, props.config).then(
        async (instance) => {
            instance.addDefaultAssetSources();
            instance.addDemoAssetSources();
        }
       
      );
    }
  }, [props, cesdk_container]);

  return (
    <div
      ref={cesdk_container}
      style={{ width: '100vw', height: '100vh' }}
    ></div>
  );
};

export default Component;