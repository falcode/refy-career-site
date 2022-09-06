import { faSeedling } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "next-i18next";
import Company from "../services/models/company";
import { Divider } from "./divider";

const AboutCompany = (companyInfo: Company) => {
  const { t } = useTranslation("common");

  return (
    <section id="about-company" className="py-10 background-color--grey--0">
      <div className="mobile-container px-3">
        <p className="font-big-title text-center desktop:font-big-title--40">{t('about.company', {company: companyInfo.attributes.name})}</p>
        <div className="font-subtitle text-center mt-2">{companyInfo.attributes.tagline}</div>
        <div className="font-prose py-3 mobile:text-center">{companyInfo.attributes.description}</div>
        <Divider/>
        <div className="flex-column py-4">
          <div className="flex flex-align-center">
            <FontAwesomeIcon icon={faSeedling} className="mr-3 icon-font"></FontAwesomeIcon>
            <div className="flex flex-align-center flex-justify-between full-width">
              <p className="font-multiline font--dark">{t('size')}</p>
              <div className="flex flex-align-center">
                <p className="font-multiline font--ellipsis ml-1">{t('about.workers', {count: companyInfo.attributes.size})}</p>
              </div>
            </div>
          </div>
        </div>
        <Divider/>
      </div>
    </section>
  )
}

export default AboutCompany;