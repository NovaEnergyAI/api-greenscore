import styles from './Typography.module.scss';

export function H1(props) {
  return <h1 className={styles.h1} {...props} />;
}

export function H1Sub(props) {
  return <aside className={styles.h1sub} {...props} />;
}

export function H2(props) {
  return <h1 className={styles.h2} {...props} />;
}

export function H2Sub(props) {
  return <aside className={styles.h2sub} {...props} />;
}

export function H3(props) {
  return <h3 className={styles.h3} {...props} />;
}

export function p(props) {
  return <aside className={styles.p} {...props} />;
}

export function H4(props) {
  return <h4 className={styles.h4} {...props} />;
}

export function H4Sub(props) {
  return <aside className={styles.h4sub} {...props} />;
}

export function H5(props) {
  return <h5 className={styles.h5} {...props} />;
}

export function H5Sub(props) {
  return <aside className={styles.h5sub} {...props} />;
}

export function H6(props) {
  return <h6 className={styles.h6} {...props} />;
}

export function H6Sub(props) {
  return <aside className={styles.h6sub} {...props} />;
}

export function P(props) {
  if (props.href) {
    return <a {...props} className={styles.p} />;
  }

  return <p className={styles.p} {...props} />;
}

export function SubTitle(props) {
  return <p className={styles.subtitle} {...props} />;
}
