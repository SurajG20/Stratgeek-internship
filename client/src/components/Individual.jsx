import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(team, line, file, pr) {
  return { team, line, file, pr };
}

const rows = [
  createData('Naseem', 800, 12, 2),
  createData('Surya', 500, 7, 2),
];

export default function Individual() {
  return (
    <section className='border-2 py-4 my-4 rounded-md bg-gray-100 shadow-md px-8'>
      <h1 className='text-left text-xl font-bold text-gray-600 p-2'>
        Individual Code Contributions
      </h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead className='bg-gray-400'>
            <TableRow>
              <TableCell>Team</TableCell>
              <TableCell align='center'>No. of Line Contributions</TableCell>
              <TableCell align='center'>No. of File Contributions</TableCell>
              <TableCell align='center'>PRs merged</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.team}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component='th' scope='row'>
                  {row.team}
                </TableCell>
                <TableCell align='center'>{row.line}</TableCell>
                <TableCell align='center'>{row.file}</TableCell>
                <TableCell align='center'>{row.pr}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </section>
  );
}
