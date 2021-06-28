import { NextPage } from 'next'
import { css } from '@emotion/react'
import Head from 'next/head'
import { imgList } from 'utils/imgList'
import { LinkToTop } from 'containers/organisms/LinkToTop'
import { useRef } from 'react'
import { useIntersectionObserver } from 'hooks/useIntersectionObserver'

const Image = ({ src, width, height }): JSX.Element => {
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
  }
  if (isVisible) {
    imgAttributes = {
      ...imgAttributes,
      src: src,
    }
  }
  return <img {...imgAttributes} alt="" decoding="async" ref={ref} />
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
    padding-top: 20px;
  }
  li + li {
    padding-top: 100px;
  }
`

export default Page
