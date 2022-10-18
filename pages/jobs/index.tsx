import { faMapMarkerAlt, faScreenUsers } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Navbar } from "../../components";
import AboutCompany from "../../components/about";
import { ButtonBasic } from "../../components/buttons/button-basic";
import Footer from "../../components/footer";
import { Header } from "../../components/header";
import BottomSnackbar from "../../components/snackbar";
import { getCompanyInfo, getRecentJobs } from "../../services";
import Company from "../../services/models/company";
import Job from "../../services/models/job";
import Page from "../../services/models/page";
import { ApplyDynamicStyles } from "../../utils/dynamic-styles/apply-styles";
import getWildcardCode from "../../utils/wildcard";
import { faSuitcase } from "@fortawesome/pro-light-svg-icons";
import { loaderBucketL } from "../../utils/image-loader";
import { SSRCheck } from "../../utils/redirects";

interface RecentJobsProps {
  recentJobsList: Page<Job>;
  company: string;
  workplace?: number;
  loading: boolean;
  reduced?: boolean;
}

export const RecentJobs = ({ recentJobsList, company, workplace, loading = true, reduced = false }: RecentJobsProps) => {
  const { t } = useTranslation("common");
  let jobs = recentJobsList?.content;
  if (workplace) {
    jobs = recentJobsList?.content.filter(job => job.overview.workplaces.some(wp => wp.id === +workplace));
  }
  return (
    <section id="department-jobs" className="bg-white">
      <div className="mobile-container--responsive m-auto flex-col px-1 py-10">
        <h1 className="font-big-title text-center desktop:text-4xl mobile:text-3xl">{t('jobs.available')}</h1>
        <h2 className="font-subtitle text-center mt-1">{t('jobs.find', { company })}</h2>
        <div className="flex flex-wrap flex-align-justify-center mt-5">
          {
            !loading && jobs && jobs.map((job, i) => (
              <div className="p-1 w-m--100 w-d--33" key={i}>
                <JobCard {...job} />
              </div>
            ))
          }
          {
            //TODO
            (!jobs || jobs.length == 0) && !loading &&
            <h1 className="font-prose">{t('job.empty')}</h1>
          }
          {
            loading && Array.from(Array(6)).map((_, i) =>
              <div className="p-1 w-m--100 w-d--33" key={i}>
                <JobCardLoading />
              </div>
            )
          }
        </div>
        {
          reduced &&
          <div className="flex justify-center mt-2">
            <Link href="/jobs">
              <a className="">
                <ButtonBasic classes='!py-4 !text-lg'>{t('workplaces.jobs.button')}</ButtonBasic>
              </a>
            </Link>
          </div>
        }
      </div>
    </section>
  )
};

const JobCardLoading = () => (
  <div className="w-full flex-column box-shadow-container--card br-var">
    <div className="h-30 flex-column flex-justify-between py-2 px-2 background-loading-gradient background-loading-gradient--rect"></div>

    <div className="flex-column p-3">
      <div className="h-8 flex">
        <div className="h-3 full-width background-loading-gradient"></div>
      </div>
    </div>

    <div className="flex flex-align-justify-center space-x-8 pt-1 pb-3">
      <div className="flex">
        <div className="h-2 w-2 background-loading-gradient"></div>
        <div className="h-2 w-10 background-loading-gradient ml-1"></div>
      </div>
      <div className="flex">
        <div className="h-2 w-2 background-loading-gradient"></div>
        <div className="h-2 w-10 background-loading-gradient ml-1"></div>
      </div>
    </div>
  </div >
)

const JobCard = (job: Job) => {
  const { t } = useTranslation("common");
  return (
    <div className={`flex flex-col text-center box-shadow-container--card br-var overflow-hidden mobile:flex-col`}>
      <div className="h-30 w-full desktop:min-h-full mobile:h-60 mobile:w-full relative">
        {
          job.attributes.picture
            ? <Image loader={loaderBucketL} src={job.attributes.picture} alt='workplace' layout="fill" className="flex relative object-cover" />
            : <div className={`h-full w-full flex items-center justify-center relative background-dynamic mobile:rounded-t-lg`}>
              <div className="w-6 h-9 flex items-center justify-center"><FontAwesomeIcon icon={faSuitcase} className='icon-font text-6xl icon-font--light' /></div>
            </div>
        }
      </div>
      <div className={`flex flex-col w-full p-3 mobile:w-full`}>
        <p className="font-title font--ellipsis">{job.attributes.title}</p>
        <div className="flex flex-wrap flex-justify-center h-3 mt-1">
          {
            job.overview?.department &&
            <Link href={{ pathname: '/teams/' + job.overview.department.id }}>
              <div className="flex flex-align-justify-center font-hint mr-3 font-hover--underline cursor-pointer">
                <div className="flex items-center w-2 h-2 mr-1">
                  <FontAwesomeIcon icon={faScreenUsers} className="icon-font icon-font--normal icon-font--field-button"></FontAwesomeIcon>
                </div>
                <p>{job.overview.department.name}</p>
              </div>
            </Link>
          }
          {
            job.overview?.workplaces.length > 0 &&
            <Link href={{ pathname: '/locations/' + job.overview.workplaces[0].id }}>
              <div className="flex flex-align-justify-center font-hint font-hover--underline cursor-pointer">
                <div className="flex items-center w-2 h-2 mr-1">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="icon-font icon-font--normal icon-font--field-button"></FontAwesomeIcon>
                </div>
                <p>{job.overview.workplaces[0].areaName || ''}</p>
              </div>
            </Link>
          }
        </div>
        <div className="flex flex-justify-center mt-2">
          <Link href={{ pathname: '/jobs/' + job.id }}>
            <a>
              <ButtonBasic>{t('job.apply.button.short')}</ButtonBasic>
            </a>
          </Link>
        </div>
      </div>
    </div>

  )
}

interface JobsProps {
  recentJobsList: Page<Job>,
}

const Jobs: NextPage<{ pageProps: { companyInfo: Company } }> = ({ pageProps }: { pageProps: { companyInfo: Company } }) => {
  const { t } = useTranslation("common");
  const snackbarRef = useRef(null);
  const workplaceId = +useRouter().query?.workplace;
  const [data, setData] = useState<JobsProps>({ recentJobsList: null })
  const [isLoading, setLoading] = useState(true);
  ('unknown' in useRouter().query) && snackbarRef.current?.handleClick(t('job.not-exist'));
  useEffect(() => {
    async function getJobsData() {
      ApplyDynamicStyles(pageProps.companyInfo.attributes.primaryColor, pageProps.companyInfo.careers?.style);
      const recentJobsList = await getRecentJobs(pageProps.companyInfo.id);
      setData({ recentJobsList });
      setLoading(false);
    }
    getJobsData();
  }, [])


  return (
    <>
      <Header company={pageProps.companyInfo} title={t('jobs')} />
      <Navbar url='jobs' company={pageProps.companyInfo} />
      <RecentJobs recentJobsList={data.recentJobsList} company={pageProps.companyInfo.attributes.name} workplace={workplaceId} loading={isLoading} />
      <AboutCompany {...pageProps.companyInfo} />
      <Footer />
      <BottomSnackbar ref={snackbarRef} />
    </>
  )
};

export const getServerSideProps = async ({ req }: any) => {
  const wildcard = getWildcardCode(req.headers.host);
  const companyInfo = await getCompanyInfo(wildcard);
  const translations = await serverSideTranslations(companyInfo.careers?.languageCode ?? 'en', ["common"]);
  return SSRCheck(companyInfo, translations);
};

export default Jobs;