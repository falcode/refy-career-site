export default interface Workplace {
  id?: number;
  areaName: string;
  attributes: {
    atsPartnerCode: string;
    name: string;
    route: string;
    areaId: number;
    areaName?: string;
    locality: string;
    postalCode: string;
    streetNumber: string;
    pictures: string[];
    shortDescription: string;
    description: string;
    availableJobs: number;
  };
  companyId?: number;
}