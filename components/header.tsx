import { stripHtmlTags } from "../utils";
import Head from "next/head";
import Company, { GoogleFont } from "../services/models/company";
import { bucketM } from "../services/urls";

interface HeaderProps {
  company: Company;
  title: string;
}

export const Header = ({ company, title }: HeaderProps) => {
  const getGoogleFonts = (body: GoogleFont, header: GoogleFont) => {
    let headerFont = (header?.name ?? 'Fira Sans').replace(' ', '+');
    let bodyFont = (body?.name ?? 'Fira Sans').replace(' ', '+');
    return <link href={`https://fonts.googleapis.com/css2?family=${headerFont}:wght@500;600;700&family=${bodyFont}`} rel="stylesheet"/>
  }

  const favicon = company.attributes.logo ? bucketM + company.attributes.logo : false;
  return (
    <Head>
      <title>{`${title} | ${company.attributes.name}`}</title>
      <meta property="og:title" content={`${title} | ${company.attributes.name}`} />
      {
        company.attributes.description &&
        <meta property="og:description" content={stripHtmlTags((company.attributes.description))} />
      }
      {
        company.attributes.primaryColor &&
        <>
          <meta name="msapplication-TileColor" content={company.attributes.primaryColor} />
          <meta name="theme-color" content={company.attributes.primaryColor} />
        </>
      }
      {
        favicon &&
        <>
          <link id="appIcon" rel="icon" type="image/png" href={favicon} />
          <meta name="msapplication-TileImage" content={favicon} />
        </>
      }
      {
        getGoogleFonts(company.careers?.style?.body?.font, company.careers?.style?.header?.font)
      }
    </Head>
  )
}


