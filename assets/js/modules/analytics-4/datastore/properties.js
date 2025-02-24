/**
 * `modules/analytics-4` data store: properties.
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
import invariant from 'invariant';

/**
 * Internal dependencies
 */
import API from 'googlesitekit-api';
import Data from 'googlesitekit-data';
import { STORE_NAME, PROPERTY_CREATE } from './constants';
import { createFetchStore } from '../../../googlesitekit/data/create-fetch-store';
import { isValidPropertySelection } from '../utils/validation';
import { actions as webDataStreamActions } from './webdatastreams';

const fetchGetPropertiesStore = createFetchStore( {
	baseName: 'getProperties',
	controlCallback( { accountID } ) {
		return API.get( 'modules', 'analytics-4', 'properties', { accountID }, {
			useCache: true,
		} );
	},
	reducerCallback( state, properties, { accountID } ) {
		return {
			...state,
			properties: {
				...state.properties,
				[ accountID ]: properties,
			},
		};
	},
	argsToParams( accountID ) {
		return { accountID };
	},
	validateParams( { accountID } = {} ) {
		invariant( accountID, 'accountID is required.' );
	},
} );

const fetchCreatePropertyStore = createFetchStore( {
	baseName: 'createProperty',
	controlCallback( { accountID } ) {
		return API.set( 'modules', 'analytics-4', 'create-property', { accountID } );
	},
	reducerCallback( state, property, { accountID } ) {
		return {
			...state,
			properties: {
				...state.properties,
				[ accountID ]: [
					...( state.properties[ accountID ] || [] ),
					property,
				],
			},
		};
	},
	argsToParams( accountID ) {
		return { accountID };
	},
	validateParams( { accountID } = {} ) {
		invariant( accountID, 'accountID is required.' );
	},
} );

const baseInitialState = {
	properties: {},
};

const baseActions = {
	/**
	 * Creates a new GA4 property.
	 *
	 * @since n.e.x.t
	 *
	 * @param {string} accountID Analytics account ID.
	 * @return {Object} Object with `response` and `error`.
	 */
	createProperty( accountID ) {
		invariant( accountID, 'accountID is required.' );

		return ( function*() {
			const { response, error } = yield fetchCreatePropertyStore.actions.fetchCreateProperty( accountID );
			return { response, error };
		}() );
	},

	/**
	 * Sets the given property and related fields in the store.
	 *
	 * @since n.e.x.t
	 *
	 * @param {string} propertyID GA4 property ID.
	 * @return {Object} A Generator function.
	 */
	selectProperty( propertyID ) {
		invariant( isValidPropertySelection( propertyID ), 'A valid propertyID selection is required.' );

		return ( function* () {
			const registry = yield Data.commonActions.getRegistry();

			registry.dispatch( STORE_NAME ).setPropertyID( propertyID );
			registry.dispatch( STORE_NAME ).setWebDataStreamID( '' );
			registry.dispatch( STORE_NAME ).setMeasurementID( '' );

			if ( PROPERTY_CREATE === propertyID ) {
				return;
			}

			yield webDataStreamActions.waitForWebDataStreams( propertyID );

			const webdatastream = registry.select( STORE_NAME ).getMatchingWebDataStream( propertyID );
			if ( webdatastream ) {
				registry.dispatch( STORE_NAME ).setWebDataStreamID( webdatastream.name.split( '/' ).pop() );
				registry.dispatch( STORE_NAME ).setMeasurementID( webdatastream.measurementId ); // eslint-disable-line sitekit/acronym-case
			}
		}() );
	},
};

const baseControls = {
};

const baseReducer = ( state, { type } ) => {
	switch ( type ) {
		default: {
			return state;
		}
	}
};

const baseResolvers = {
	*getProperties( accountID ) {
		const registry = yield Data.commonActions.getRegistry();
		// Only fetch properties if there are none in the store for the given account.
		const properties = registry.select( STORE_NAME ).getProperties( accountID );
		if ( properties === undefined ) {
			yield fetchGetPropertiesStore.actions.fetchGetProperties( accountID );
		}
	},
};

const baseSelectors = {
	/**
	 * Gets all GA4 properties this account can access.
	 *
	 * @since n.e.x.t
	 *
	 * @param {Object} state     Data store's state.
	 * @param {string} accountID The GA4 Account ID to fetch properties for.
	 * @return {(Array.<Object>|undefined)} An array of GA4 properties; `undefined` if not loaded.
	 */
	getProperties( state, accountID ) {
		return state.properties[ accountID ];
	},
};

const store = Data.combineStores(
	fetchGetPropertiesStore,
	fetchCreatePropertyStore,
	{
		initialState: baseInitialState,
		actions: baseActions,
		controls: baseControls,
		reducer: baseReducer,
		resolvers: baseResolvers,
		selectors: baseSelectors,
	}
);

export const initialState = store.initialState;
export const actions = store.actions;
export const controls = store.controls;
export const reducer = store.reducer;
export const resolvers = store.resolvers;
export const selectors = store.selectors;

export default store;
