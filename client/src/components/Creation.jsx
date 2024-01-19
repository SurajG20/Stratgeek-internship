import * as React from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';

const data = [
  { value: 17, label: 'Aditya Vats' },
  { value: 60, label: 'Ashish Vats' },
  { value: 23, label: 'Naseem Shaik' },
];

const size = {
  width: 500,
  height: 250,
};

export default function Creation() {
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
              data,
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

      <p className='text-gray-500 italic p-2 text-md text-cen'>
        *Above percentages illustrate each person's contribution to PR Creation.
      </p>
    </section>
  );
}
