export type CreateIntpc = {
  intpCustomerId: string;
  email: string;

  // For INTPc subscription
  packageId?: string;
  billingDate?: string;

  website?: {
    intpWebsiteId: string;
    domain: string;

    // For Website subscription
    packageId?: string;
    billingDate?: string;
  };
};
