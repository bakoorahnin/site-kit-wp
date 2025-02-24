/**
 * Header component the ModuleOverviewWidget widget.
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
 * WordPress dependencies
 */
import { sprintf, _n, _x, __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { CORE_USER } from '../../../../../googlesitekit/datastore/user/constants';
import { MODULES_ANALYTICS } from '../../../datastore/constants';
import WidgetHeaderTitle from '../../../../../googlesitekit/widgets/components/WidgetHeaderTitle';
import WidgetHeaderCTA from '../../../../../googlesitekit/widgets/components/WidgetHeaderCTA';
const { useSelect } = Data;

export default function Header() {
	const visitorsOverview = useSelect( ( select ) => select( MODULES_ANALYTICS ).getServiceReportURL( 'visitors-overview' ) );
	const currentDayCount = useSelect( ( select ) => select( CORE_USER ).getDateRangeNumberOfDays() );

	const title = sprintf(
		/* translators: %s: number of days */
		_n( 'Audience overview for the last %s day', 'Audience overview for the last %s days', currentDayCount, 'google-site-kit', ),
		currentDayCount
	);

	const headerCTALabel = sprintf(
		/* translators: %s: module name. */
		__( 'See full stats in %s', 'google-site-kit' ),
		_x( 'Analytics', 'Service name', 'google-site-kit' )
	);

	return (
		<Fragment>
			<WidgetHeaderTitle title={ title } />
			<WidgetHeaderCTA href={ visitorsOverview } label={ headerCTALabel } external />
		</Fragment>
	);
}
