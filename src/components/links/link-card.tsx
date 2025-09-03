import { Link } from "@/content/links/links";
import { Button } from "@/ui/button";
import { ExternalLink } from "lucide-react";
import NextLink from "next/link";

interface LinkCardProps {
  link: Link;
}

export default function LinkCard({ link }: LinkCardProps) {
  const type = link.type || "LINK";

  if (type === "LINK") {
    return (
      <div className="bg-card border p-4">
        <NextLink href={link.href} target="_blank" rel="noopener noreferrer">
          <Button variant="default">
            {link.label}
            <ExternalLink />
          </Button>
        </NextLink>
        <p className="text-muted-foreground mt-1 text-sm">{link.description}</p>

        {link.related && link.related.length > 0 && (
          <div className="mt-2">
            <h4 className="text-sm font-semibold">Dazu nützlich:</h4>
            <ul>
              {link.related.map((relatedLink, idx) => {
                if (typeof relatedLink === "string") {
                  return (
                    <li key={idx} className="mt-1">
                      {relatedLink}
                    </li>
                  );
                }

                return (
                  <li key={idx} className="mt-1 ml-5 list-disc">
                    <NextLink
                      href={relatedLink.href}
                      className="text-sm underline"
                    >
                      {relatedLink.label}
                    </NextLink>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    );
  }

  if (type === "GUIDE") {
    return (
      <div>
        <NextLink href={link.href}>
          <Button variant="secondary">{link.label}</Button>
        </NextLink>
      </div>
    );
  }

  if (type === "INTERNAL") {
    return (
      <div>
        <NextLink href={link.href}>
          <Button variant="secondary">{link.label}</Button>
        </NextLink>
      </div>
    );
  }
}
