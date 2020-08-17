import React from "react";
import { Progress } from "semantic-ui-react";

function ProgressBar({ uploadState, percentageUploaded }) {
  return (
    <div>
      {uploadState && percentageUploaded !== 100 ? (
        <Progress
          className="progress__bar"
          percent={percentageUploaded}
          progress
          indicating
          size="medium"
          inverted
        />
      ) : null}
    </div>
  );
}

export default ProgressBar;
{
  /* <Progress
      className="progress__bar"
      percent={percentageUploaded}
      progress
      indicating
      size="medium"
      inverted
    /> */
}
