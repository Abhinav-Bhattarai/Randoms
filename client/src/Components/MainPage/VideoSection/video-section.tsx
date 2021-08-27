import React from "react";
import '../style.scss';

export const Video = () => {
  return (
      <React.Fragment>
          <div id='video-holder'>
              
          </div>
      </React.Fragment>
  );
};

const VideoSection: React.FC<{}> = ({ children }) => {
  return (
    <React.Fragment>
      <main id="video-section">
        {children}
      </main>
    </React.Fragment>
  );
};

export default VideoSection;