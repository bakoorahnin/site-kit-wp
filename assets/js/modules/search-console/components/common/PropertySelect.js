/**
 * PropertySelect component.
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
import { useCallback } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { STORE_NAME } from '../../datastore/constants';
import ProgressBar from '../../../../components/ProgressBar';
import { Select, Option } from '../../../../material-components';
const { useSelect, useDispatch } = Data;

export default function PropertySelect() {
	const propertyID = useSelect( ( select ) => select( STORE_NAME ).getPropertyID() );
	const matchedProperties = useSelect( ( select ) => select( STORE_NAME ).getMatchedProperties() );
	const hasResolvedProperties = useSelect( ( select ) => select( STORE_NAME ).hasFinishedResolution( 'getMatchedProperties' ) );

	const { setPropertyID } = useDispatch( STORE_NAME );
	const onChange = useCallback( ( index, item ) => {
		const newPropertyID = item.dataset.value;
		if ( propertyID !== newPropertyID ) {
			setPropertyID( newPropertyID );
		}
	}, [ propertyID ] );

	if ( ! hasResolvedProperties ) {
		return <ProgressBar small />;
	}

	return (
		<Select
			className="googlesitekit-search-console__select-property"
			label={ __( 'Property', 'google-site-kit' ) }
			value={ propertyID }
			onEnhancedChange={ onChange }
			enhanced
			outlined
		>
			{ ( matchedProperties || [] ).map( ( { siteURL } ) => (
				<Option key={ siteURL } value={ siteURL }>
					{
						siteURL.startsWith( 'sc-domain:' )
							? sprintf(
								/* translators: %s: domain name */
								__( '%s (domain property)', 'google-site-kit' ), siteURL.replace( /^sc-domain:/, '' )
							)
							: siteURL
					}
				</Option>
			) ) }
		</Select>
	);
}
