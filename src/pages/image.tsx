import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';
import imageCompression from 'browser-image-compression';
import React, { useCallback, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import type { Engine } from 'tsparticles-engine';

import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import { particlesConfig } from '@/utils/particlesConfig';

const Image = () => {
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File>();
  const [dirs, setDirs] = useState([]);
  const relist = () => {
    axios.get('/api/relist').then((val) => {
      setDirs(val.data);
    });
  };
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);
  const handleUpload = async () => {
    setUploading(true);
    try {
      if (!selectedFile) return;
      const formData = new FormData();
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 1000,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(selectedFile, options);
      formData.append('myImage', compressedFile);
      const { data } = await axios.post('/api/upload', formData);
      toast(`OK uploaded!`);
    } catch (e) {
      toast(`Upload fail!`);
    }
    relist();
    setUploading(false);
  };
  useEffect(() => {
    relist();
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
      <div className="mx-auto max-w-4xl space-y-6 p-20">
        <label>
          <input
            type="file"
            hidden
            onChange={({ target }) => {
              try {
                if (target.files) {
                  const file = target.files[0];
                  setSelectedImage(URL.createObjectURL(file));
                  setSelectedFile(file);
                }
              } catch (e) {}
            }}
          />
          <div className="flex aspect-video w-40 cursor-pointer items-center justify-center rounded border-2 border-dashed">
            {selectedImage ? (
              <img src={selectedImage} alt="" />
            ) : (
              <span>Select Image</span>
            )}
          </div>
        </label>
        <button
          onClick={handleUpload}
          disabled={uploading}
          style={{ opacity: uploading ? '.5' : '1' }}
          className="w-32 rounded bg-red-600 p-3 text-center text-white"
        >
          {uploading ? 'Uploading..' : 'Upload'}
        </button>
        <div className={'text-3xl font-bold'}>Available Images:</div>
        <div className="mt-20 flex flex-wrap content-center items-center justify-center gap-3 text-center">
          {dirs.map((item, keyItem) => (
            <div
              className="flex flex-col content-center items-center text-center"
              key={keyItem}
            >
              <div>{item}</div>
              <img
                onError={(event) => {
                  // @ts-ignore
                  // eslint-disable-next-line no-param-reassign
                  event.target.style.display = 'none';
                }}
                className={
                  'unselectable mt-3 w-[40vw] rounded-lg md:w-[20vw] xl:w-[15vw] '
                }
                src={`/memorize/images/${item}`}
                alt={'naruto'}
              ></img>
              <button
                className={'rounded-lg bg-red-800 p-3 hover:bg-red-700'}
                onClick={() => {
                  axios.post('/api/remove', { filename: item }).then(() => {
                    relist();
                  });
                }}
              >
                Delete this image
              </button>
            </div>
          ))}
        </div>
      </div>
    </Main>
  );
};
export default Image;
