import { css } from '@emotion/react'
import { useIntersectionObserver } from 'hooks/useIntersectionObserver'
import { useRef } from 'react'
import cn from 'classnames'

const VALID_LOADING_VALUES = ['lazy', 'eager', undefined] as const
type LoadingValue = typeof VALID_LOADING_VALUES[number]

type ImgElementStyle = NonNullable<JSX.IntrinsicElements['img']['style']>

const VALID_LAYOUT_VALUES = ['fill', 'responsive', undefined] as const
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
  width,
  height,
  sizes,
  layout,
  className,
  objectFit,
  objectPosition,
  ...all
}: ImageProps): JSX.Element => {
  //TODO: fixedのときのテスト、loadingがfalseのときのテスト
  const rest: Partial<ImageProps> = all

  const widthInt = getInt(width)
  const heightInt = getInt(height)

  let sizerStyle: JSX.IntrinsicElements['div']['style'] | undefined

  const imgStyle: ImgElementStyle | undefined = {
    objectFit,
    objectPosition,
  }

  if (
    typeof widthInt !== 'undefined' &&
    typeof heightInt !== 'undefined' &&
    layout !== 'fill'
  ) {
    // default : <Image src="i.png" width="100" height="100" />
    const quotient = heightInt / widthInt
    const paddingTop = isNaN(quotient) ? '100%' : `${quotient * 100}%`
    sizerStyle = { display: 'block', boxSizing: 'border-box', paddingTop }
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const webp = require(`../../../public${src}?resize&format=webp`)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const img = require(`../../../public${src}?resize`)
  const ref = useRef<HTMLImageElement | null>(null)
  const entry = useIntersectionObserver(ref, {
    rootMargin: '200px',
    freezeOnceVisible: true,
  })
  const isVisible = !!entry?.isIntersecting
  let imgAttributes = {
    width,
    height,
    src:
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    srcSet: '',
  }
  let webpImgAttributes = {
    srcSet: '',
  }
  if (isVisible) {
    imgAttributes = {
      ...imgAttributes,
      src: img.src,
      srcSet: img.srcSet,
    }
    webpImgAttributes = {
      srcSet: webp.srcSet,
    }
  }

  return (
    <div
      css={style.wrap}
      className={cn({ responsive: layout !== 'fill', fill: layout === 'fill' })}
    >
      {sizerStyle && <div style={sizerStyle} />}
      <picture css={style.picture}>
        <source {...webpImgAttributes} type="image/webp" />
        <img
          // {...rest}
          {...imgAttributes}
          decoding="async"
          alt=""
          className={className}
          ref={ref}
          style={imgStyle}
          css={style.img}
        />
      </picture>
    </div>
  )
}

const style = {
  wrap: css`
    &.responsive {
      display: block;
      overflow: hidden;
      position: relative;
      box-sizing: border-box;
      margin: 0;
    }
    &.fill {
      display: block;
      overflow: hidden;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      box-sizing: border-box;
      margin: 0;
    }
  `,
  img: css`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    box-sizing: border-box;
    border: none;
    margin: auto;
    display: block;
    width: 0;
    height: 0;
    min-width: 100%;
    max-width: 100%;
    min-height: 100%;
    max-height: 100%;
  `,
  picture: css`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;

    box-sizing: border-box;
    padding: 0;
    border: none;
    margin: auto;

    display: block;
    width: 100%;
    height: 100%;
    min-width: 100%;
    max-width: 100%;
    min-height: 100%;
    max-height: 100%;
  `,
}

export { Image }
