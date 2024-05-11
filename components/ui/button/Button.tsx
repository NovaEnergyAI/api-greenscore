import { classNames } from '@root/common/utilities';

import buttonStyles from './Button.module.scss';

import ArrowRightSVG from '../../svgs/ArrowRightSVG';
import Loader from '@components/ui/loader/Loader';
import React from 'react';

export const enum ButtonStyleEnum {
  BLACK = 'black',
  SQUARE_BLACK = 'square-black',
  BORDER_BLACK = 'border-black',
  CIRCLE_BORDER_BLACK = 'circle-border-black',
  GREEN = 'green',
  LINK_GREEN = 'link-green',
  SQUARE_GREEN = 'square-green',
  ADD_SQUARE_GREEN = 'add-square-green',
}

function getButtonStyle(style, withArrow) {
  switch (style) {
    case ButtonStyleEnum.BLACK:
      return withArrow ? classNames(buttonStyles.buttonStyleBlackWithArrow, buttonStyles.button) : classNames(buttonStyles.buttonStyleBlack, buttonStyles.button);
    case ButtonStyleEnum.SQUARE_GREEN:
      return classNames(buttonStyles.buttonStyleGreen, buttonStyles.buttonSquare);
    case ButtonStyleEnum.ADD_SQUARE_GREEN:
      return classNames(buttonStyles.buttonAddStyleGreen, buttonStyles.buttonSquare);
    case ButtonStyleEnum.SQUARE_BLACK:
      return classNames(buttonStyles.buttonStyleBlack, buttonStyles.buttonSquare);
    case ButtonStyleEnum.BORDER_BLACK:
      return classNames(buttonStyles.buttonStyleBorderBlack, buttonStyles.buttonSquare);
    case ButtonStyleEnum.LINK_GREEN:
      return classNames(buttonStyles.buttonStyleLink, buttonStyles.buttonLinkGreen);
    case ButtonStyleEnum.CIRCLE_BORDER_BLACK:
      return classNames(buttonStyles.buttonCircleBorderBlack);
    default:
    case ButtonStyleEnum.GREEN:
      return withArrow ? classNames(buttonStyles.buttonStyleGreenWithArrow, buttonStyles.button) : classNames(buttonStyles.buttonStyleGreen, buttonStyles.button);
  }
}

export interface ButtonProps {
  children: any;
  className?: string;
  style?: ButtonStyleEnum;
  styles?: any;
  target?: any;
  type?: any;
  disabled?: boolean;
  withArrow?: boolean;
  loading?: boolean;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}

export default function Button({ children, className, disabled, style = ButtonStyleEnum.GREEN, styles, target, type, withArrow, loading, href, onClick }: ButtonProps) {
  if (loading) {
    return (
      <div className={buttonStyles.loader} style={styles}>
        <Loader />
      </div>
    );
  }

  const buttonClass = getButtonStyle(style, withArrow);
  const buttonContent = (
    <>
      <span className={withArrow ? buttonStyles.buttonText : ''} style={{ padding: '4px', textDecoration: 'none' }}>
        {children}
      </span>
      {withArrow && <ArrowRightSVG className={buttonStyles.arrowIcon} />}
    </>
  );

  if (href) {
    return (
      <a href={href} className={classNames(buttonStyles.root, buttonClass, className)} style={styles} target={target} onClick={onClick}>
        {buttonContent}
      </a>
    );
  }

  return (
    <button style={styles} type={type} disabled={disabled} className={classNames(buttonStyles.root, buttonClass, className)} onClick={onClick}>
      {buttonContent}
    </button>
  );
}
