import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';
import * as fs from 'fs';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Draggable from 'react-draggable';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import type { Engine } from 'tsparticles-engine';

import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import { particlesConfig } from '@/utils/particlesConfig';

export const getTextFromTime = (time) => {
  const minutes = (time - (time % 60)) / 60;
  return `${minutes > 0 ? `${minutes} minutes` : ''} ${time % 60} seconds`;
};
const STOPWATCH_KEY = 'stopwatchTime';
const Index = ({ images, text }) => {
  const router = useRouter();
  const [timeElapsed, setTimeElapsed] = useState([0, 0]);
  const [showImages, setShowImages] = useState(false);
  const [code, setCode] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed((old) => {
        let current = [...old];
        if (typeof localStorage !== 'undefined') {
          let localTime;
          try {
            localTime = JSON.parse(localStorage.getItem(STOPWATCH_KEY));
            if (localTime[0] + localTime[1] > current[0] + current[1]) {
              current = localTime;
            }
          } catch (e) {}
        }
        current[showImages ? 1 : 0] += 1;
        localStorage.setItem(STOPWATCH_KEY, JSON.stringify(current));
        return current;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showImages]);
  const resetTimer = () => {
    localStorage.setItem(STOPWATCH_KEY, JSON.stringify([0, 0]));
    setTimeElapsed([0, 0]);
  };
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
      <div className={'m-10 flex flex-col items-center justify-center gap-5'}>
        {code !== '' && (
          <div>
            Successfuly submitted, your code is <strong>{code}</strong>
          </div>
        )}
        <div
          className={'flex flex-col items-center justify-center gap-3 text-xl'}
        >
          <div className={'flex flex-row gap-3'}>
            <button
              className={'rounded-lg bg-red-800 p-3 hover:bg-red-700'}
              onClick={resetTimer}
            >
              Reset
            </button>
            <button
              className={'rounded-lg bg-green-800 p-3 hover:bg-green-700'}
              onClick={() => {
                setShowImages((old) => !old);
              }}
            >
              Toggle Images and Texts
            </button>
          </div>

          <button
            className={'rounded-lg bg-yellow-800 p-3 hover:bg-yellow-700'}
            onClick={() => {
              axios
                .post(`/api/save`, {
                  time: timeElapsed,
                })
                .then((response) => {
                  setCode(response.data.id);
                });
            }}
          >
            Done Remembering
          </button>
          <strong>{getTextFromTime(timeElapsed[0] + timeElapsed[1])}</strong>
        </div>
        {showImages ? (
          <div className={'m-2 flex w-[80vw] flex-wrap gap-4'}>
            {images.map((val, imageIndex) => {
              return (
                <Draggable key={imageIndex} handle={`#handle-${imageIndex}`}>
                  <div className={''} id={`handle-${imageIndex}`}>
                    <img
                      onError={(event) => {
                        // @ts-ignore
                        // eslint-disable-next-line no-param-reassign
                        event.target.style.display = 'none';
                      }}
                      className={
                        'unselectable w-[30vw] rounded-lg md:w-[20vw] xl:w-[15vw] '
                      }
                      src={`/memorize/images/${val}`}
                      alt={'naruto'}
                    ></img>
                  </div>
                </Draggable>
              );
            })}
          </div>
        ) : (
          <div
            className={
              'arial rounded-lg bg-blue-100 px-10 font-bold text-black'
            }
          >
            <ul>
              {text.split('\n').map((val, textIndex) => {
                return (
                  <li className={'list-disc'} key={textIndex}>
                    {val}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </Main>
  );
};

export async function getServerSideProps(context) {
  const images = fs.readdirSync('./public/memorize/images/');
  const text = fs.readFileSync('./public/memorize/text.txt').toString();
  return {
    props: { images, text },
  };
}

export default Index;
