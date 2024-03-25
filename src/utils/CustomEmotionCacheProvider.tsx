// this file only exists to tell emotion to prepend the styles it generates
// otherwise tailwind's styles won't be able to override chakra's styles
// references https://emotion.sh/docs/cache-provider

import type { ReactNode } from "react";

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { prefixer } from "stylis";

const myCache = createCache({
  key: "mk",
  prepend: true,
  stylisPlugins: [
    // has to be included manually when customizing `stylisPlugins` if you want to have vendor prefixes added automatically
    prefixer,
  ],
});

export const CustomEmotionCacheProvider = ({
  children,
}: {
  children: ReactNode;
}) => <CacheProvider value={myCache}>{children}</CacheProvider>;
