// @flow
/**
 * This component is designed to be a multi-selct component which supports
 * the selection of several items in a picklist.  It was meant to mimic the
 * style of react-select but the multi-select behavior didn't work for our
 * our needs.
 *
 * Arguments:
 * - options: The {value, label}[] options to be displayed
 * - values: The currently selected values []
 * - onSelectedChanged: An event to notify the caller of new values
 * - valueRenderer: A fn to support overriding the message in the component
 * - isLoading: Show a loading indicator
 */
import React, {Component} from 'react';
import myStyles from './myStyles.css';

import Dropdown from './dropdown.js';
import SelectPanel from './select-panel.js';

import type {
    Option,
} from './select-item.js';

class MultiSelect extends Component {
    props: {
        options: Array<Option>,
        selected: Array<any>,
        onSelectedChanged: (selected: Array<any>) => void,
        valueRenderer?: (
            selected: Array<any>,
            options: Array<Option>
        ) => string,
        ItemRenderer?: Function,
        selectAllLabel: string,
        isLoading?: boolean,
        justCollapsed: boolean,
    }

    getSelectedText() {
        const {options, selected} = this.props;

        const selectedOptions = selected
            .map(s => options.find(o => o.value === s));

        const selectedLabels = selectedOptions.map(s => s ? s.label : "");

        return selectedLabels.join(", ");
    }

    renderHeader() {
        const {
            options,
            selected,
            valueRenderer,
        } = this.props;

        const styles = {
            noneSelected: {
                color: "#1d1c1c",
            },
        };

        const noneSelected = selected.length === 0;
        const allSelected = selected.length === options.length;

        const customText = valueRenderer && valueRenderer(selected, options);

        if (noneSelected) {
            return <span style={styles.noneSelected}>
                {customText || "Select some items..."}
            </span>;
        }

        if (customText) {
            return <span>{customText}</span>;
        }

        return <span>
            {allSelected
                ? "All items are selected"
                : this.getSelectedText()
            }
        </span>;
    }

    render() {
        const {
            ItemRenderer,
            options,
            selected,
            selectAllLabel,
						hideSelectAll,
            onSelectedChanged,
            isLoading,
            getJustCollapsed,
            label,
            name
        } = this.props;

        return (
            <div className={myStyles.maxWidth}>
                {label && <span htmlFor={name} className={myStyles.aboveLabel}>{label}</span>}

                <Dropdown
                    isLoading={isLoading}
                    contentComponent={SelectPanel}
                    getJustCollapsed={getJustCollapsed}
                    contentProps={{
                        ItemRenderer,
                        options,
                        selected,
                        selectAllLabel,
												hideSelectAll,
                        onSelectedChanged,
                        getJustCollapsed,
                    }}
                >
                    {this.renderHeader()}
                </Dropdown>
            </div>
        );
    }
}

export default MultiSelect;
export {Dropdown};
