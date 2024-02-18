export type Tenant = {
	tenant_id: string;
	tenant_uid: string;
	tenant_name: string;
	images: string[];
	address: {
		street: string;
		postal_code: string;
		city: string;
	};
	resources: {
		resource_id: string;
		name: string;
		properties: {
			resource_type: string
      resource_size: string
		}
	}[]
}

export type Court = {
	resource_id: string;
	slots: {
		duration: number;
		start_time: string;
		price: string;
	}[];
}
