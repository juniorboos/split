import { CSSProps } from '@/styles/stitches/stitches.config';

import StyledDots from './styles';

type Props = CSSProps & {
  size?: 8 | 4 | 10 | 15 | 50 | 80 | 100;
  color?: 'primary800' | 'primary200' | 'white';
};

const Dots = ({ css, size, color, ...props }: Props) => (
  <StyledDots {...props} color={color} css={css} size={size}>
    <span />
    <span />
    <span />
  </StyledDots>
);

Dots.defaultProps = {
  size: 15,
  color: 'primary800',
};

export default Dots;
