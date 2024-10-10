import React from 'react';
import { Link } from 'react-router-dom';
import homepageVideo from './homepage_latest.mp4'; // Import your video file

const pages = [
  { id: 1, name: 'Hotel Contract Extract', path: '/hotel-contract' },
  { id: 2, name: 'Invoice Data Extract', path: '/invoice' },
];

const Home = () => {
  return (
    <div className="flex h-screen relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-[-1]">
        <video autoPlay loop muted playsInline className="min-w-full min-h-full object-cover">
          <source src={homepageVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="flex-1 flex flex-col justify-center items-center text-white z-10">
        <h1 className="text-9xl font-bold m-0">ProcDNA</h1>
      </div>
      <div className="flex-1 flex flex-col justify-center items-center p-5 gap-5 z-10">
        {pages.map(page => (
          <Link to={page.path} key={page.id} className="bg-white rounded-lg shadow-lg w-4/5 h-24 flex justify-center items-center text-center text-gray-800 no-underline transition-transform transform hover:-translate-y-1 hover:shadow-2xl">
            <h3 className="m-0">{page.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
