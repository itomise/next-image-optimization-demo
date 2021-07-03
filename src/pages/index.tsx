import { NextPage } from 'next'
import { css } from '@emotion/react'
import Head from 'next/head'
import Link from 'next/link'
import { pagesPath } from 'utils/$path'

const Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>Image Optimization / Lazy load Demo</title>
      </Head>

      <div css={wrap}>
        <h1>Image Optimization / Lazy load Demo</h1>
        <section>
          <h2>Image optimization</h2>
          <ul>
            {/* <li>
              <Link href={pagesPath.with_next_built_in_optimization.$url()}>
                <a>With nextjs built in image optimization</a>
              </Link>
            </li> */}
            <li>
              <Link href={pagesPath.with_next_optimized_images_plugin.$url()}>
                <a>With next-optimized-images plugin</a>
              </Link>
            </li>
          </ul>
        </section>
        <section>
          <h2>Image lazy load</h2>
          <ul>
            <li>
              <Link href={pagesPath.with_img_lazyload.$url()}>
                <a>With img loading attribute lazyload</a>
              </Link>
            </li>
            <li>
              <Link href={pagesPath.with_intersection_lazyload.$url()}>
                <a>With intersection observer lazyload</a>
              </Link>
            </li>
          </ul>
        </section>
        <section>
          <h2>My complete img component</h2>
          <ul>
            <li>
              <Link href={pagesPath.my_complete_img.$url()}>
                <a>temporary Result</a>
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </>
  )
}

const wrap = css`
  h1 {
    font-size: 30px;
    padding-top: 50px;
  }
  h2 {
    font-size: 20px;
  }
  section {
    padding-top: 20px;
  }
  ul {
    padding-top: 10px;
  }
  a {
    color: blue;
    text-decoration: underline;
    &:hover {
      opacity: 0.6;
    }
  }
`

export default Page
