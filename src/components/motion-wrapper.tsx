"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function MotionWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.main
      key={pathname}
      className="flex-1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1, ease: [0, 0.7, 0.1, 1] }}
    >
      {children}
    </motion.main>
  );
}
