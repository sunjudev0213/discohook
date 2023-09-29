import Head from "next/head"
import { useRouter } from "next/router"
import React, { ReactNode } from "react"

const links = [
  {
    rel: "shortcut icon",
    href: "/favicon.ico",
    sizes: "16x16 32x32",
    type: "image/x-icon",
  },
  [16, 32].map(size => ({
    rel: "icon",
    href: `/static/favicon-${size}.png`,
    sizes: `${size}x${size}`,
    type: "image/png",
  })),
  {
    rel: "icon",
    href: "/static/favicon.svg",
    sizes: "any",
    type: "image/svg+xml",
  },
  [64, 96, 128, 192, 256].map(size => ({
    rel: "apple-touch-icon",
    href: `/static/icon-${size}.png`,
    sizes: `${size}x${size}`,
    type: "image/png",
  })),
  {
    rel: "apple-touch-icon",
    href: "/static/icon.svg",
    sizes: "any",
    type: "image/svg+xml",
  },
  {
    rel: "mask-icon",
    href: "/static/mask-icon.svg",
    type: "image/svg+xml",
  },
  {
    rel: "manifest",
    href: "/static/manifest.webmanifest",
  },
].flat()

export type PageHeadProps = {
  title: string
  description: string
  children?: ReactNode
}

export function PageHead(props: PageHeadProps) {
  const { title, description, children } = props

  const router = useRouter()

  return (
    <Head>
      <meta key="charset" charSet="UTF-8" />
      <meta
        key="viewport"
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      />
      <title key="title">
        {title === "Discohook" ? title : `${title} • Discohook`}
      </title>
      <meta key="description" name="description" content={description} />
      <meta key="og:title" property="og:title" content={title} />
      <meta key="og:type" property="og:type" content="website" />
      <meta key="og:image" property="og:image" content="/static/icon-256.png" />
      <meta
        key="og:url"
        property="og:url"
        content={`https://discohook.org${router.pathname}`}
      />
      <meta
        key="og:description"
        property="og:description"
        content={description}
      />
      <meta key="og:site_name" property="og:site_name" content="Discohook" />
      <link
        key="canonical"
        rel="canonical"
        href={`https://discohook.org${router.pathname}`}
      />
      {links.map(link => (
        <link key={`${link.rel}:${link.href}`} {...link} />
      ))}
      <meta
        key="application-name"
        name="application-name"
        content="Discohook"
      />
      <meta key="theme-color" name="theme-color" content="#58b9ff" />
      <meta key="color-scheme" name="color-scheme" content="dark light" />
      <meta key="google" name="google" content="notranslate" />
      {children}
    </Head>
  )
}
