import { Card } from "react-bootstrap"
import { useEffect, useState,  } from "react"
import axios from 'axios';
import { getAuth } from "firebase/auth";

export default function BusinessCard(props) {

  const [auth, setAuth] = useState(getAuth())
  const [business, setBusiness] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)
  const [user, setUser] = useState(auth.currentUser)

  const [isLoading, setisLoading] = useState(true)

  const handleFavorite = () => {
    if(!isFavorite){
      setIsFavorite(true)
    }else{
      setIsFavorite(false)
    }
  }

  useEffect(() => {
    setAuth(getAuth())
    setUser(auth.currentUser)

    function checkFavorite() {
      axios.get(`http://localhost:8000/isfavorite/${user.uid}`,
      {
        bizID: props.bizID
      })
      .then(res => {
        setIsFavorite(res)
      })
      .catch(err => {
        console.log(err)
      })
      .then(() => {})
    }

    function loadData() {
      axios.get(`http://localhost:8000/biz/${props.bizID}`)
      .then(res => {
        setisLoading(false);
        setBusiness(res.data);
      })
      .catch(err => {
        console.log(err)
      })
      .then(() => {})
    }

    loadData();

  }, [auth.currentUser, props.bizID, props.token, user.uid])

  return(
    <>
      <div className="flex justify-center mx-5 m-2">
          {isLoading ? (
            <Card className="p-4 w-[600px]">
              Loading...
              <i class="fa-regular fa-spinner-third"></i>
            </Card>
          ) : (
          <Card className="p-4 w-[600px]">
          <div className="flex flex-row">
            <h3>{business.name}</h3>
            {business && business.hours[0].is_open_now &&
              <i className="m-1 mx-2 text-sm text-green-600">Open</i>
            }
            {business && !business.hours[0].is_open_now &&
              <i className="m-1 mx-2 text-sm text-red-600">Closed</i>
            }        
          </div>
          <div className="flex flex-row">
            {business && business.rating && business.rating > 0 &&
              Array.from({length: Math.floor(business.rating)}, () =>
                <i className="fa-solid fa-star" style={{color: "#d64000",}}></i>
              )
            }
            {business && (business.rating - Math.floor(business.rating)) >= 0.5 && 
              <i className="fa-solid fa-star-half" style={{color: "#d64000",}}></i>
            }
            <p className="text-xs mb-2">
              ({business.rating})
              ({business.review_count} reviews)
            </p>
          </div>
          <div className="flex flex-row">
            {business.price && business.price.length > 0 &&
              Array.from({length: business.price.length}, () =>
                <i className="fa-solid fa-dollar-sign py-1" style={{color: "#1fd14c",}}></i>
              ) 
            }
          </div>
          <div className="flex flex-row">
          {business &&
            <i className="m-0 text-gray-600">{business.location.city}, {business.location.state}</i>
          } 
          </div>
          <div className="flex flex-row">
            <p>Hours:</p>
            {business.hours && business.hours.length > 0 &&
              <div className="m-1 mx-2">
                {business.hours[0].open[0] ? (
                  <p className="m-0 text-xs">
                    Mon: {business.hours[0].open[0].start} - {business.hours[0].open[0].end}
                  </p>
                ) : (
                  <p className="m-0 text-xs">
                    Mon: closed
                  </p>
                )}
                {business.hours[0].open[1] ? (
                  <p className="m-0 text-xs">
                    Tue: {business.hours[0].open[1].start} - {business.hours[0].open[1].end}
                  </p>
                ) : (
                  <p className="m-0 text-xs">
                    Tue: closed
                  </p>
                )}
                {business.hours[0].open[2] ? (
                  <p className="m-0 text-xs">
                    Wed: {business.hours[0].open[2].start} - {business.hours[0].open[2].end}
                  </p>
                ) : (
                  <p className="m-0 text-xs">
                    Wed: closed
                  </p>
                )}
                {business.hours[0].open[3] ? (
                  <p className="m-0 text-xs">
                    Thu: {business.hours[0].open[3].start} - {business.hours[0].open[3].end}
                  </p>
                ) : (
                  <p className="m-0 text-xs">
                    Thu: closed
                  </p>
                )}
                {business.hours[0].open[4] ? (
                  <p className="m-0 text-xs">
                    Fri: {business.hours[0].open[4].start} - {business.hours[0].open[4].end}
                  </p>
                ) : (
                  <p className="m-0 text-xs">
                    Sun: closed
                  </p>
                )}
                {business.hours[0].open[5] ? (
                  <p className="m-0 text-xs">
                    Sat: {business.hours[0].open[5].start} - {business.hours[0].open[5].end}
                  </p>
                ) : (
                  <p className="m-0 text-xs">
                    Sat: closed
                  </p>
                )}
                {business.hours[0].open[6] ? (
                  <p className="m-0 text-xs">
                    Sun: {business.hours[0].open[6].start} - {business.hours[0].open[6].end}
                  </p>
                ) : (
                  <p className="m-0 text-xs">
                    Sun: closed
                  </p>
                )}
              </div>
            }  
          </div>

          <div className="absolute top-0 right-0 m-2">
            <button onClick={handleFavorite}>
              {isFavorite ? (
                <i className="m-3 fa-solid fa-lg fa-heart" style={{color: 'red',}}></i>
              ) : (
                <i className="m-3 fa-regular fa-lg fa-heart" style={{color: 'red',}}></i>
              )}
            </button>
          </div>
          </Card>
          )}
      </div>
    </>
  )
}