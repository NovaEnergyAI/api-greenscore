import styles from '@components/typography/Typography.module.scss';
import { P } from '.';

export function FormHeading(props) {
  return <P className={styles.formHeading} {...props} />;
}

export function FormParagraph(props) {
  return <div className={styles.formCaption} {...props} />;
}

export function InputLabel(props) {
  return <label className={styles.inputLabel} {...props} />;
}
