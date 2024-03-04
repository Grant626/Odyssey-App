import { Button, Form, Card, Container, Row, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrefTagSearch, LoginBtn } from '../components';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Explore(props) {
  //get auth token from state
  const authToken = props.token;
  //useState for checking authorization status
  const [authorized, setAuthorized] = useState(
    false || window.localStorage.getItem('auth') === 'true'
  );

  //State and callback functions for the PrefTagSearch component
  const [preferenceData, setPreferenceData] = useState({});
  const handleUpdate = (title, tags) => {
    //change to array of strings instead of array of objects:
    const formattedTagData = tags.map((tag) => tag.value);
    const key = title
      .replace(/restaurant/gi, '')
      .trim()
      .toLowerCase();
    //setting preferenceData = formmated data with lowercase titles
    setPreferenceData((prevData) => ({ ...prevData, [key]: formattedTagData }));
    console.log(preferenceData);
  };

  useEffect(() => {
    if (authToken) {
      setAuthorized(true);
    }
  }, [authToken, setAuthorized]);

  // set form states
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // navigation hook to navigate to itinerary page
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // reset form errors in UI
    setFormErrors({});

    // form validation
    let errors = {};
    if (!destination) errors.destination = 'Destination is required.';
    if (!startDate) errors.startDate = 'Start date is required.';
    if (!endDate) errors.endDate = 'End date is required.';
    if (startDate && endDate && startDate > endDate)
      errors.date = 'End date should be after start date.';

    // if there are any errors in the form, stop form submission and set errors
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // query string with data from form
    const query = `destination=${destination}&startDate=${startDate}&endDate=${endDate}`;
    // navigate to itinerary page passing query string
    navigate(`/itinerary?${query}`);
  };

  return (
    <>
      {authorized ? (
        <div
          className=""
          style={{
            backgroundImage: "url('../images/lake-boats.jpg')",
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
          }}>
          <div className="text-center flex flex-col justify-center items-center ">
            <Container>
              <Col
                lg={6}
                className="mx-auto">
                <h1 className="text-center m-5 text-3xl h1">Start Your Trip</h1>

                <div className="flex justify-center m-5">
                  <Card
                    className="p-4 w-[600px]"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
                    <Form onSubmit={handleSubmit}>
                      <Form.Group
                        className="mb-3"
                        id="formDest">
                        <Form.Label>Destination</Form.Label>
                        <Form.Control
                          className="w-1/2"
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          }}
                          type=""
                          placeholder="City or Zipcode"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                        />
                        {formErrors.destination && (
                          <div
                            className="error"
                            style={{ color: '#ff0033' }}>
                            {formErrors.destination}
                          </div>
                        )}
                        From:
                        <Form.Control
                          id="dateFrom"
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          }}
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                        {formErrors.startDate && (
                          <div
                            className="error"
                            style={{ color: '#ff0033' }}>
                            {formErrors.startDate}
                          </div>
                        )}
                        <Form.Label>To:</Form.Label>
                        <Form.Control
                          id="dateTo"
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          }}
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                        {formErrors.endDate && (
                          <div
                            className="error"
                            style={{ color: '#ff0033' }}>
                            {formErrors.endDate}
                          </div>
                        )}
                        {formErrors.date && (
                          <div
                            className="error"
                            style={{ color: '#ff0033' }}>
                            {formErrors.date}
                          </div>
                        )}
                      </Form.Group>
                    </Form>
                  </Card>
                </div>
                <div className="flex justify-center m-5">
                  <PrefTagSearch
                    title="Hotel"
                    onUpdate={handleUpdate}
                  />
                </div>
                <div className="flex justify-center m-5">
                  <PrefTagSearch
                    title="Breakfast Restaurant"
                    onUpdate={handleUpdate}
                  />
                </div>
                <div className="flex justify-center m-5">
                  <PrefTagSearch
                    title="Lunch Restaurant"
                    onUpdate={handleUpdate}
                  />
                </div>
                <div className="flex justify-center m-5">
                  <PrefTagSearch
                    title="Activity"
                    onUpdate={handleUpdate}
                  />
                </div>
                <div className="flex justify-center m-5">
                  <PrefTagSearch
                    title="Dinner Restaurant"
                    onUpdate={handleUpdate}
                  />
                </div>

                <div className="flex justify-center m-5">
                  <Button
                    className="align-self-center"
                    size="lg"
                    variant="dark"
                    type="submit"
                    onClick={handleSubmit}>
                    Embark
                  </Button>
                </div>
              </Col>
            </Container>
          </div>
        </div>
      ) : (
        //

        <div
          className=""
          style={{
            backgroundImage: "url('../images/lake-boats.jpg')",
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
