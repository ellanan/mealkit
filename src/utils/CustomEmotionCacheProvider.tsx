// this file only exists to tell emotion to prepend the styles it generates
// otherwise tailwind's styles won't be able to override chakra's styles
// references https://emotion.sh/docs/cache-provider

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { prefixer } from 'stylis';

const myCache = createCache({
  key: 'mk',
  prepend: true,
  stylisPlugins: [
    // has to be included manually when customizing `stylisPlugins` if you want to have vendor prefixes added automatically
    // @ts-ignore typescript isn't recognizing this; don't know why
    prefixer,
  ],
});

export const CustomEmotionCacheProvider: React.FC = ({ children }) => (
  <CacheProvider value={myCache}>{children}</CacheProvider>
);
