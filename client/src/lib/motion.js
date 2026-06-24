// Shared framer-motion presets used across all landing sections.

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export const fadeUpDelay = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
  },
});

export const staggerContainer = (stagger = 0.08) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger } },
});

export const viewportOnce = { once: true, margin: "0px 0px -60px 0px" };
