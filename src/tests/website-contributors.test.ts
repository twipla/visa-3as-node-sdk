import { sdks } from ".";
import { CreateIntpc } from "../intpcs/types";
import { ContributorRole } from "../websites/types";
import {
  randDomain,
  randEmail,
  randIntpcId,
  randWebsiteId,
} from "./test-utils";

const sdk = sdks.withCompanyManagedWebsiteSubscriptions;

describe("Website contributors", () => {
  const createdClients: string[] = [];

  afterAll(async () => {
    for (const intpcId of createdClients) {
      try {
        await sdk.intpc(intpcId).delete();
      } catch (error) {
        console.error("failed to cleanup and delete customer", error);
      }
    }
  });

  it("entire process should work", async () => {
    const websiteOwner: CreateIntpc = {
      email: randEmail(),
      intpCustomerId: randIntpcId(),
      website: {
        domain: randDomain(),
        intpWebsiteId: randWebsiteId(),
      },
    };
    await sdk.intpcs.create(websiteOwner);
    createdClients.push(websiteOwner.intpCustomerId);

    const contributor: CreateIntpc = {
      email: randEmail(),
      intpCustomerId: randIntpcId(),
    };
    await sdk.intpcs.create(contributor);
    createdClients.push(contributor.intpCustomerId);

    await sdk.website(websiteOwner.website?.intpWebsiteId!).addContributor({
      intpCustomerId: contributor.intpCustomerId,
      role: ContributorRole.editor,
    });

    const { owner, contributors } = await sdk
      .website(websiteOwner.website?.intpWebsiteId!)
      .listContributors();
    expect(owner.intpCustomerId).toBe(websiteOwner.intpCustomerId);
    expect(owner.email).toBe(websiteOwner.email);

    expect(contributors[ContributorRole.editor].length).toBe(1);
    expect(contributors[ContributorRole.editor][0]?.intpCustomerId).toBe(
      contributor.intpCustomerId,
    );
    expect(contributors[ContributorRole.editor][0]?.email).toBe(
      contributor.email,
    );

    await sdk
      .website(websiteOwner.website?.intpWebsiteId!)
      .deleteContributor({ intpCustomerId: contributor.intpCustomerId });

    const { contributors: contributorsAfterDelete } = await sdk
      .website(websiteOwner.website?.intpWebsiteId!)
      .listContributors();

    expect(contributorsAfterDelete[ContributorRole.editor].length).toBe(0);
  });
});
