import {
  useCallback,
  useEffect,
  useRef,
  useState,
  PropsWithChildren,
} from 'react';
import classNames from 'classnames';

export const MobileAppWrapper = (props: PropsWithChildren<{}>) => {
  const [isScrollingDown, setIsScrollingDown] = useState(false);

  const prevScrollRef = useRef(0);

  const handleScroll = useCallback(() => {
    const currentScroll = window.scrollY;
    setIsScrollingDown(
      prevScrollRef.current < currentScroll && currentScroll > 5
    );
    prevScrollRef.current = currentScroll;
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div
      className={classNames(
        'flex flex-col h-full',
        isScrollingDown && 'scrolling-down'
      )}
    >
      {props.children}
    </div>
  );
};
