import React from 'react'

export type IconProps = {
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  size?: number | string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

const Icon: React.FC<IconProps> = ({
  icon: IconComponent,
  size = 24,
  color = 'currentColor',
  className,
  style,
}) => {
  return (
    <IconComponent
      width={size}
      height={size}
      fill={color}
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    />
  )
}

export default Icon
