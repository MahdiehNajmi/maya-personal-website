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
const MEDIA_HEIGHT_ROW = "min-h-[200px] sm:min-h-[220px]";

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
      className={cn("h-full w-full object-cover", className)}
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
  /** stack = vertical card; row = horizontal media + content on sm+ */
  layout?: "stack" | "row";
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
  layout = "stack",
  className,
}: Props) {
  const cardHref = href || "#";
  const cardExternal = href ? isExternalHref(cardHref) : false;
  const isRow = layout === "row";
  const mediaHeight = isRow
    ? MEDIA_HEIGHT_ROW
    : compact
      ? MEDIA_HEIGHT_COMPACT
      : MEDIA_HEIGHT_DEFAULT;

  const mediaBlock = (
    <>
      {video ? (
        <video
          src={video}
          autoPlay
          loop
          muted
          playsInline
          className={cn(
            isRow ? "h-full min-h-[200px] w-full object-cover sm:min-h-[220px]" : "w-full object-cover",
            !isRow && mediaHeight,
          )}
        />
      ) : image ? (
        <ProjectImage
          src={image}
          alt={title}
          className={cn(isRow ? "h-full min-h-[200px] sm:min-h-[220px]" : mediaHeight)}
        />
      ) : (
        <div
          className={cn(
            "w-full bg-muted",
            isRow ? "min-h-[200px] sm:min-h-[220px]" : mediaHeight,
          )}
        />
      )}
    </>
  );

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border transition-all duration-200 hover:ring-2 hover:ring-muted",
        isRow ? "flex flex-col sm:flex-row" : "flex flex-col",
        compact && !isRow ? "max-h-[380px] cursor-pointer" : "",
        !compact && !isRow && "h-full",
        className,
      )}
    >
      <div
        className={cn(
          "relative shrink-0",
          isRow && "w-full sm:w-[40%] sm:max-w-[420px]",
        )}
      >
        <Link
          href={cardHref}
          {...(cardExternal
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className={cn("block", isRow && "h-full")}
        >
          {mediaBlock}
        </Link>
        {links && links.length > 0 && (
          <div className="absolute top-2 right-2 flex flex-wrap gap-2">
            {links.map((linkItem, idx) => {
              const external = isExternalHref(linkItem.href);
              return (
                <Link
                  href={linkItem.href}
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
                    {linkItem.icon}
                    {linkItem.type}
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
          compact && !isRow ? "p-4" : "gap-3 p-5 sm:p-6",
        )}
      >
        <div className="flex shrink-0 items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <h3 className={cn("font-semibold", isRow && "text-lg")}>{title}</h3>
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
            "flex flex-col gap-3",
            compact &&
              !isRow &&
              "project-card-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain",
          )}
        >
          <div
            className={cn(
              "prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert",
              isRow || !compact ? "text-sm" : "text-xs",
              !compact && !isRow && "flex-1",
            )}
          >
            <Markdown>{description}</Markdown>
          </div>
          {demo ? (
            <Button
              asChild
              className="w-full shrink-0 sm:w-auto"
              size="sm"
              variant="default"
            >
              <a href={demo.href} target="_blank" rel="noopener noreferrer">
                {demo.label}
              </a>
            </Button>
          ) : null}
          {tags && tags.length > 0 && (
            <div className={cn("flex flex-wrap gap-1.5", !compact && !isRow && "mt-auto")}>
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
