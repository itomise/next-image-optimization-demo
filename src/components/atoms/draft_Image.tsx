/* eslint-disable @typescript-eslint/ban-ts-ignore */
import Head from 'next/head'
import { useIntersection } from 'lib/use-intersection'
import { toBase64 } from 'lib/to-base-64'

const VALID_LOADING_VALUES = ['lazy', 'eager', undefined] as const
type LoadingValue = typeof VALID_LOADING_VALUES[number]

type ImgElementStyle = NonNullable<JSX.IntrinsicElements['img']['style']>

const VALID_LAYOUT_VALUES = [
  'fill',
  'fixed',
  'intrinsic',
  'responsive',
  undefined,
] as const
type LayoutValue = typeof VALID_LAYOUT_VALUES[number]

export type ImageProps = Omit<
  JSX.IntrinsicElements['img'],
  'src' | 'srcSet' | 'ref' | 'width' | 'height' | 'loading' | 'style'
> & {
  priority?: boolean
  loading?: LoadingValue
  objectFit?: ImgElementStyle['objectFit']
  objectPosition?: ImgElementStyle['objectPosition']
} & (StringImageProps | ObjectImageProps)

type StringImageProps = {
  src: string
} & (
  | { width?: never; height?: never; layout: 'fill' }
  | {
      width: number | string
      height: number | string
      layout?: Exclude<LayoutValue, 'fill'>
    }
)

interface StaticImageData {
  src: string
  height: number
  width: number
  blurDataURL?: string
}

interface StaticRequire {
  default: StaticImageData
}

type StaticImport = StaticRequire | StaticImageData

type ObjectImageProps = {
  src: StaticImport
  width?: number | string
  height?: number | string
  layout?: LayoutValue
  // placeholder?: PlaceholderValue
  // blurDataURL?: never
}

type GenImgAttrsData = {
  src: string
  unoptimized: boolean
  layout: LayoutValue
  width?: number
  quality?: number
  sizes?: string
}

type GenImgAttrsResult = {
  src: string
  // srcSet: string | undefined
  // sizes: string | undefined
}

function generateImgAttrs({
  src,
  unoptimized,
  layout,
  width,
  quality,
  sizes,
}: GenImgAttrsData): GenImgAttrsResult {
  // if (unoptimized) {
  //   return { src, srcSet: undefined, sizes: undefined }
  // }

  // const { widths, kind } = getWidths(width, layout, sizes)
  // const last = widths.length - 1

  return {
    // srcSet: widths
    //   .map(
    //     (w, i) =>
    //       `${loader({ src, quality, width: w })} ${
    //         kind === 'w' ? w : i + 1
    //       }${kind}`,
    //   )
    //   .join(', '),

    src: require(`../../../public${src}`),
  }
}

function getInt(x: unknown): number | undefined {
  if (typeof x === 'number') {
    return x
  }
  if (typeof x === 'string') {
    return parseInt(x, 10)
  }
  return undefined
}

const Image = ({
  src,
  sizes,
  priority,
  loading,
  className,
  width,
  height,
  objectFit,
  objectPosition,
  ...all
}: ImageProps): JSX.Element => {
  const rest: Partial<ImageProps> = all
  let layout: NonNullable<LayoutValue> = sizes ? 'responsive' : 'intrinsic'
  if ('layout' in rest) {
    // Override default layout if the user specified one:
    if (rest.layout) layout = rest.layout

    // Remove property so it's not spread into image:
    delete rest['layout']
  }

  const widthInt = getInt(width)
  const heightInt = getInt(height)

  const isLazy =
    !priority && (loading === 'lazy' || typeof loading === 'undefined')

  const [setRef, isIntersected] = useIntersection<HTMLImageElement>({
    rootMargin: '200px',
    disabled: !isLazy,
  })
  const isVisible = !isLazy || isIntersected

  let wrapperStyle: JSX.IntrinsicElements['div']['style'] | undefined
  let sizerStyle: JSX.IntrinsicElements['div']['style'] | undefined
  let sizerSvg: string | undefined

  const imgStyle: ImgElementStyle | undefined = {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,

    boxSizing: 'border-box',
    padding: 0,
    border: 'none',
    margin: 'auto',

    display: 'block',
    width: 0,
    height: 0,
    minWidth: '100%',
    maxWidth: '100%',
    minHeight: '100%',
    maxHeight: '100%',

    objectFit,
    objectPosition,

    // ...(placeholder === 'blur'
    //   ? {
    //       filter: 'blur(20px)',
    //       backgroundSize: 'cover',
    //       backgroundImage: `url("${blurDataURL}")`,
    //     }
    //   : undefined),
  }
  if (
    typeof widthInt !== 'undefined' &&
    typeof heightInt !== 'undefined' &&
    layout !== 'fill'
  ) {
    // <Image src="i.png" width="100" height="100" />
    const quotient = heightInt / widthInt
    const paddingTop = isNaN(quotient) ? '100%' : `${quotient * 100}%`
    if (layout === 'responsive') {
      // <Image src="i.png" width="100" height="100" layout="responsive" />
      wrapperStyle = {
        display: 'block',
        overflow: 'hidden',
        position: 'relative',

        boxSizing: 'border-box',
        margin: 0,
      }
      sizerStyle = { display: 'block', boxSizing: 'border-box', paddingTop }
    } else if (layout === 'intrinsic') {
      // <Image src="i.png" width="100" height="100" layout="intrinsic" />
      wrapperStyle = {
        display: 'inline-block',
        maxWidth: '100%',
        overflow: 'hidden',
        position: 'relative',
        boxSizing: 'border-box',
        margin: 0,
      }
      sizerStyle = {
        boxSizing: 'border-box',
        display: 'block',
        maxWidth: '100%',
      }
      sizerSvg = `<svg width="${widthInt}" height="${heightInt}" xmlns="http://www.w3.org/2000/svg" version="1.1"/>`
    } else if (layout === 'fixed') {
      // <Image src="i.png" width="100" height="100" layout="fixed" />
      wrapperStyle = {
        overflow: 'hidden',
        boxSizing: 'border-box',
        display: 'inline-block',
        position: 'relative',
        width: widthInt,
        height: heightInt,
      }
    }
  } else if (
    typeof widthInt === 'undefined' &&
    typeof heightInt === 'undefined' &&
    layout === 'fill'
  ) {
    // <Image src="i.png" layout="fill" />
    wrapperStyle = {
      display: 'block',
      overflow: 'hidden',

      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,

      boxSizing: 'border-box',
      margin: 0,
    }
  } else {
    // <Image src="i.png" />
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        `Image with src "${src}" must use "width" and "height" properties or "layout='fill'" property.`,
      )
    }
  }

  let imgAttributes: GenImgAttrsResult = {
    src:
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    // srcSet: undefined,
    // sizes: undefined,
  }

  if (isVisible) {
    imgAttributes = {
      src: require(`../../../public${src}`),
    }
  }

  return (
    <div>
      {sizerStyle ? (
        <div style={sizerStyle}>
          {sizerSvg ? (
            <img
              style={{
                maxWidth: '100%',
                display: 'block',
                margin: 0,
                border: 'none',
                padding: 0,
              }}
              alt=""
              aria-hidden={true}
              role="presentation"
              src={`data:image/svg+xml;base64,${toBase64(sizerSvg)}`}
            />
          ) : null}
        </div>
      ) : null}
      <img
        {...rest}
        {...imgAttributes}
        decoding="async"
        className={className}
        ref={(element) => {
          setRef(element)
          // removePlaceholder(element, placeholder)
        }}
        style={imgStyle}
      />
      {priority ? (
        // Note how we omit the `href` attribute, as it would only be relevant
        // for browsers that do not support `imagesrcset`, and in those cases
        // it would likely cause the incorrect image to be preloaded.
        //
        // https://html.spec.whatwg.org/multipage/semantics.html#attr-link-imagesrcset
        <Head>
          <link
            key={'__nimg-' + imgAttributes.src}
            rel="preload"
            as="image"
            // href={imgAttributes.srcSet ? undefined : imgAttributes.src}
            // @ts-ignore: imagesrcset is not yet in the link element type
            imagesrcset={imgAttributes.srcSet}
            // @ts-ignore: imagesizes is not yet in the link element type
            imagesizes={imgAttributes.sizes}
          ></link>
        </Head>
      ) : null}
    </div>
  )
}

export { Image }
