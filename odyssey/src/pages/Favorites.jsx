import { LoginBtn } from '../components';
import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import TestCard from '../components/TestCard';

export default function Favorites(props) {
  //get auth token from state
  const authToken = props.token;

  //useState for checking authorization status
  const [authorized, setAuthorized] = useState(
    false || window.localStorage.getItem('auth') === 'true'
  );
  const [auth, setAuth] = useState(getAuth());

  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    if (authToken) {
      setAuthorized(true);
    }
    setAuth(getAuth());
    setUser(auth.currentUser);

    const loadFavorites = () => {
      if (auth.currentUser) {
        axios
          .get(`/favorites/${auth.currentUser.uid}`)
          .then((res) => {
            setFavorites(res.data);
          })
          .catch((err) => {
            console.log(err);
          })
          .then(() => {});
      }
    };

    if (authorized) {
      loadFavorites();
    }
  }, [auth.currentUser, authToken, authorized]);

  return (
    <>
      {authorized ? (
        <div
          className="bg-cover h-lvh w-100"
          style={{
            backgroundImage: "url('../images/beach.jpg')",
          }}>
          <div className="container-fluid h-screen pt-5 pb-4">
            <div className="flex flex-col justify-center">
              <h1 className="m-5 text-center">Your favorite businesses!</h1>

              <div className="row m-3 g-1">
                {favorites &&
                  favorites.length > 0 &&
                  favorites.map((biz) => <TestCard business={biz} />)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className=""
          style={{
            backgroundImage: "url('../images/beach.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>
          <div className="text-center h-screen flex flex-col justify-center items-center ">
            Please login to see your favorites!
            <LoginBtn />
          </div>
        </div>
      )}
    </>
  );
}
