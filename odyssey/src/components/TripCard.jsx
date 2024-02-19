import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "react-bootstrap";

function TripCard(props) {
  const [Trip, setTrip] = useState([]);

  useEffect(() => {
    function loadData() {
      axios
        .get(`http://localhost:8000/biz/${props.bizID}`, {
          headers: {
            Authorization: "Bearer " + props.token,
          },
        })
        .then((res) => {
          setTrip(res.data.slice(0, 5));
        })
        .catch((err) => {
          console.log(err);
        });
    }

    loadData();
  }, [props.bizID, props.token]);

  return (
    <>
      <div className="flex justify-center mx-5">
        <Card className="p-4 w-[600px]">
          <div className="flex flex-row">
            <h3>Trip Card</h3>
          </div>
          <div>
            {Trip.map((business) => (
              <div key={business._id} className="business">
                {business.name}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

export default TripCard;
