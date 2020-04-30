/**
 * AdSense Setup Account Approved component.
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
import { Fragment, useCallback } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import Button from '../../../components/button';
import { STORE_NAME } from '../datastore/constants';
import { parseAccountID } from '../util/parsing';
import { ACCOUNT_STATUS_APPROVED } from '../util/status';
import UserProfile from '../common/user-profile';
import UseSnippetSwitch from '../common/use-snippet-switch';
const { useSelect, useDispatch } = Data;

export default function SetupAccountApproved() {
	const existingTag = useSelect( ( select ) => select( STORE_NAME ).getExistingTag() );
	const hasExistingTagPermission = useSelect( ( select ) => select( STORE_NAME ).hasExistingTagPermission() );
	const originalAccountStatus = useSelect( ( select ) => select( STORE_NAME ).getOriginalAccountStatus() );
	const isDoingSubmitChanges = useSelect( ( select ) => select( STORE_NAME ).isDoingSubmitChanges() );
	const canSubmitChanges = useSelect( ( select ) => select( STORE_NAME ).canSubmitChanges() );

	const {
		setAccountSetupComplete,
		submitChanges,
	} = useDispatch( STORE_NAME );

	const continueHandler = useCallback( () => {
		setAccountSetupComplete( true );

		// While the button is already disabled based on whether a submission
		// is currently in progress, the button itself must not rely on
		// canSubmitChanges, since that may only become true due to the above
		// modification of the 'accountSetupComplete' setting.
		// TODO: Remove temporary hack to avoid saving in Storybook.
		if ( ! canSubmitChanges || global.__STORYBOOK_ADDONS ) {
			return;
		}
		submitChanges();
	}, [ isDoingSubmitChanges, canSubmitChanges ] );

	if ( 'undefined' === typeof existingTag || 'undefined' === typeof originalAccountStatus ) {
		return null;
	}

	const isApprovedFromVeryBeginning = '' === originalAccountStatus || ACCOUNT_STATUS_APPROVED === originalAccountStatus;

	let label;
	if ( isApprovedFromVeryBeginning ) {
		label = __( 'Let Site Kit place code on your site to get your site approved', 'google-site-kit' );
	} else {
		label = __( 'Keep the code placed by Site Kit', 'google-site-kit' );
	}

	let showProfile, checkedMessage, uncheckedMessage;
	if ( existingTag && hasExistingTagPermission ) {
		// Existing tag with permission.
		showProfile = false;
		checkedMessage = __( 'You’ve already got an AdSense code on your site for this account, we recommend you use Site Kit to place code to get the most out of AdSense.', 'google-site-kit' );
		uncheckedMessage = checkedMessage;
	} else if ( existingTag ) {
		// Existing tag without permission.
		showProfile = true;
		checkedMessage = sprintf(
			/* translators: %s: account ID */
			__( 'Site Kit detected AdSense code for a different account %s on your site. For a better ads experience, you should remove AdSense code that’s not linked to this AdSense account.', 'google-site-kit' ),
			parseAccountID( existingTag )
		);
		uncheckedMessage = __( 'By not placing the code, AdSense account will not show ads on your website unless you’ve already got some AdSense code.', 'google-site-kit' );
	} else {
		// No existing tag.
		showProfile = false;
		uncheckedMessage = __( 'By not placing the code, AdSense account will not show ads on your website unless you’ve already got some AdSense code.', 'google-site-kit' );
	}

	return (
		<Fragment>
			<h3 className="googlesitekit-heading-4 googlesitekit-setup-module__title">
				{ isApprovedFromVeryBeginning &&
					__( 'Looks like you’re already using AdSense', 'google-site-kit' )
				}
				{ ! isApprovedFromVeryBeginning &&
					__( 'Your account is ready to use AdSense', 'google-site-kit' )
				}
			</h3>

			<p>
				{ isApprovedFromVeryBeginning &&
					__( 'Site Kit will place AdSense code on your site to connect your site to AdSense and help you get the most out of ads. This means Google will automatically place ads for you in all the best places.', 'google-site-kit' )
				}
				{ ! isApprovedFromVeryBeginning &&
					__( 'Site Kit has placed AdSense code on your site to connect your site to AdSense and help you get the most out of ads. This means Google will automatically place ads for you in all the best places.', 'google-site-kit' )
				}
			</p>

			{ showProfile &&
				<UserProfile />
			}

			<UseSnippetSwitch
				label={ label }
				checkedMessage={ checkedMessage }
				uncheckedMessage={ uncheckedMessage }
			/>

			<div className="googlesitekit-setup-module__action">
				<Button
					onClick={ continueHandler }
					disabled={ isDoingSubmitChanges }
				>
					{ __( 'Continue', 'google-site-kit' ) }
				</Button>
			</div>
		</Fragment>
	);
}
