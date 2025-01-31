import React, { useEffect, useRef } from 'react';
import Marzipano from 'marzipano'; 

const PanoramicViewer = ({ imageUrl }) => {
  const viewerRef = useRef(null);
  
  useEffect(() => {
    if (viewerRef.current) {
      const panoElement = viewerRef.current;
      var viewer = new Marzipano.Viewer(panoElement, { controls: { scrollZoom: false } });
      const source = Marzipano.ImageUrlSource.fromString(imageUrl);
      const geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);


      // Set a small pitch range to disable vertical movement without breaking the view
      const limiter = Marzipano.RectilinearView.limit.pitch(-0.300, 0.300);

      const view = new Marzipano.RectilinearView({ yaw: Math.PI, pitch: 0 }, limiter);
      const scene = viewer.createScene({
        source: source,
        geometry: geometry,
        view: view,
      });
      
      scene.switchTo();
    }
  }, [imageUrl]);

  return (
    <div id="pano" className="h-full w-full relative rounded-md" ref={viewerRef}></div>
  );
};

export default PanoramicViewer;
