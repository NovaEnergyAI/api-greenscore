'use client';

import React, { useRef } from 'react';

export default function LottieAnimation({ animationData, width, height, loop }: any) {
  const ref = useRef(null);

  React.useEffect(() => {
    import('@lottiefiles/lottie-player');
  });

  return (
    <lottie-player
      id="firstLottie"
      ref={ref}
      autoplay
      // controls
      loop={loop}
      mode="normal"
      src={animationData}
      style={{ width: width ?? '300px', height: height ?? '300px' }}
    ></lottie-player>
  );
}
