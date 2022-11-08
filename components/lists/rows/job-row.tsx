import { faHouseLaptop, faMapMarkerAlt, faScreenUsers, faSuitcase, IconDefinition } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import intervalPlural from "i18next-intervalplural-postprocessor";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useEffect, useState } from "react";
import Job from "../../../services/models/job";
import { ButtonBasic } from "../../buttons";
import i18next from 'i18next';

export const JobRow = (job: Job) => {
  const { t } = useTranslation("common");
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    i18next.use(intervalPlural).init(_ => setLoading(false));
  }, []);
  return (
    <>
      <div className="mobile:hidden desktop:flex flex-row h-12 w-full br-var box-shadow-container--card background-color--grey--0">
        <div className="flex items-center w-6/12 pl-5">
          <p className="font-title font--ellipsis">{job.attributes.title}</p>
        </div>

        <div className="flex items-center justify-center w-2/12 pl-5">
          {
            job.overview?.department?.name &&
            <>
              <RowIcon {...faSuitcase} />
              <p className="font-subtitle font--ellipsis">{job.overview?.department.name}</p>
            </>
          }

        </div>
        <div className="flex items-center justify-center w-2/12">
          {
            job.overview?.workplaces[0]?.areaName &&
            <>
              <RowIcon {...faMapMarkerAlt} />
              <p className="font-subtitle font--ellipsis">{job.overview?.workplaces[0]?.areaName}</p>
            </>
          }
        </div>
        <div className="flex items-center justify-end w-2/12 pr-5 ">
          <Link href={{ pathname: '/jobs/' + job.id }}>
            <ButtonBasic>{t('job.apply.button.short')}</ButtonBasic>
          </Link>
        </div>
      </div>

      <Link className="desktop:hidden cursor-pointer flex flex-col w-full br-var px-3 py-1 box-shadow-container--card background-color--grey--0" href={{ pathname: '/jobs/' + job.id }}>
        {
          job.overview?.workplaces[0]?.areaName &&
          <div className="flex items-center h-4">
            <RowIcon {...faMapMarkerAlt} />
            <p className="font-subtitle font--ellipsis">{job.overview.workplaces[0].areaName}</p>
          </div>
        }
        <p className="font-title font--ellipsis">{job.attributes?.title}</p>
        <div className="flex" >
          {
            job.overview?.department?.name &&
            <div className="flex items-center h-4 border-r pr-2 mr-2">
              <RowIcon {...faScreenUsers} />
              <p className="font-subtitle font--ellipsis">{job.overview.department.name}</p>
            </div>
          }
          {
            (!isLoading && job.attributes?.workplaceType) &&
            <div className="flex items-center h-4">
              <RowIcon {...faHouseLaptop} />
              <p className="font-subtitle font--ellipsis">{t('job.workplace-type_interval', { postProcess: 'interval', count: job.attributes?.workplaceType })}</p>
            </div>
          }
        </div>
      </Link>
    </>
  )

}

const RowIcon = (icon: IconDefinition) => (
  <div className="flex items-center w-2 h-2 mr-1">
    <FontAwesomeIcon icon={icon} className={`icon-font icon-font--normal icon-font--field-button`}></FontAwesomeIcon>
  </div>
)