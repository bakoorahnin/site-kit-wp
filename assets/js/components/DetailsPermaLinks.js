/**
 * Details Permalink Links component.
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
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { CORE_SITE } from '../googlesitekit/datastore/site/constants';
import Link from './Link';
const { useSelect } = Data;

export default function DetailsPermaLinks( { title, path } ) {
	const siteURL = useSelect( ( select ) => select( CORE_SITE ).getReferenceSiteURL() );
	const permaLink = new URL( path, siteURL ).href;
	const detailsURL = useSelect( ( select ) => {
		return select( CORE_SITE ).getAdminURL( 'googlesitekit-dashboard', { permaLink } );
	} );

	return (
		<Fragment>
			<Link
				className="googlesitekit-display-block"
				href={ detailsURL }
				inherit
			>
				{ title }
			</Link>

			<Link
				className={ classnames(
					'googlesitekit-display-block',
					'googlesitekit-overflow-wrap-break-word'
				) }
				href={ permaLink }
				target="_blank" // No external styling.
				small
				inherit
			>
				{ path }
			</Link>
		</Fragment>
	);
}
