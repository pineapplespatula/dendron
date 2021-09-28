/**
 * Namespace for SEO related site configurations.
 */
export type SEOConfig = {
  title?: string;
  description?: string;
  author?: string;
  twitter?: string;
  image?: string;
};

/**
 * Generate default {@link SEOConfig}
 * @returns SEOConfig
 */
export function genDefaultSEOConfig(): SEOConfig {
  return {
    title: "Dendron",
    description: "Personal Knowledge Space",
  };
}