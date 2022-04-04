import styles from "./CrossfadingImages.module.css";
import { useState, useEffect } from "react";
import { classNames } from "pi-ui";
import { useTransition, animated } from "react-spring";
import { useMountEffect } from "hooks";

const CrossfadingImages = ({ images }) => {
  const [index, setIndex] = useState(0);
  const [imageItems, setImageItems] = useState();

  useEffect(() => {
    setImageItems(
      images.map((image, i) => ({
        image,
        active: i === index
      }))
    );
  }, [index, images]);

  useMountEffect(() => {
    const t = setInterval(
      () => setIndex((i) => (i >= images.length - 1 ? 0 : i + 1)),
      1500
    );
    return () => clearInterval(t);
  });

  const transitions = useTransition(imageItems, {
    initial: { position: "absolute", opacity: 0 },
    from: { position: "absolute", opacity: 0 },
    enter: ({ active }) => ({ opacity: active ? 1 : 0 }),
    leave: ({ active }) => ({ opacity: active ? 0 : 1 }),
    config: { mass: 5, tension: 500, friction: 100 },
    trail: 25,
    key: (item) => item
  });

  return (
    <div className={styles.imageContainer}>
      {transitions(({ opacity }, item) => (
        <animated.div
          key={item.image}
          style={{
            position: "absolute",
            opacity
          }}>
          <div className={classNames(styles.image, styles[item.image])} />
        </animated.div>
      ))}
    </div>
  );
};

CrossfadingImages.propTypes = {
  images: PropTypes.array.isRequired
};

export default CrossfadingImages;
