/* eslint-disable */
// prettier-ignore
export const pagesPath = {
  my_complete_img: {
    $url: (url?: { hash?: string }) => ({ pathname: '/my-complete-img' as const, hash: url?.hash })
  },
  with_img_lazyload: {
    $url: (url?: { hash?: string }) => ({ pathname: '/with-img-lazyload' as const, hash: url?.hash })
  },
  with_intersection_lazyload: {
    $url: (url?: { hash?: string }) => ({ pathname: '/with-intersection-lazyload' as const, hash: url?.hash })
  },
  with_next_built_in_optimization: {
    $url: (url?: { hash?: string }) => ({ pathname: '/with-next-built-in-optimization' as const, hash: url?.hash })
  },
  with_next_optimized_images_plugin: {
    $url: (url?: { hash?: string }) => ({ pathname: '/with-next-optimized-images-plugin' as const, hash: url?.hash })
  },
  $url: (url?: { hash?: string }) => ({ pathname: '/' as const, hash: url?.hash })
}

// prettier-ignore
export type PagesPath = typeof pagesPath
