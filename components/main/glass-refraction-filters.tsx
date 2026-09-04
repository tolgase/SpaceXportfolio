// Hidden, sitewide SVG filter definitions used for real, live glass
// refraction — a feTurbulence + feDisplacementMap pair that actually bends
// the pixels underneath an element, applied via the native `filter` /
// `backdrop-filter` CSS properties. No JS library, no DOM-snapshotting: the
// browser's own compositor does this at 60fps for free.
//
// #glassRefraction: a stronger displacement meant for `filter` on a large
// background layer (e.g. the encryption section's video) so the footage
// itself reads as gently warped, like it's being viewed through water/glass.
//
// #glassCardRefraction: a gentler displacement tuned for `backdrop-filter`
// on `.liquid-glass` cards (see app/globals.css) — sampling a much smaller
// region than a full-bleed video, so it needs a smaller pixel scale to read
// as "glass" rather than noisy static.
export const GlassRefractionFilters = () => {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <filter id="glassRefraction" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.015"
          numOctaves={3}
          seed={7}
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale={15}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
      <filter id="glassCardRefraction" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.012 0.02"
          numOctaves={2}
          seed={3}
          result="noise"
        />
        <feGaussianBlur in="noise" stdDeviation={1.2} result="softNoise" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="softNoise"
          scale={42}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
};
