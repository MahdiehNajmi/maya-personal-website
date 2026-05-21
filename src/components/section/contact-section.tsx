import Link from "next/link";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { DATA } from "@/data/resume";
import { portfolioPath } from "@/lib/paths";

export default function ContactSection() {
  return (
    <div className="border rounded-xl p-10 relative">
      <div className="absolute inset-0 top-0 left-0 right-0 h-1/2 rounded-xl overflow-hidden">
        <FlickeringGrid
          className="h-full w-full"
          squareSize={2}
          gridGap={2}
          style={{
            maskImage: "linear-gradient(to bottom, black, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
          }}
        />
      </div>
      <div className="relative flex flex-col items-center gap-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
          Get in Touch
        </h2>
        <nav
          aria-label="Contact options"
          className="mx-auto flex w-full max-w-md flex-col gap-3 text-center"
        >
          <Link
            href={DATA.contact.social.LinkedIn.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base text-primary transition-colors hover:text-primary/85 hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md py-1"
          >
            Reach out on LinkedIn
          </Link>
          <Link
            href={portfolioPath("/lets-discuss")}
            className="text-base text-primary transition-colors hover:text-primary/85 hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md py-1"
          >
            Send a message
          </Link>
          {DATA.contact.email ? (
            <Link
              href={`mailto:${DATA.contact.email}`}
              className="text-base text-primary transition-colors hover:text-primary/85 hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md py-1"
            >
              Email
            </Link>
          ) : null}
        </nav>
      </div>
    </div>
  );
}

