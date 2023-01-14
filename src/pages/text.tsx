import 'react-toastify/dist/ReactToastify.css';

import { Textarea } from '@material-tailwind/react';
import axios from 'axios';
import * as fs from 'fs';
import React, { useCallback, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import type { Engine } from 'tsparticles-engine';

import { Meta } from '@/layouts/Meta';
import { getTextFromTime } from '@/pages/index';
import { Main } from '@/templates/Main';
import { particlesConfig } from '@/utils/particlesConfig';

const TextManager = ({ result }) => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const [textValue, setTextValue] = useState(result);

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
      <ToastContainer
        position="top-right"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className={'m-10 flex h-[50vh] w-[90vw] flex-col gap-4 md:w-[50vw]'}>
        <button
          className={'rounded-lg bg-green-800 p-3 hover:bg-green-700'}
          onClick={() => {
            axios
              .post('/api/text', { data: textValue })
              .then(() => {
                toast('Text saved');
              })
              .catch((e) => {
                toast('Text save failed');
              });
          }}
        >
          Save Text
        </button>
        <textarea
          placeholder="Over here &#128557;"
          className={
            'arial mb-3 h-full w-full border border-blue-600 px-3 py-2 text-black focus:border-blue-500 focus:ring-blue-500'
          }
          value={textValue}
          onChange={(val) => {
            setTextValue(val.target.value);
          }}
        />
      </div>
    </Main>
  );
};

export async function getServerSideProps(context) {
  let result = '';
  try {
    result = fs.readFileSync('./public/memorize/text.txt').toString();
  } catch (e) {}
  return {
    props: {
      result,
    },
  };
}

export default TextManager;
