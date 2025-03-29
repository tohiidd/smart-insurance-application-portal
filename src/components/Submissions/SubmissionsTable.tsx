import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Box,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { SubmissionData } from '../../services/formService';

interface SubmissionsTableProps {
  data: SubmissionData;
}

function SubmissionsTable({ data }: SubmissionsTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({});

  useMemo(() => {
    const initialColumns: Record<string, boolean> = {};
    data.columns.forEach((column) => {
      initialColumns[column] = true;
    });
    setVisibleColumns(initialColumns);
  }, [data.columns]);

  const filteredData = useMemo(() => {
    return data.data.filter((row) =>
      Object.entries(row).some(([key, value]) => {
        if (!visibleColumns[key]) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data.data, searchTerm, visibleColumns]);

  const paginatedData = useMemo(() => {
    return filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const toggleColumn = (column: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', flexDirection: { xs: 'column-reverse', md: 'row' }, gap: 2 }}>
        <TextField
          size="small"
          sx={{ width: { xs: '100%', md: 'auto' } }}
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {data.columns.map((column) => (
            <FormControlLabel
              key={column}
              control={<Checkbox checked={visibleColumns[column]} onChange={() => toggleColumn(column)} />}
              label={column}
            />
          ))}
        </Box>
      </Box>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {data.columns
                .filter((column) => visibleColumns[column])
                .map((column) => (
                  <TableCell key={column} style={{ minWidth: 170 }}>
                    {column}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                {data.columns
                  .filter((column) => visibleColumns[column])
                  .map((column) => (
                    <TableCell key={column}>{row[column]}</TableCell>
                  ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default SubmissionsTable;
