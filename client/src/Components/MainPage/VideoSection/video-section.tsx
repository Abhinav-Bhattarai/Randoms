import React from "react";
import "../style.scss";

export const Video: React.FC<{
  Reference: React.RefObject<HTMLVideoElement>;
  muted: boolean;
}> = (props) => {
  const { Reference, muted } = props;

  return (
    <React.Fragment>
      <div id="video-holder">
        <video
          id="video-player"
          width="100%"
          autoPlay
          muted={muted}
          playsInline
          height="100%"
          ref={Reference}
          style={{borderRadius: '20px'}}
        />
      </div>
    </React.Fragment>
  );
};

const VideoSection: React.FC<{}> = ({ children }) => {
  return (
    <React.Fragment>
      <main id="video-section">{children}</main>
    </React.Fragment>
  );
};

export default VideoSection;
