// Individual.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setContributions } from '../redux/contributionSlice';
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

const Individual = () => {
  const dispatch = useDispatch();
  const contributions = useSelector((state) => state.contributions);

  useEffect(() => {
    // Fetch contributions data from API and update the state
    // This is a simplified example; replace it with your actual API call
    const fetchData = async () => {
      try {
        const response = await fetch(
          'http://localhost:3000/api/v1/contributions/username'
        );
        const data = await response.json();
        dispatch(setContributions(data.contributions));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [dispatch]);

  const rows = contributions.map((contributor) =>
    createData(
      contributor.username,
      contributor.lineContributions,
      contributor.commmits,
      contributor.mergedPRs.length
    )
  );

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
};

export default Individual;
