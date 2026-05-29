/* eslint-disable @next/next/no-img-element */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Markdown from "react-markdown";

const MEDIA_HEIGHT_DEFAULT = "h-48";
const MEDIA_HEIGHT_COMPACT = "h-32";

function ProjectImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return <div className={cn("w-full bg-muted", className)} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn("w-full object-cover", className)}
      onError={() => setImageError(true)}
    />
  );
}

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

interface Props {
  title: string;
  href?: string;
  description: string;
  dates: string;
  tags: readonly string[];
  link?: string;
  image?: string;
  video?: string;
  links?: readonly {
    icon: React.ReactNode;
    type: string;
    href: string;
  }[];
  /** Optional primary CTA (e.g. external live demo). */
  demo?: { label: string; href: string };
  /** Shorter card with scrollable body (portfolio grid). */
  compact?: boolean;
  className?: string;
}

export function ProjectCard({
  title,
  href,
  description,
  dates,
  tags,
  link,
  image,
  video,
  links,
  demo,
  compact = true,
  className,
}: Props) {
  const cardHref = href || "#";
  const cardExternal = href ? isExternalHref(cardHref) : false;
  const mediaHeight = compact ? MEDIA_HEIGHT_COMPACT : MEDIA_HEIGHT_DEFAULT;

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border transition-all duration-200 hover:ring-2 hover:ring-muted",
        compact ? "max-h-[380px] cursor-pointer" : "h-full",
        className
      )}
    >
      <div className="relative shrink-0">
        <Link
          href={cardHref}
          {...(cardExternal
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className="block"
        >
          {video ? (
            <video
              src={video}
              autoPlay
              loop
              muted
              playsInline
              className={cn("w-full object-cover", mediaHeight)}
            />
          ) : image ? (
            <ProjectImage src={image} alt={title} className={mediaHeight} />
          ) : (
            <div className={cn("w-full bg-muted", mediaHeight)} />
          )}
        </Link>
        {links && links.length > 0 && (
          <div className="absolute top-2 right-2 flex flex-wrap gap-2">
            {links.map((link, idx) => {
              const external = isExternalHref(link.href);
              return (
                <Link
                  href={link.href}
                  key={idx}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Badge
                    className="flex items-center gap-1.5 bg-primary text-xs text-primary-foreground hover:bg-primary/90"
                    variant="default"
                  >
                    {link.icon}
                    {link.type}
                  </Badge>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col",
          compact ? "p-4" : "gap-3 p-6"
        )}
      >
        <div className="flex shrink-0 items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold">{title}</h3>
            <time className="text-xs text-muted-foreground">{dates}</time>
          </div>
          <Link
            href={cardHref}
            {...(cardExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={`Open ${title}`}
          >
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div
          className={cn(
            compact &&
              "project-card-scroll flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain"
          )}
        >
          <div
            className={cn(
              "prose max-w-full text-pretty font-sans text-xs leading-relaxed text-muted-foreground dark:prose-invert",
              !compact && "flex-1"
            )}
          >
            <Markdown>{description}</Markdown>
          </div>
          {demo ? (
            <Button
              asChild
              className="w-full shrink-0"
              size="sm"
              variant="default"
            >
              <a href={demo.href} target="_blank" rel="noopener noreferrer">
                {demo.label}
              </a>
            </Button>
          ) : null}
          {tags && tags.length > 0 && (
            <div className={cn("flex flex-wrap gap-1", !compact && "mt-auto")}>
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  className="h-6 w-fit border border-border px-2 text-[11px] font-medium"
                  variant="outline"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
