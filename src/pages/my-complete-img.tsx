import { NextPage } from 'next'
import { css } from '@emotion/react'
import Head from 'next/head'
import { imgList } from 'utils/imgList'
import { LinkToTop } from 'containers/organisms/LinkToTop'
import { useRef } from 'react'
import { useIntersectionObserver } from 'hooks/useIntersectionObserver'
import { Image } from 'components/atoms/Image'

const MinimumImage = ({ src, width, height }): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const webp = require(`../../public${src}?resize&format=webp`)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const img = require(`../../public${src}?resize`)
  const ref = useRef<HTMLDivElement | null>(null)
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
    <div ref={ref}>
      <picture>
        <source {...webpImgAttributes} type="image/webp" />
        <img {...imgAttributes} decoding="async" alt="" />
      </picture>
    </div>
  )
}

const Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>With img loading lazy</title>
      </Head>

      <LinkToTop />
      <div css={wrap}>
        <ul>
          {imgList.map((url, index) => (
            <li key={index}>
              <Image src={url} width="1920" height="1080" />
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

const wrap = css`
  ul {
    padding: 20px 0;
  }
  li + li {
    padding-top: 100px;
  }
`

export default Page
