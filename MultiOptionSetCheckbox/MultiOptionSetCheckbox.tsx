import * as React from 'react';
import { Checkbox } from '@fluentui/react-components';

export interface IMultiOptionSetCheckboxProps {
    options: any[];
    selected: number[];
    columns: number;
    rows: number;
    orderBy: string;
    direction: string;
    startAt: string;
    orientation: string;
    onChange: (selected: number[]) => void;

}

const MultiOptionSetCheckbox = ({ options, selected, columns, rows, orderBy, direction, startAt, orientation, onChange }: IMultiOptionSetCheckboxProps) => {
    const [splitOptions, setSplitOptions] = React.useState([] as any);
    const [calcColumns, setColumns] = React.useState(columns);
    const [calcRows, setRows] = React.useState(rows);

    React.useEffect(() => {
        let sortedOptions = [...options];
        if (orderBy === "optionsetvalue") {
            sortedOptions.sort((a, b) => a.Value - b.Value);
        } else if (orderBy === "alphabetical") {
            sortedOptions.sort((a, b) => a.Label.localeCompare(b.Label));
        }
        if (direction === "desc") {
            sortedOptions.reverse();
        }
        if (startAt && startAt !== "") {
            splitOptionsFunction(sortedOptions, startAt, orientation);
        } else {
            setSplitOptions(sortedOptions);
        }
    }, [options, orderBy, direction, startAt, orientation]);

    const splitOptionsFunction = (options: any, startAt: any, orientation: any) => {
        // Sort options alphabetically
        options = options.sort((a: any, b: any) => a.Label.localeCompare(b.Label));

        // Parse startAt string and convert to uppercase
        const startCharacters = startAt.split(';').map((x: string) => x.toUpperCase());

        // Create a new array to store the split options
        const optionsSplit: any[][] = Array.from({ length: startCharacters.length }, () => []);

        // Create sublists for each starting character
        options.forEach((option: any) => {
            const firstLetter = option.Label.charAt(0).toUpperCase();
            const index = findIndexForLetter(firstLetter, startCharacters);
            optionsSplit[index].push(option);
        });

        // Pad sublists with null values to make them equal in length
        const longestListLength = Math.max(...optionsSplit.map(list => list.length));
        const paddedOptions = optionsSplit.map(list => list.concat(new Array(longestListLength - list.length).fill(null))).flat();
        setSplitOptions(paddedOptions);

        // Calculate rows and columns based on orientation
        const calcRows = orientation === "column" ? longestListLength : Math.ceil(paddedOptions.length / longestListLength);
        const calcColumns = orientation === "column" ? Math.ceil(paddedOptions.length / longestListLength) : longestListLength;
        setColumns(calcColumns);
        setRows(calcRows);
    };

    const findIndexForLetter = (letter: any, startCharacters: any) => {
        for (let i = 0; i < startCharacters.length; i++) {
            if (startCharacters[i] <= letter && letter < startCharacters[i + 1]) {
                return i;
            }
        }
        return startCharacters.length - 1;
    };

    const handleCheckboxChange = (option: any) => {
        const updatedSelected = [...selected];
        const index = updatedSelected.indexOf(option.Value);
        if (index > -1) {
            updatedSelected.splice(index, 1);
        } else {
            updatedSelected.push(option.Value);
        }
        onChange(updatedSelected);
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${calcColumns}, auto)`, gridTemplateRows: `repeat(${calcRows}, auto)`, gridAutoFlow: orientation === "column" ? 'column' : 'row' }}>
            {splitOptions.map((option: any, index: number) => (
                <div key={index}>
                    {option && (
                        <Checkbox
                        label={option.Label}
                        checked={selected.includes(option.Value)}
                        onChange={() => handleCheckboxChange(option)}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default MultiOptionSetCheckbox;