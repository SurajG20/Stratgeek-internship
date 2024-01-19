import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPRsData } from '../redux/prsDataSlice';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';

const Creation = () => {
  const dispatch = useDispatch();
  const prsData = useSelector((state) => state.prsData);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/prs');
        const data = await response.json();
        dispatch(setPRsData(data));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [dispatch]);

  const size = {
    width: 500,
    height: 250,
  };
  const creationData = Object.entries(prsData).map(([username, userData]) => ({
    username,
    value: userData.prsCreated.length,
  }));
  return (
    <section className='border-2 p-4 my-4 rounded-md bg-gray-100 shadow-md'>
      <h1 className='text-xl text-gray-600 font-bold text-left p-2'>
        PR Creation Breakdown
      </h1>
      <div className='mx-auto flex'>
        <PieChart
          series={[
            {
              arcLabel: (item) => `${item.value}%`,
              arcLabelMinAngle: 0,
              data: creationData,
            },
          ]}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fill: 'white',
              fontWeight: 'bold',
            },
          }}
          {...size}
        />
      </div>

      <p className='text-gray-500 italic p-2 text-md text-center'>
        *Above percentages illustrate each person's contribution to PR Creation.
      </p>
    </section>
  );
};

export default Creation;
