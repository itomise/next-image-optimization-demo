import { css } from '@emotion/react'
import Link from 'next/link'
import { pagesPath } from 'utils/$path'

const LinkToTop = (): JSX.Element => {
  return (
    <div css={style.wrap}>
      <Link href={pagesPath.$url()}>
        <a>Back to top</a>
      </Link>
    </div>
  )
}

const style = {
  wrap: css`
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    a {
      display: block;
      padding: 20px 40px;
      background-color: gray;
      color: white;
    }
  `,
}

export { LinkToTop }
