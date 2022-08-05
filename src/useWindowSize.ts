import { useEffect, useLayoutEffect, useState } from "react";

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState([0, 0]);
  useLayoutEffect(() => {
    setWindowSize([window.innerWidth, window.innerHeight]);
  }, [setWindowSize]);
  useEffect(() => {
    const handleResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });
  return windowSize;
};

export default useWindowSize;
