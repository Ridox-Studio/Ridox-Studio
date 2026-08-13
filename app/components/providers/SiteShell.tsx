"use client";

import type { ReactNode } from "react";
import { MotionProvider } from "@/app/components/providers/MotionProvider";
import { TransitionProvider } from "@/app/components/transitions/TransitionContext";
import { RedoxDoor } from "@/app/components/transitions/RedoxDoor";
import { Preloader } from "@/app/components/preloader/Preloader";
import { FloatingTrigger } from "@/app/components/navigation/FloatingTrigger";
import { MotionModeSync } from "@/app/components/shared/MotionToggle";
import { useSmoothScroll } from "@/app/hooks/useSmoothScroll";

function SmoothScroll() {
  useSmoothScroll();
  return null;
}

/**
 * The persistent chrome: smooth scroll, the preloader, the floating trigger,
 * and the Redox Door overlay. Mounted once in the root layout so the door
 * survives every route change (Section 7.6).
 */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      <TransitionProvider>
        <MotionModeSync />
        <SmoothScroll />
        <Preloader />
        {children}
        <FloatingTrigger />
        <RedoxDoor />
      </TransitionProvider>
    </MotionProvider>
  );
}
