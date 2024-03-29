import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { getJobs, JobSearchProps } from "../../services";
import Job from "../../services/models/job";
import Page from "../../services/models/page";
import { JobCardsList, JobListProps } from "./job-cards-list";
import { JobRowsList } from "./job-rows-list";
import _ from 'lodash';
import { useRouter } from "next/router";
import { ListType } from "./enums/list-type";
import { JobsFilter } from "./filters/job-filter";
import { JobsSectionTitle } from "../titles/jobs-section-title";

export const JobFilterList = ({ company, workplace, reduced = false, classes = '' }: JobListProps) => {
  const { t } = useTranslation("common");
  const searchByUrl = useRouter().query?.search as string;
  let lastSearch: JobSearchProps = { tenantCode: company.attributes.code, page: 1, perPage: 20, searchText: searchByUrl ? searchByUrl : '', workplaces: [], departments: [] };
  const [type, setType] = useState<ListType>(ListType.cards);
  const [jobList, setJobList] = useState<Page<Job>>();
  const [isLoading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<JobSearchProps>(lastSearch)

  const searchJobs = async (): Promise<void> => {
    setLoading(true);
    const jobList = await getJobs(searchParams);
    setJobList(jobList);
    setLoading(false);
  }

  useEffect(() => {
    if (localStorage.getItem('jobListType')) {
      setType(localStorage.getItem('jobListType') as unknown as ListType);
    }
    if (searchByUrl) {
      setSearchParams({ ...searchParams, searchText: searchByUrl });
    }
  }, [])

  useEffect(() => {
    if (
      lastSearch.searchText === searchParams.searchText ||
      lastSearch.workplaces[0] === searchParams.workplaces[0] ||
      lastSearch.departments[0] === searchParams.departments[0]
    ) {
      lastSearch = searchParams;
      window.history.replaceState(null, '', lastSearch.searchText ? `/jobs?search=${lastSearch.searchText}` : '/jobs')
      searchJobs();
    }
  }, [searchParams])

  return (
    <section id="department-jobs" className={`background-color--white ${classes}`}>
      <div className="mobile-container--responsive m-auto flex-col px-2 py-10">
        <JobsSectionTitle {...company} />
        <JobsFilter propSearchParam={searchParams} type={type} companyInfo={company} setType={value => setType(value)} setSearch={value => { setSearchParams(value) }} />
        {
          type === ListType.cards &&
          <JobCardsList jobList={jobList?.data} company={company} workplace={workplace} loading={isLoading} reduced={reduced} classes={classes} />
        }
        {
          type === ListType.rows &&
          <JobRowsList jobList={jobList?.data} company={company} workplace={workplace} loading={isLoading} reduced={reduced} classes={classes} />
        }
      </div>
    </section>
  )
}

