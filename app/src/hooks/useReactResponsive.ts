import { useMediaQuery } from 'react-responsive'

export const DESKTOP_MIN_WIDTH = 992
export const TABLET_MIN_WIDTH = 768
export const TABLET_MAX_WIDTH = 991
export const MOBILE_MAX_WIDTH = 767

export const useReactResponsive = () => {
  const isMobile = useMediaQuery({ maxWidth: MOBILE_MAX_WIDTH })
  const isDesktop = useMediaQuery({ minWidth: DESKTOP_MIN_WIDTH })
  const isTablet = useMediaQuery({
    minWidth: TABLET_MIN_WIDTH,
    maxWidth: TABLET_MAX_WIDTH
  })
  return {
    isDesktop,
    isTablet,
    isMobile
  }
}
