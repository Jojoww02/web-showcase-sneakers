import React from "react";
import { motion } from "framer-motion";
import styles from "./styles.module.scss";

const words = [
  "Hello",
  "Hola",
  "Bonjour",
  "Ciao",
  "こんにちは",
  "안녕하세요",
  "你好",
  "Olá",
  "Здравствуйте",
];

export default function Loader() {
  const [index, setIndex] = React.useState(0);
  const [dimension, setDimension] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight })
  }, [])
  
  React.useEffect(() => {
    if (index === words.length - 1) return;
    setTimeout(() => {
      setIndex(index + 1)
    }, index === 0 ? 1000 : 150)
  }, [index])

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height}  L0 0`
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height}  L0 0`

  const curve = {
    initial: { d: initialPath, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] } },
    exit: {
      d: targetPath,
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
        delay: 0.3,
      },
    },
  };

  const opacity = {
    initial: { opacity: 0 },
    enter: { opacity: 0.75, transition: { duration: 1, delay: 0.2 } },
    exit: { opacity: 0 },
  };

  const slideUp = {
    initial: {
      top: 0
    },
    exit: {
      top: "-100vh",
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as [number, number, number, number], delay: 0.2 }
    }
  }

  return (
    <motion.div
      variants={slideUp} initial="initial" exit="exit"
      className={styles.introduction}
    >
      {dimension.width > 0 && (
        <>
          <motion.p
            variants={opacity}
            initial="initial"
            animate="enter"
          >
            {words[index]}
          </motion.p>

          <svg
          >
            <motion.path
              variants={curve}
              initial="initial"
              animate="animate"
              exit="exit"
            ></motion.path>
          </svg>
        </>
      )}
    </motion.div>
  );
}