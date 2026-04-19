import { useEffect, useRef, useState } from 'react';

export function useCountUp(target, duration = 1000) {
    const [count, setCount] = useState(0);
    const frameRef = useRef(null);

    useEffect(() => {
        let start = 0;
        const increment = target / (duration / 16);
        const step = () => {
            start += increment;
            if (start < target) {
                setCount(Math.floor(start));
                frameRef.current = requestAnimationFrame(step);
            } else {
                setCount(target);
            }
        };
        frameRef.current = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frameRef.current);
    }, [target, duration]);

    return count;
}
