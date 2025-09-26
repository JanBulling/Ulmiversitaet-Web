import { Link } from "@/content/links/links";
import { ChevronRight, ExternalLink } from "lucide-react";
import NextLink from "next/link";

interface LinkCardProps {
  link: Link;
}

export default function LinkCard({ link }: LinkCardProps) {
  const type = link.type || "LINK";

  if (type === "LINK") {
    return (
      <li className="py-3">
        <NextLink
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-start justify-between gap-3"
          aria-label={`${link.label} (extern)`}
        >
          <div>
            <span className="font-medium underline-offset-4 group-hover:underline">
              {link.label}
            </span>
            {link.description && (
              <p className="text-muted-foreground mt-1 text-sm">
                {link.description}
              </p>
            )}
          </div>
          <ExternalLink className="size-4 text-muted-foreground mt-1 shrink-0" />
        </NextLink>

        {link.related && link.related.length > 0 && (
          <div className="mt-2 ml-6">
            <ul className="mt-1 list-disc pl-5">
              {link.related.map((relatedLink, idx) => {
                if (typeof relatedLink === "string") {
                  return (
                    <li key={idx} className="mt-1 text-sm">
                      {relatedLink}
                    </li>
                  );
                }

                return (
                  <li key={idx} className="mt-1 text-sm">
                    <NextLink
                      href={relatedLink.href}
                      className="underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {relatedLink.label}
                    </NextLink>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </li>
    );
  }

  if (type === "GUIDE") {
    return (
      <li className="py-3">
        <NextLink href={link.href} className="group flex items-center justify-between" aria-label={`${link.label} Anleitung`}>
          <span className="font-medium underline-offset-4 group-hover:underline">{link.label}</span>
          <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </NextLink>
      </li>
    );
  }

  if (type === "INTERNAL") {
    return (
      <li className="py-3">
        <NextLink href={link.href} className="group flex items-center justify-between" aria-label={link.label}>
          <span className="font-medium underline-offset-4 group-hover:underline">{link.label}</span>
          <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </NextLink>
      </li>
    );
  }
}
