import React from "react";
import { motion } from "framer-motion";
import styles from "./styles.module.scss";

const title = "SNEAKVERSE";

interface LoaderProps {
  onFinish?: () => void;
}

export default function Loader({ onFinish }: LoaderProps) {
  const [count, setCount] = React.useState(0);
  const [dimension, setDimension] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  React.useEffect(() => {
    const duration = 3000;
    const steps = 100;
    const intervalTime = duration / steps;

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev < 100) return prev + 1;
        clearInterval(interval);
        return 100;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (count === 100) {
      onFinish?.();
    }
  }, [count, onFinish]);

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height}  L0 0`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height}  L0 0`;

  const curve = {
    initial: {
      d: initialPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 },
    },
  };

  const slideUp = {
    initial: { top: 0 },
    exit: {
      top: "-100vh",
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 },
    },
  };
  
  const letterAnim = {
      initial: { y: 400 },
      animate: (i: number) => ({
          y: 0,
          transition: { duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.05 * i }
      }),
      exit: {
          y: -100,
          opacity: 0,
          transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] }
      }
  }

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      exit="exit"
      className={styles.introduction}
    >
      {dimension.width > 0 && (
        <>
            <div className={styles.textContainer}>
                <h1>
                    {title.split("").map((letter, i) => (
                        <motion.span
                            key={i}
                            custom={i}
                            variants={letterAnim}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            {letter}
                        </motion.span>
                    ))}
                </h1>
            </div>
            
            <motion.p className={styles.counter} exit={{ opacity: 0 }}>
                {count}%
            </motion.p>

          <svg>
            <motion.path
              variants={curve}
              initial="initial"
              exit="exit"
            ></motion.path>
          </svg>
        </>
      )}
    </motion.div>
  );
}