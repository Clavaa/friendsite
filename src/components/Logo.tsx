import Image from "next/image";
import { siteConfig } from "../../site.config";

/**
 * Sunbird ABA Therapy logo — the client's real lockup (public/brand/):
 * line-drawn sunbird mark (teal-gradient body, rainbow head/beak) with the
 * rounded "Sunbird" wordmark and letterspaced "ABA THERAPY" subline.
 *
 * Rasterized from the supplied brand PDF; the intrinsic file is 1280×423
 * (aspect ≈ 3.03), rendered at 50px tall in the header (58px from lg up)
 * per the client's "make the logo bigger" request.
 *
 * variant="reverse" uses the white-wordmark version (rainbow beak kept)
 * for dark teal surfaces.
 */
export default function Logo({
  variant = "default",
  className = "",
}: {
  variant?: "default" | "reverse";
  className?: string;
}) {
  const src =
    variant === "reverse"
      ? "/brand/sunbird-lockup-reverse@2x.png"
      : "/brand/sunbird-lockup@2x.png";
  return (
    <Image
      src={src}
      alt={siteConfig.brandName}
      width={176}
      height={58}
      priority
      className={`h-[50px] w-auto lg:h-[58px] ${className}`}
    />
  );
}
