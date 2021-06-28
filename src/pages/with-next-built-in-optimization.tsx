import { NextPage } from 'next'
import { css } from '@emotion/react'
import Head from 'next/head'
import { imgList } from 'utils/imgList'
import Image from 'next/image'
import { LinkToTop } from 'containers/organisms/LinkToTop'

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
              <Image src={url} width={1920} height={1080} alt="" />
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
