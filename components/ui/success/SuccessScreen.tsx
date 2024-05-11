'use client';

import styles from '@components/SuccessScreen.module.scss';

import React from 'react';
import LottieAnimation from '../LottieAnimation';
import { P } from '../typography';

export default function SuccessScreen({ message }) {
  React.useEffect(() => {
    import('@lottiefiles/lottie-player');
  });

  const AnimationCheck = 'https://lottie.host/d01bd9c4-2700-41a3-9973-a0f2a2302ab6/I1LquQRpuy.json';

  return (
    <div className={styles.successScreen}>
      <LottieAnimation animationData={AnimationCheck} />
      {message && <P className={styles.message}>{message}</P>}
    </div>
  );
}
