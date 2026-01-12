import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  fill?: string;
  children?: ReactNode;
  style?: CSSProperties;
}

const Logo = ({ fill = "#ffffff", children, style: containerStyle, ...props }: LogoProps) => (
  <div
    style={{
      position: 'relative',
      width: 580,
      height: 460,
      ...containerStyle,
    }}
    {...props}
  >
      {/* Shape 1 */}
      <div
        style={{
          position: 'absolute',
          left: 160,
          top: 0,
          width: 420,
          height: 230,
          backgroundColor: fill,
          borderRadius: '76px 76px 76px 0px',
        }}
      >
      </div>
      {/* Shape 2 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 230,
          width: 390,
          height: 230,
          backgroundColor: fill,
          borderRadius: '76px 0px 76px 76px',
        }}
      >
      </div>
      {/* Negative Space 1 - Content container for empty region */}
      <div
        style={{
          position: 'absolute',
          left: 390,
          top: 230,
          width: 190,
          height: 230,
          // Transparent container for content in negative space
        }}
      >
      </div>
      {/* Negative Space 2 - Content container for empty region */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 160,
          height: 230,
          // Transparent container for content in negative space
        }}
      >
      </div>
      {/* Bridge 1 */}
      <svg
        style={{
          position: 'absolute',
          left: 390,
          top: 230,
          width: 76,
          height: 76,
          pointerEvents: 'none',
        }}
        viewBox="0 -76 76 76"
      >
        <path d="M 0 0 C 0 -56.696 13.68 -76 76 -76 H 0 Z" fill={fill} />
      </svg>
      <svg
        style={{
          position: 'absolute',
          left: 84,
          top: 154,
          width: 76,
          height: 76,
          pointerEvents: 'none',
        }}
        viewBox="-76 0 76 76"
      >
        <path d="M 0 0 C 0 56.696 -13.68 76 -76 76 H 0 Z" fill={fill} />
      </svg>
    {children}
  </div>
);

export default Logo;
