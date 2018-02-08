import React from "react";

const Creators = () => {
  const devs = [
    {
      name: "Wadah Adlan",
      pic: "https://avatars2.githubusercontent.com/u/27829214?s=400&v=4",
      email: "wadahadlan@gmail.com",
      github: "https://github.com/dawah-wadah",
      linkedin: "https://www.linkedin.com/in/wadahadlan",
      portfolio: "http://www.wadah.us"
    },
    {
      name: "Vlad Sasnouski",
      pic: "http://vsasnouski.me/images/hs.jpg",
      email: "usasnouski@gmail.com",
      github: "https://github.com/usasnouski",
      linkedin: "https://www.linkedin.com/in/vlad-sasnouski",
      portfolio: "http://www.vsasnouski.me",
      text: ""
    }
  ];

  const devSection = devs.map(dev => (
    <div className="developer">
      <div className="dev-photo">
        <img src={dev.pic} />
      </div>
      <div className="dev-info">{dev.name}</div>
      <div className="links">
        <a className="link" href={dev.portfolio}>
          <img src="https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/dev-128.png" />
        </a>
        <a className="link" href={dev.github}>
          <img src="https://cdn0.iconfinder.com/data/icons/flat-social-media-icons-set-round-style-1/550/github-128.png" />
        </a>
        <a className="link" href={dev.linkedin}>
          <img src="https://cdn1.iconfinder.com/data/icons/logotypes/32/circle-linkedin-128.png" />
        </a>
      </div>
    </div>
  ));

  return (
    <div className="creators-main">
      <section className="whoweare">
        <div className="wrapper">
          <div className="title">
            <h2>Hello there!</h2>
          </div>
          <div className="brief-info">
            <p>
              We are software developers and occasional CS:GO players from New
              York. This project was created because we wanted to have a source
              that would help us identify our most common and reccuring mistakes
              in the game. Originally it all started with the heatmap, but we
              couldn't ignore the amount and variety of data we had extracted
              from our games and decided to go further and visualize that data.
              <br />
              We really hope that other players will find this site interesting
              and helpful, as well.
            </p>
          </div>
        </div>
      </section>
      <section className="developers">
        <div className="dev-wrap wrapper">{devSection}</div>
      </section>
    </div>
  );
};

export default Creators;
