/**
 * Analytics Module Component Stories.
 *
 * Site Kit by Google, Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Internal dependencies
 */
import { generateReportBasedWidgetStories, makeReportDataGenerator } from './utils/generate-widget-stories';
import DashboardAllTrafficWidget from '../assets/js/modules/analytics/components/dashboard/DashboardAllTrafficWidget';
import DashboardPopularPagesWidget from '../assets/js/modules/analytics/components/dashboard/DashboardPopularPagesWidget';
import DashboardBounceRateWidget from '../assets/js/modules/analytics/components/dashboard/DashboardBounceRateWidget';
import DashboardGoalsWidget from '../assets/js/modules/analytics/components/dashboard/DashboardGoalsWidget';
import DashboardUniqueVisitorsWidget from '../assets/js/modules/analytics/components/dashboard/DashboardUniqueVisitorsWidget';
import { STORE_NAME } from '../assets/js/modules/analytics/datastore/constants';
import {
	accountsPropertiesProfiles,
	goals,
	dashboardUserDimensionsArgs,
	dashboardUserTotalsArgs,
	dashboardUserGraphArgs,
} from '../assets/js/modules/analytics/datastore/__fixtures__';
import { analyticsFactory } from '../tests/js/data-mocks';

/**
 * Defines some additional setup for all stories.
 *
 * @since 1.19.0
 *
 * @param {wp.data.registry} registry Registry with all available stores registered.
 */
const setup = ( registry ) => {
	const [ property ] = accountsPropertiesProfiles.properties;
	registry.dispatch( STORE_NAME ).receiveGetSettings( {
		// eslint-disable-next-line sitekit/camelcase-acronyms
		accountID: property.accountId,
		// eslint-disable-next-line sitekit/camelcase-acronyms
		internalWebPropertyID: property.internalWebPropertyId,
		// eslint-disable-next-line sitekit/camelcase-acronyms
		profileID: property.defaultProfileId,
	} );
};

const generateData = makeReportDataGenerator( analyticsFactory );

generateReportBasedWidgetStories( {
	moduleSlugs: [ 'analytics' ],
	datastore: STORE_NAME,
	group: 'Analytics Module/Components/Dashboard/All Traffic Widget',
	referenceDate: '2021-01-06',
	...generateData( [
		dashboardUserDimensionsArgs[ 'ga:channelGrouping' ],
		dashboardUserDimensionsArgs[ 'ga:country' ],
		dashboardUserDimensionsArgs[ 'ga:deviceCategory' ],
		dashboardUserTotalsArgs,
		dashboardUserGraphArgs,
	] ),
	Component: DashboardAllTrafficWidget,
	wrapWidget: false,
	setup,
} );

generateReportBasedWidgetStories( {
	moduleSlugs: [ 'analytics' ],
	datastore: STORE_NAME,
	group: 'Analytics Module/Components/Page Dashboard/All Traffic Widget',
	referenceDate: '2021-01-06',
	...generateData( [
		{
			...dashboardUserDimensionsArgs[ 'ga:channelGrouping' ],
			url: 'https://www.elasticpress.io/features/',
		},
		{
			...dashboardUserDimensionsArgs[ 'ga:country' ],
			url: 'https://www.elasticpress.io/features/',
		},
		{
			...dashboardUserDimensionsArgs[ 'ga:deviceCategory' ],
			url: 'https://www.elasticpress.io/features/',
		},
		{
			...dashboardUserTotalsArgs,
			url: 'https://www.elasticpress.io/features/',
		},
		{
			...dashboardUserGraphArgs,
			url: 'https://www.elasticpress.io/features/',
		},
	] ),
	Component: DashboardAllTrafficWidget,
	wrapWidget: false,
	setup,
} );

generateReportBasedWidgetStories( {
	moduleSlugs: [ 'analytics' ],
	datastore: STORE_NAME,
	group: 'Analytics Module/Components/Page Dashboard/Bounce Rate Widget',
	referenceDate: '2020-09-10',
	...generateData( {
		compareStartDate: '2020-07-16',
		compareEndDate: '2020-08-12',
		startDate: '2020-08-13',
		endDate: '2020-09-09',
		dimensions: 'ga:date',
		metrics: [
			{
				expression: 'ga:bounceRate',
				alias: 'Bounce Rate',
			},
		],
		url: 'https://www.sitekit.com/',
	} ),
	Component: DashboardBounceRateWidget,
	setup,
} );

generateReportBasedWidgetStories( {
	moduleSlugs: [ 'analytics' ],
	datastore: STORE_NAME,
	group: 'Analytics Module/Components/Dashboard/Goals Widget',
	referenceDate: '2020-12-30',
	...generateData( {
		compareStartDate: '2020-11-04',
		compareEndDate: '2020-12-01',
		startDate: '2020-12-02',
		endDate: '2020-12-29',
		dimensions: 'ga:date',
		metrics: [
			{
				expression: 'ga:goalCompletionsAll',
				alias: 'Goal Completions',
			},
		],
	} ),
	Component: DashboardGoalsWidget,
	additionalVariants: {
		'No Goals':
		{
			referenceDate: '2020-09-10',
			...generateData( {
				// Using negative date range to generate an empty report.
				compareStartDate: '2020-07-16',
				compareEndDate: '2020-07-15',
				startDate: '2020-08-13',
				endDate: '2020-08-12',
				dimensions: 'ga:date',
				metrics: [
					{
						expression: 'ga:goalCompletionsAll',
						alias: 'Goal Completions',
					},
				],
			} ),
		},
	},
	additionalVariantCallbacks: {
		Loaded: ( dispatch ) => dispatch( STORE_NAME ).receiveGetGoals( goals ),
		'Data Unavailable': ( dispatch ) => dispatch( STORE_NAME ).receiveGetGoals( goals ),
	},
	setup,
} );

generateReportBasedWidgetStories( {
	moduleSlugs: [ 'analytics' ],
	datastore: STORE_NAME,
	group: 'Analytics Module/Components/Dashboard/Unique Visitors Widget',
	referenceDate: '2020-09-08',
	...generateData( [
		{
			compareStartDate: '2020-07-14',
			compareEndDate: '2020-08-10',
			startDate: '2020-08-11',
			endDate: '2020-09-07',
			metrics: [
				{
					expression: 'ga:users',
					alias: 'Total Users',
				},
			],
		},
		{
			startDate: '2020-08-11',
			endDate: '2020-09-07',
			dimensions: 'ga:date',
			metrics: [
				{
					expression: 'ga:users',
					alias: 'Users',
				},
			],

		},
	] ),
	Component: DashboardUniqueVisitorsWidget,
	setup,
} );

generateReportBasedWidgetStories( {
	moduleSlugs: [ 'analytics' ],
	datastore: STORE_NAME,
	group: 'Analytics Module/Components/Page Dashboard/Unique Visitors Widget',
	referenceDate: '2020-09-08',
	...generateData( [
		{
			compareStartDate: '2020-07-14',
			compareEndDate: '2020-08-10',
			startDate: '2020-08-11',
			endDate: '2020-09-07',
			url: 'https://www.example.com/example-page/',
			metrics: [
				{
					expression: 'ga:users',
					alias: 'Total Users',
				},
			],
		},
		{
			startDate: '2020-08-11',
			endDate: '2020-09-07',
			url: 'https://www.example.com/example-page/',
			dimensions: 'ga:date',
			metrics: [
				{
					expression: 'ga:users',
					alias: 'Users',
				},
			],

		},
	] ),
	Component: DashboardUniqueVisitorsWidget,
	setup,
} );

generateReportBasedWidgetStories( {
	moduleSlugs: [ 'analytics' ],
	datastore: STORE_NAME,
	group: 'Analytics Module/Components/Dashboard/Popular Pages Widget',
	referenceDate: '2020-09-10',
	...generateData( {
		startDate: '2020-08-13',
		endDate: '2020-09-09',
		dimensions: [
			'ga:pageTitle',
			'ga:pagePath',
		],
		metrics: [
			{
				expression: 'ga:pageviews',
				alias: 'Pageviews',
			},
		],
		orderby: [
			{
				fieldName: 'ga:pageviews',
				sortOrder: 'DESCENDING',
			},
		],
		limit: 10,
	} ),
	Component: DashboardPopularPagesWidget,
	wrapWidget: false,
	setup,
} );
