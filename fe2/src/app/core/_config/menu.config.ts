export class MenuConfig {
	public defaults: any = {
		header: {
			self: {},
			items: [],
		},
		aside: {
			self: {},
			items: [
				{
					title: "Dashboard",
					role: "administrator",
					root: true,
					icon: "flaticon2-architecture-and-city",
					page: "/dashboard",
					translate: "Dashboard",
					bullet: "dot",
				},
				// {
				// 	title: "Dashboard",
				// 	role: "spv",
				// 	root: true,
				// 	icon: "flaticon2-architecture-and-city",
				// 	page: "/dashboard",
				// 	translate: "Dashboard",
				// 	bullet: "dot",
				// },
				// {
				// 	title: "Dashboard",
				// 	role: "admin",
				// 	root: true,
				// 	icon: "flaticon2-architecture-and-city",
				// 	page: "/dashboard",
				// 	translate: "Dashboard",
				// 	bullet: "dot",
				// },
				// {
				// 	title: "Dashboard",
				// 	role: "spvengineer",
				// 	root: true,
				// 	icon: "flaticon2-architecture-and-city",
				// 	page: "/dashboard",
				// 	translate: "Dashboard",
				// 	bullet: "dot",
				// },
				// {
				// 	title: "Dashboard",
				// 	role: "engineer",
				// 	root: true,
				// 	icon: "flaticon2-architecture-and-city",
				// 	page: "/dashboard",
				// 	translate: "Dashboard",
				// 	bullet: "dot",
				// },
				// {
				// 	title: "Dashboard",
				// 	role: "fa",
				// 	root: true,
				// 	icon: "flaticon2-architecture-and-city",
				// 	page: "/dashboard",
				// 	translate: "Dashboard",
				// 	bullet: "dot",
				// },
				// {
				// 	title: "Dashboard",
				// 	role: "user",
				// 	root: true,
				// 	icon: "flaticon2-architecture-and-city",
				// 	page: "/dashboard",
				// 	translate: "Dashboard",
				// 	bullet: "dot",
				// },
				
				{ section: "Building Management" },
				{
					title: "Building Management",
					role: "administrator",
					bullet: "dot",
					icon: "flaticon-buildings",
					submenu: [
						{
							title: "Electricity Consumption",
							role: "administrator",
							bullet: "dot",
							page: "/power-management/power/transaction",
						},
						{
							title: "Water Consumption",
							role: "administrator",
							bullet: "dot",
							page: "/water-management/water/transaction",
						},
						{
							title: "Gas Consumption",
							role: "administrator",
							bullet: "dot",
							page: "/gas-management/gas/transaction",
						},
					],
				},
				{
					title: "Contract",
					role: "administrator",
					bullet: "dot",
					icon: "flaticon2-contract",
					submenu: [
						{
							role: "administrator",
							title: "Lease Contract",
							page: "/contract-management/contract/lease",
						},
						{
							role: "administrator",
							title: "Ownership Contract",
							page: "/contract-management/contract/ownership",
						},
					],
				},
				
				{
					title: "Parking Lot",
					role: "administrator",
					bullet: "dot",
					icon: "flaticon-map",
					submenu :[
						{
						role: "administrator",
						title: "Parking",
						page: "/parking",
						},
						{
						role: "administrator",
						title: "Additional Parking",
						page: "/apark",
						},
					],
				},
				{
					title: "Billing",
					role: "administrator",
					bullet: "dot",
					icon: "flaticon-file-2",
					submenu :[
						{
							role:"administrator",
							title:"Billing IPL",
							page : "/billing",
						},
						{
							role:"administrator",
							title:"Billing Rental",
							page : "/rntlbilling",
						},
						{
							role:"administrator",
							title:"Billing Lease",
							page : "/lsebilling",
						},
						{
							role:"administrator",
							title:"Billing Parking",
							page : "/prkbilling",
						},
					]
				},
				{
					title: "Revenue",
					role: "administrator",
					bullet: "dot",
					icon: "flaticon-file-2",
					page: "/rental",
				},

				{ section: "Asset" },
				{
					title: "Asset",
					role: "administrator",
					bullet: "dot",
					icon: "flaticon-map",
					submenu :[
						{
						role: "administrator",
						title: "Asset Management",
						page: "/am",
						},
						{
							role: "administrator",
							title: "Asset Depreciation",
							page: "/ad",
							},
					],
				},
				
				{ section: "Helpdesk" },
				{
					title: "Ticketing",
					role: "administrator",
					bullet: "dot",
					icon: "flaticon-map",
					submenu :[
						{
						role: "administrator",
						title: "Ticketing (Admin)",
						page: "/ticket",
						},
						{
							role: "administrator",
							title: "Ticketing (Spv)",
							page: "/SpvTicket",
						},
						{
							role: "administrator",
							title: "Ticketing (User)",
							page: "/UserTicket",
						},
					],
				},
				{
					role: "administrator",
					title: "Delivery Order",
					icon: "flaticon-map",
					submenu: [
						{
							role: "administrator",
							title: "Delivery Order",
							page: "/deliveryorder",
						},
						
					],
				},
				{
					title: "Rating",
					role: "administrator",
					bullet: "dot",
					icon: "flaticon-file-2",
					page: "/rating",
				},

				{ section: "Finance Accounting" },
				{
					title: "Invoice",
					role: "administrator",
					bullet: "dot",
					icon: "flaticon-file-2",
					page: "/invoice",
				},
				{
					title: "Deposit",
					role: "administrator",
					bullet: "dot",
					icon: "flaticon-file-2",
					page: "/deposit",
				},
				{
					title: "Cash Bank",
					role: "administrator",
					bullet: "dot",
					icon: "flaticon-file-2",
					page: "/cashb",
				},
				{ section: "Master Data" },
				{
					title: "Setup Master",
					role: "administrator",
					bullet: "dot",
					icon: "flaticon-map",
					submenu: [
						{
							role: "administrator",
							title: "Building Management",
							submenu :[
								{
									role: "administrator",
									title: "Project",
									page: "/bgroup",
								},
								{
									role: "administrator",
									title: "Block",
									page: "/block",
								},
								{
									role: "administrator",
									title: "Floor",
									page: "/floor",
								},
								{
									role: "administrator",
									title: "Unit Type",
									page: "/typeunit",
								},
								{
									role: "administrator",
									title: "Unit Rate",
									page: "/rateunit",
								},
								{
									role: "administrator",
									title: "Unit",
									page: "/unit",
								},
								{
									role: "administrator",
									title: "Master Electricity",
									submenu: [
										{
											role: "administrator",
											title: "Rate",
											page: "/power-management/power/rate",
										},
										{
											role: "administrator",
											title: "Electricity Meter",
											page: "/power-management/power/meter",
										},
									],
								},
								{
									role: "administrator",
									title: "Master Water",
									submenu: [
										{
											role: "administrator",
											title: "Rate",
											page: "/water-management/water/rate",
										},
										{
											role: "administrator",
											title: "Water Meter",
											page: "/water-management/water/meter",
										},
									],
								},
								{
									role: "administrator",
									title: "Master Gas",
									submenu: [
										{
											role: "administrator",
											title: "Rate",
											page: "/gas-management/gas/rate",
										},
										{
											role: "administrator",
											title: "Gas Meter",
											page: "/gas-management/gas/meter",
										},
									],
								},
								{
									role: "administrator",
									title: "Revenue Rental",
									page: "/revenue",
								},
							]
						},
						{
							role: "administrator",
							title: "Parking",
							submenu :[
								{
									role: "administrator",
									title: "Vehicle Type",
									page: "/vehicletype",
								},
							]
						},
						// {
						// 	role: "administrator",
						// 	title: "Pinalty Rate",
						// 	page: "/ratePinalty",
						// },
						{
							title: "User",
							role: "administrator",
							submenu: [
								{
									role:  "administrator",
									title: "Role",
									page:  "/role",
								},
								{
									role: "administrator",
									title: "Tenant",
									page: "/customer",
								},
								{
									role:"administrator",
									title: "Management",
									page: "/user-management/users",
								},
								{
									role:"administrator",
									title: "Engineer",
									page: "/engineer",
								},
								
							],
						},
						{
							role: "administrator",
							title: "Asset",
							submenu :[
								{
									role: "administrator",
									title: "Fiscal Asset",
									page: "/fiscal",
								},
								{
									role: "administrator",
									title: "Fixed  Asset",
									page: "/fixed",
								},
								{
									role: "administrator",
									title: "Uom",
									page: "/uom",
								},
							]
						},
						{
							role: "administrator",
							title: "Helpdesk",
							submenu :[
								{
									role: "administrator",
									title: "Category Ticket",
									submenu: [
										{
											role: "administrator",
											title: "Location",
											page: "/category",
										},
										{
											role: "administrator",
											title: "Detail Location",
											page: "/defect",
										},
										{
											role: "administrator",
											title: "Sub Detail Location",
											page: "/subdefect",
										},
										
									],
								},
							]
						},
						{
							role: "administrator",
							title: "Finance & Accounting",
							submenu :[
								{
									role: "administrator",
									title: "COA",
									submenu: [
										{
											role: "administrator",
											title: "Account Type",
											page: "/accountType",
										},
										{
											role: "administrator",
											title: "Account",
											page: "/accountGroup",
										},
									],
								},
								{
									role: "administrator",
									title: "Bank",
									submenu: [
										{
											role: "administrator",
											title: "Bank List",
											page: "/bank",
										},
										{
											role: "administrator",
											title: "Bank Account",
											page: "/accountBank",
										},
									],
								},
								{
									role: "administrator",
									title: "Tax",
									page: "/tax",
									
								},
							]
						}
						
						
					],
				},
			],
		},
	};

	public get configs(): any {
		return this.defaults;
	}
}
