import { StpConsumption } from "./website-consumption.type";

export type Website = {
  id: string;
  status: string;
  intpId: string;
  intpWebsiteId: string;
  intpCustomerId: string;
  visaTrackingCode: string;
  visaMaxPrivacyModeTrackingCode: string;

  domain: string;
  packageId: string;
  packageName: string;
  billingInterval: string;
  billingMode: string;
  lastPackageChangeAt?: string;
  plannedDowngradePackageId?: string;
  plannedDowngradePackageName?: string;
  plannedDowngradePackageInterval?: string;

  inTrial: boolean;
  hadTrial: boolean;

  createdAt: string;
  expiresAt: string;
  stpResetAt?: string;

  consumption?: StpConsumption;
};
