import Image from "next/image";
import { siteConfig } from "../../site.config";

/**
 * Sunbird ABA Therapy logo — the client's real lockup (public/brand/):
 * line-drawn sunbird mark (teal-gradient body, rainbow head/beak) with the
 * rounded "Sunbird" wordmark and letterspaced "ABA THERAPY" subline.
 *
 * Rasterized from the supplied brand PDF; the intrinsic file is 1280×423
 * (aspect ≈ 3.03), rendered at 56px tall in the header (66px from lg up).
 *
 * "The bird's head is chopped off" (client, 9/2026): the artwork itself is
 * complete (verified against the source raster — the head/beak strokes end
 * in proper rounded caps), but at the old 50px height Next's 1x srcset
 * derivative was a 256px-wide palette-quantized PNG, which blurred the thin
 * rainbow head/beak strokes into a truncated-looking stub. Fix: render
 * larger, and declare a 400×132 intrinsic size + quality 90 so next/image
 * serves a ≥640px-wide derivative to every DPR — the head stays crisp.
 * Don't shrink these numbers without re-checking the bird's head at 1x DPR.
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
      width={400}
      height={132}
      quality={90}
      priority
      className={`h-[56px] w-auto lg:h-[66px] ${className}`}
    />
  );
}
