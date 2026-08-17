import { motion, useReducedMotion } from "framer-motion";
import PropTypes from "prop-types";

const Card = ({
  children,
  className = "",
  delay = 0,
  variant = "light",
  glow = "primary",
  lift = true,
}) => {
  const prefersReduced = useReducedMotion();

  const variants = {
    light: "glass-light shadow-lg",
    dark: "glass-dark shadow-lg",
    image: "border border-transparent",
  };

  const glows = {
    primary: "hover:shadow-glow-primary",
    gold: "hover:shadow-glow-gold",
    accent: "hover:shadow-glow-accent",
    none: "",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={lift && !prefersReduced ? { y: -8 } : undefined}
      className={`card-lift rounded-2xl overflow-hidden ${variants[variant]} ${glows[glow]} ${className}`}
    >
      {children}
    </motion.div>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  delay: PropTypes.number,
  variant: PropTypes.oneOf(["light", "dark", "image"]),
  glow: PropTypes.oneOf(["primary", "gold", "accent", "none"]),
  lift: PropTypes.bool,
};

export default Card;
