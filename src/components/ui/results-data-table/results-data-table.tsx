import type { PersonResult } from '../../../lib/results-viz/types';
import './results-data-table.css';

const PAGE_SIZES = [25, 50] as const;
type PageSize = (typeof PAGE_SIZES)[number];

interface ResultsDataTableProps {
    data: PersonResult[];
    page: number;
    pageSize: PageSize;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: PageSize) => void;
}

function ResultsDataTable({ data, page, pageSize, onPageChange, onPageSizeChange }: ResultsDataTableProps) {
    const total = data.length;
    const maxPage = Math.max(0, Math.ceil(total / pageSize) - 1);
    const currentPage = Math.min(page, maxPage);
    const start = currentPage * pageSize;
    const end = Math.min(start + pageSize, total);
    const rows = data.slice(start, end);

    function changePageSize(size: PageSize) {
        onPageSizeChange(size);
        onPageChange(0);
    }

    return (
        <details className="results-data-table">
            <summary>Show the underlying data as a table</summary>

            <div className="table-controls">
                <p className="table-caption">{total === 0 ? 'No respondents' : `Showing ${start + 1}–${end} of ${total}`}</p>

                <label className="page-size">
                    Rows per page
                    <select value={pageSize} onChange={(e) => changePageSize(Number(e.target.value) as PageSize)}>
                        {PAGE_SIZES.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </label>

                <div className="pager">
                    <button type="button" onClick={() => onPageChange(Math.max(0, currentPage - 1))} disabled={currentPage === 0}>
                        Previous
                    </button>
                    <button type="button" onClick={() => onPageChange(Math.min(maxPage, currentPage + 1))} disabled={currentPage >= maxPage}>
                        Next
                    </button>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Identity</th>
                        <th scope="col">O</th>
                        <th scope="col">C</th>
                        <th scope="col">E</th>
                        <th scope="col">A</th>
                        <th scope="col">N</th>
                        <th scope="col">Econ</th>
                        <th scope="col">Soc</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((person) => (
                        <tr key={person.id}>
                            <td>{person.id}</td>
                            <td>{person.name}</td>
                            <td>{person.identity ?? '—'}</td>
                            <td>{person.O}</td>
                            <td>{person.C}</td>
                            <td>{person.E}</td>
                            <td>{person.A}</td>
                            <td>{person.N}</td>
                            <td>{person.econ}</td>
                            <td>{person.soc}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </details>
    );
}

export default ResultsDataTable;
