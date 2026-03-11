export enum ContributorRole {
  editor = "editor",
  watcher = "watcher",
  dashboard = "dashboard",
}

export type AddWebsiteContributorArgs = {
  // Represents the user who is being added as a contributor.
  // ID of the customer within the integration partner’s system.
  intpCustomerId: string;

  /**
	Defines the role assigned to the contributor.

	Available roles:

	editor — Full edit access, including content updates and structural changes.
	watcher — View-only access to website data. Cannot make any edits.
	dashboard — View-only access to custom dashboards explicitly shared with them. No access to any other platform content or settings. Access to specific dashboards is granted by the website owner from within the dashboard.
	*/
  role: ContributorRole;
};

export type DeleteWebsiteContributorArgs = {
  // Represents the user who is being removed as a contributor.
  // ID of the customer within the integration partner’s system.
  intpCustomerId: string;
};

export type ContributorInfo = {
  intpCustomerId: string;
  email: string;
};

export type ListContributorsResponse = {
  owner: ContributorInfo;
  contributors: Record<keyof typeof ContributorRole, ContributorInfo[]>;
};
