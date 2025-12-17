import fs from 'fs';
import { parse } from 'csv-parse'

async function LoadFile(filePath) {
    return new Promise((resolve, reject) => {
        const records = [];

        fs.createReadStream(filePath)
            .pipe(
                parse({
                    delimiter: ',',
                    relax_quotes: true,
                    trim: true,
                    skip_empty_lines: false
                })
            )
            .on('data', (row) => {
                records.push(row);
            })
            .on('end', () => {
                console.log('Finished reading CSV file.');
                console.log(`Total Records: ${records.length}`);
                resolve(records);
            })
            .on('error', (err) => {
                console.error('Error reading CSV file:', err.message);
                reject(err);
            });
    });
}


async function ViewRows(rows) {
    // Calculate maximum width for each column
    const columnWidths = [];
    const maxColumnWidth = 15; // Maximum width for data columns
    const maxFirstColumnWidth = 40; // Larger width for first column (labels)


    // Determine the suitable width for each column by iterating through all cells by row, then by column, and deducing the max width
    rows.forEach(columns => {
        columns.forEach((col, index) => {
            const maxWidth = index === 0 ? maxFirstColumnWidth : maxColumnWidth;
            const width = Math.min(col.length, maxWidth);
            columnWidths[index] = Math.max(columnWidths[index] || 0, width);
        });
    });

    // Add padding (2 extra spaces between columns)
    const padding = 2;

    // Display each row with proper column alignment
    rows.forEach((columns, rowIndex) => {
        let line = '';
        columns.forEach((col, colIndex) => {
            const width = columnWidths[colIndex] + padding;

            line += col.padEnd(width);
        });
        console.log(line);
    });

    return rows;
}


export { LoadFile, ViewRows }