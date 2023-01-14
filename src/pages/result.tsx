import 'react-toastify/dist/ReactToastify.css';

import * as fs from 'fs';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Draggable from 'react-draggable';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import type { Engine } from 'tsparticles-engine';

import { Meta } from '@/layouts/Meta';
import { getTextFromTime } from '@/pages/index';
import { Main } from '@/templates/Main';
import { particlesConfig } from '@/utils/particlesConfig';

const STOPWATCH_KEY = 'stopwatchTime';
const Index = ({ result }) => {
  const router = useRouter();
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Main meta={<Meta title="Memorize" description="Hush" />}>
      <Particles
        className={'fixed z-[-1]'}
        id="tsparticles"
        init={particlesInit}
        /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               // @ts-ignore */
        options={particlesConfig}
      />
      <div className={'m-3 flex flex-col items-center justify-center gap-5'}>
        <div className={'text-4xl font-bold'}>Results</div>
        <div className={'flex flex-col-reverse gap-5'}>
          {result.map((val, idx) => {
            return (
              <div
                className={
                  'flex flex-col rounded-lg border-black bg-blue-100 p-3 text-black'
                }
                key={idx}
              >
                <div className={'text-3xl font-bold'}>{val.id ?? ''}</div>

                <div>
                  <strong>On</strong>: {val.timestamp ? val.timestamp : ''}
                </div>
                <div>
                  <strong>Time spent on text</strong>:{' '}
                  {getTextFromTime((val.time ?? [0, 0])[0])}
                </div>
                <div>
                  <strong>Time spent on images</strong>:{' '}
                  {getTextFromTime((val.time ?? [0, 0])[1])}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Main>
  );
};

export async function getServerSideProps(context) {
  let result = fs
    .readFileSync('./public/memorize/result.txt')
    .toString()
    .split('\n');
  result = result.filter((val) => {
    return val !== '';
  });
  return {
    props: {
      result: result.map((val) => {
        try {
          return JSON.parse(val);
        } catch (e) {
          return {};
        }
      }),
    },
  };
}

export default Index;
