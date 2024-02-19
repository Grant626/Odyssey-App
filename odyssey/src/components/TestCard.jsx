import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Placeholder } from "react-bootstrap";
import { StarFill, StarHalf, Heart, HeartFill } from "react-bootstrap-icons";
import { getAuth } from "firebase/auth";
import axios from "axios";

export default class TestCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFavorite: false,
    };
  }

  validateFavorite = async () => {
    const { business } = this.props;
    const auth = getAuth();
    const user = auth.currentUser;
    let isFavorite = false;

    try {
      const res = await axios.get(`/favorites/${user.uid}/${business.id}`);
      if (res.data && res.data.isFavorite) {
        isFavorite = true;
      }
    } catch (error) {
      console.error(error);
    }

    this.setState({ isFavorite });
  };

  handleFavorite = async () => {
    const { business } = this.props;
    const auth = getAuth();
    const user = auth.currentUser;

    try {
      await axios.put(`/favorites/${user.uid}/${business.id}`, business);
      this.setState({ isFavorite: !this.state.isFavorite });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    // validateFavorite = async () => {
    //   const auth = getAuth();
    //   const user = auth.currentUser;
    // };

    // handles the height of card-img-overlay
    const handleImageLoad = (event) => {
      const img = event.target;
      const card = img.parentNode;
      card.style.height = `${img.offsetHeight}px`;

      // Set the size of the image overlay to match the size of the image
      const overlay = card.querySelector(".card-img-overlay");
      overlay.style.width = `${img.offsetWidth}px`;
      overlay.style.height = `${img.offsetHeight}px`;
    };
    // force the height of the image so all cards look uniform
    const forcedHeight = 300;

    // retrieves business object from props
    const { business } = this.props;

    return (
      <>
        {business ? (
          <div
            className="card text-white m-auto mb-4"
            style={{
              maxWidth: "400px",
              paddingLeft: "0px",
              paddingRight: "0px",
            }}
          >
            <div style={{ position: "relative" }}>
              <img
                src={business.image_url}
                className="card-img"
                alt={business.name}
                style={{
                  height: `${forcedHeight}px`,
                  objectFit: "cover",
                  borderBottomLeftRadius: "0",
                  borderBottomRightRadius: "0",
                }}
                onLoad={handleImageLoad}
              />
              <div className="card-img-overlay">
                <Button
                  variant="transparent"
                  className="position-absolute top-0 end-0 mt-3 me-3"
                  onClick={this.handleFavorite}
                >
                  {this.state.isFavorite ? (
                    <HeartFill className="text-danger" />
                  ) : (
                    <Heart className="text-danger" />
                  )}
                </Button>
                <div className="position-absolute bottom-0 mb-2">
                  <h3 className="card-title" id="Business-Name">
                    {business.name}
                  </h3>
                  <div
                    className="card-text flex align-items-center"
                    id="reviews-row"
                  >
                    <div className="" id="rating">
                      {[...Array(Math.floor(business.rating))].map((e, i) => (
                        <StarFill
                          key={i}
                          className="text-danger inline-block"
                        />
                      ))}
                      {business.rating % 1 > 0 && (
                        <StarHalf className="text-danger inline-block" />
                      )}
                      {[...Array(Math.floor(5 - business.rating))].map(
                        (e, i) => (
                          <StarFill
                            key={i}
                            className="text-dark inline-block"
                          />
                        )
                      )}
                    </div>
                    <div className="ps-2 underline" id="review-count">
                      {business.review_count}
                    </div>
                  </div>
                  <div className="card-text" id="categories">
                    {business.categories.map((category) => (
                      <span
                        key={category.alias}
                        className="badge bg-light text-muted me-2"
                      >
                        {category.title}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body  text-dark pt-2">
              <div className="row g-0">
                <div className="col flex">
                  <p className="me-1" id="city">
                    {business.location.city},
                  </p>
                  <p className="me-1" id="state">
                    {business.location.state}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Card
            className="m-auto mb-4"
            style={{ width: "400px", maxWidth: "400px" }}
          >
            <Placeholder
              as={Card.Img}
              animation="glow"
              style={{ height: "300px", objectFit: "cover" }}
            />
            <Card.Body>
              <Placeholder
                as={Card.Title}
                animation="glow"
                className="mb-3"
                style={{ width: "80%" }}
              >
                <Placeholder xs={10} />
              </Placeholder>
              <Placeholder as={Card.Text} animation="glow">
                <Placeholder xs={10} /> <Placeholder xs={8} />{" "}
                <Placeholder xs={6} /> <Placeholder xs={8} />
              </Placeholder>
            </Card.Body>
          </Card>
        )}
      </>
    );
  }
}
