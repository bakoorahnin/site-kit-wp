/**
 * WidgetAreaRenderer component.
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
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { STORE_NAME, WIDGET_AREA_STYLES } from '../datastore/constants';
import WidgetRenderer from './WidgetRenderer';
import { getWidgetLayout, combineWidgets } from '../util';
import { Cell, Grid, Row } from '../../../material-components';
import WidgetCellWrapper from './WidgetCellWrapper';
import { isInactiveWidgetState } from '../util/is-inactive-widget-state';
const { useSelect } = Data;

export default function WidgetAreaRenderer( { slug, totalAreas } ) {
	const widgetArea = useSelect( ( select ) => select( STORE_NAME ).getWidgetArea( slug ) );
	const widgets = useSelect( ( select ) => select( STORE_NAME ).getWidgets( slug ) );
	const widgetStates = useSelect( ( select ) => select( STORE_NAME ).getWidgetStates() );
	const activeWidgets = widgets.filter( ( widget ) => ! ( widgetStates[ widget.slug ] && isInactiveWidgetState( widgetStates[ widget.slug ] ) ) );

	// Compute the layout.
	const {
		columnWidths,
		rowIndexes,
	} = getWidgetLayout( widgets, widgetStates );

	// Combine widgets with similar CTAs and prepare final props to pass to
	// `WidgetRenderer` below. Only one consecutive instance of a similar CTA
	// will be maintained (via an "override component"), and all other similar
	// ones will receive a CSS class to hide them.
	// A combined CTA will span the combined width of all widgets that it was
	// combined from.
	const {
		gridColumnWidths,
		overrideComponents,
	} = combineWidgets( widgets, widgetStates, {
		columnWidths,
		rowIndexes,
	} );

	// Render all widgets.
	const widgetsOutput = widgets.map( ( widget, i ) => (
		<WidgetCellWrapper
			key={ `${ widget.slug }-wrapper` }
			gridColumnWidth={ gridColumnWidths[ i ] }
		>
			<WidgetRenderer
				OverrideComponent={ overrideComponents[ i ] ? () => {
					const { Component, metadata } = overrideComponents[ i ];
					return <Component { ...metadata } />;
				} : undefined }
				slug={ widget.slug }
			/>
		</WidgetCellWrapper>
	) );

	// Here we render the bare output as it is guaranteed to render empty.
	// This is important compared to returning `null` so that the area
	// can maybe render later if conditions change for widgets to become active.
	// Returning `null` here however would have the side-effect of making
	// all widgets active again, which is why we must return the "null" output.
	if ( ! activeWidgets.length ) {
		return widgetsOutput;
	}

	const { Icon, title, style, subtitle } = widgetArea;

	return (
		<Grid className={ `googlesitekit-widget-area googlesitekit-widget-area--${ slug } googlesitekit-widget-area--${ style }` }>
			{ totalAreas > 1 && (
				<Row>
					<Cell className="googlesitekit-widget-area-header" size={ 12 }>
						{ Icon && (
							<Icon width={ 33 } height={ 33 } />
						) }

						{ title && (
							<h3 className="googlesitekit-widget-area-header__title googlesitekit-heading-3">
								{ title }
							</h3>
						) }

						{ subtitle && (
							<h4 className="googlesitekit-widget-area-header__subtitle">
								{ subtitle }
							</h4>
						) }
					</Cell>
				</Row>
			) }

			<div className="googlesitekit-widget-area-widgets">
				<Row>
					{ style === WIDGET_AREA_STYLES.BOXES && widgetsOutput }
					{ style === WIDGET_AREA_STYLES.COMPOSITE && (
						<Cell size={ 12 }>
							<Grid>
								<Row>
									{ widgetsOutput }
								</Row>
							</Grid>
						</Cell>
					) }
				</Row>
			</div>
		</Grid>
	);
}

WidgetAreaRenderer.propTypes = {
	slug: PropTypes.string.isRequired,
};
