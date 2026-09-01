import type { Metadata } from "next";
import { Container } from "@/app/components/shared/SectionHeader";
import { Logo } from "@/app/components/shared/Logo";
import { MagneticButton } from "@/app/components/shared/MagneticButton";
import { Footer } from "@/app/components/footer/Footer";

export const metadata: Metadata = {
  title: "Page not found",
  description: "That route does not exist on ridoxstudio.com.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="flex min-h-svh w-full flex-col justify-between">
      <Container className="grow items-center justify-center gap-8 py-32 text-center">
        <Logo size={72} />
        <p className="type-overline font-mono text-amber-400">Error 404</p>
        <h1 className="type-section font-display text-content-primary">
          No reaction at this address
        </h1>
        <p className="type-body max-w-md text-content-secondary">
          The route you followed does not exist. The work is still where you left it.
        </p>
        <MagneticButton href="/" label="Home">
          Back to the start
        </MagneticButton>
      </Container>
      <Footer />
    </main>
  );
}
