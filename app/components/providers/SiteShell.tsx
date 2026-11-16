"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { MotionProvider } from "@/app/components/providers/MotionProvider";
import { TransitionProvider } from "@/app/components/transitions/TransitionContext";
import { RedoxDoor } from "@/app/components/transitions/RedoxDoor";
import { Preloader } from "@/app/components/preloader/Preloader";
import { FloatingTrigger } from "@/app/components/navigation/FloatingTrigger";
import { BackTrigger } from "@/app/components/navigation/BackTrigger";
import { MotionModeSync } from "@/app/components/shared/MotionToggle";
import { useSmoothScroll } from "@/app/hooks/useSmoothScroll";

/** Route prefixes owned by a design draft: app/(paper), app/(noir). */
const DRAFT_PREFIXES = ["/paper", "/noir"];

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
  // The redesign drafts bring their own chrome and use native scroll, so the
  // preloader, floating trigger, door and Lenis all stay out of their way.
  const pathname = usePathname();
  if (DRAFT_PREFIXES.some((prefix) => pathname === prefix || pathname?.startsWith(`${prefix}/`))) {
    return <>{children}</>;
  }

  return (
    <MotionProvider>
      <TransitionProvider>
        <MotionModeSync />
        <SmoothScroll />
        <Preloader />
        {children}
        <BackTrigger />
        <FloatingTrigger />
        <RedoxDoor />
      </TransitionProvider>
    </MotionProvider>
  );
}
