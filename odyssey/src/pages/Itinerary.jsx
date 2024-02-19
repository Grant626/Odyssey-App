import { LoginBtn } from '../components';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import TestCard from '../components/TestCard';

const url = 'http://localhost:3000';

export default function Itinerary(props) {
  //get auth token from state
  const authToken = props.token;
  //useState for checking authorization status
  const [authorized, setAuthorized] = useState(
    false || window.localStorage.getItem('auth') === 'true'
  );

  // get query parameters
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // get destination, startDate, endDate from query parameters
  const destination = queryParams.get('destination');
  // const startDate = queryParams.get("startDate");
  // const endDate = queryParams.get("destination");

  // Initialize states for business id's of place categories
  const [hotelBizID, setHotelBizID] = useState('');
  const [breakfastBizID, setBreakfastBizID] = useState('');
  const [lunchBizID, setLunchBizID] = useState('');
  const [activityBizID, setActivityBizID] = useState('');
  const [dinnerBizID, setDinnerBizID] = useState('');

  useEffect(() => {
    if (authToken) {
      setAuthorized(true);
    }
    const fetchData = async () => {
      try {
        // get Hotel from backend
        const hotelResponse = await axios.get(`${url}/search/Hotel/${destination}`);
        if (hotelResponse.data.length > 0) {
          setHotelBizID(hotelResponse.data[0]);
        }

        // get Breakfast from backend
        const breakfastResponse = await axios.get(`${url}/search/Breakfast/${destination}`);
        if (breakfastResponse.data.length > 0) {
          setBreakfastBizID(breakfastResponse.data[0]);
        }

        // get Lunch from backend
        const lunchResponse = await axios.get(`${url}/search/Lunch/${destination}`);
        if (lunchResponse.data.length > 0) {
          setLunchBizID(lunchResponse.data[0]);
        }

        // get Activity from backend
        const activityResponse = await axios.get(`${url}/search/Activity/${destination}`);
        if (activityResponse.data.length > 0) {
          setActivityBizID(activityResponse.data[0]);
        }

        // get Dinner from backend
        const dinnerResponse = await axios.get(`${url}/search/Dinner/${destination}`);
        if (dinnerResponse.data.length > 0) {
          setDinnerBizID(dinnerResponse.data[0]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {authorized ? (
        <div
          className=""
          style={{
            backgroundImage: "url('../images/rainbow-hills.jpg')",
            backgroundSize: 'auto',
            backgroundPosition: 'center',
          }}>
          <div className="container-fluid pt-5 pb-4">
            <h1 className="text-center text-3xl h1">Your Current Itinerary</h1>

            <div className="row justify-center mb-3 ">
              <p className="m-0 text-center m-2">Hotel Recommendation:</p>
              <TestCard
                business={hotelBizID}
                token={authorized}
              />
            </div>

            <div className="row justify-center mb-3">
              <p className="m-0 text-center m-2">Breakfast Recommendation:</p>
              <TestCard
                business={breakfastBizID}
                token={authorized}
              />
            </div>

            <div className="row justify-center mb-3">
              <p className="m-0 text-center m-2">Lunch Recommendation:</p>
              <TestCard
                business={lunchBizID}
                token={authorized}
              />
            </div>

            <div className="row justify-center mb-3">
              <p className="m-0 text-center m-2">Activity Recommendation:</p>
              <TestCard
                business={activityBizID}
                token={authorized}
              />
            </div>

            <div className="row justify-center mb-3">
              <p className="m-0 text-center m-2">Dinner Recommendation:</p>
              <TestCard
                business={dinnerBizID}
                token={authorized}
              />
            </div>
          </div>
        </div>
      ) : (
        <div
          className=""
          style={{
            backgroundImage: "url('../images/rainbow-hills.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>
          <div className="text-center h-screen flex flex-col justify-center items-center ">
            <h1 className="text-3xl font-bold mb-5">Please Login to start your journey</h1>
            <div className=" p-5 ">
              <LoginBtn />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
