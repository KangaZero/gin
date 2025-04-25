"use client";
import { motion, MotionProps } from "framer-motion";
import React from "react";

interface MotionDivProps extends MotionProps {
  className?: string;
  children: React.ReactNode;
}

const MotionDiv: React.FC<MotionDivProps> = ({ children, ...props }) => (
  <motion.div {...props}>{children}</motion.div>
);

export default MotionDiv;
