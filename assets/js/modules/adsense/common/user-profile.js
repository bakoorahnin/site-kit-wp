/**
 * AdSense User Profile component.
 *
 * Site Kit by Google, Copyright 2020 Google LLC
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
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import ProgressBar from '../../../components/progress-bar';
import { STORE_NAME as userStoreName } from '../../../googlesitekit/datastore/user/constants';
const { useSelect } = Data;

export default function UserProfile() {
	const userEmail = useSelect( ( select ) => select( userStoreName ).getEmail() );
	const userPicture = useSelect( ( select ) => select( userStoreName ).getPicture() );

	if ( undefined === userEmail || undefined === userPicture ) {
		return <ProgressBar small />;
	}

	return (
		<p className="googlesitekit-setup-module__user">
			<img
				className="googlesitekit-setup-module__user-image"
				src={ userPicture }
				alt=""
			/>
			<span className="googlesitekit-setup-module__user-email">
				{ userEmail }
			</span>
		</p>
	);
}
