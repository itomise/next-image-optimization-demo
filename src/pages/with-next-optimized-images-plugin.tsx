/* eslint-disable @typescript-eslint/no-var-requires */
import { NextPage } from 'next'
import { css } from '@emotion/react'
import Head from 'next/head'
import { imgList } from 'utils/imgList'
import { LinkToTop } from 'containers/organisms/LinkToTop'

const Image = ({ src }): JSX.Element => {
  const webp = require(`../../public${src}?resize&format=webp`)
  const img = require(`../../public${src}?resize`)

  return (
    <picture>
      <source srcSet={webp.srcSet} type="image/webp" />
      <img
        src={img.src}
        srcSet={img.srcSet}
        width="1920"
        height="1080"
        alt=""
      />
    </picture>
  )
}

const Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>With next-optimized-images plugin</title>
      </Head>

      <LinkToTop />
      <div css={wrap}>
        <ul>
          {imgList.map((url, index) => (
            <li key={index}>
              <Image src={url} />
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
  img {
    width: 100%;
    max-width: 100%;
  }
  li + li {
    padding-top: 100px;
  }
`

export default Page
