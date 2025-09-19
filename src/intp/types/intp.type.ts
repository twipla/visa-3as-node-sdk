
export type Intp = {
	id: string
	name: string
	address: string
	createdAt: string
	// Currently only "company_managed" and "platform_managed", but subject to change
	billingMode: string
	// Currently only "intpc" and "website", but subject to change
	subscriptionType: string
	websiteOnboarding: boolean
}