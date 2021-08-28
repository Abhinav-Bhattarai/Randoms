import React from "react";
import "../style.scss";

export const Video: React.FC<{ Reference: React.RefObject<HTMLVideoElement> }> =
  (props) => {
    const { Reference } = props;
    return (
      <React.Fragment>
        <div id="video-holder">
          <video
            id="video-player"
            width="100%"
            autoPlay
            playsInline
            height="100%"
            ref={Reference}
          ></video>
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
