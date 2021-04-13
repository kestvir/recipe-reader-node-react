import React from "react";
import { Link } from "react-router-dom";

interface DocumentationProps {}

const Documentation: React.FC<DocumentationProps> = ({}) => {
  return (
    <section className="section">
      <div className="container">
        <div className="box">
          <h3 className="title has-text-centered">Documentation</h3>
          <div className="content">
            <h3 className="title is-size-5">
              How does the voice assistant work?
            </h3>
            <p>
              This app uses{" "}
              <a href="https://alan.app/" target="_blank">
                Alan AI
              </a>{" "}
              🤖 for its voice assistance capabilities.
            </p>
            <h3 className="title is-size-5">
              What can the voice assistant be used for?
            </h3>
            <p>
              The voice assistant can be used for navigating 🧭 around the app.
              More importantly, it can also be used for getting the list of
              ingredients and instructions of a particular recipe. 🥧
            </p>
            <h3 className="title is-size-5">
              How to use voice assistance for navigating around the app?
            </h3>
            <p>
              There are three comands for navigating around the app:
              <ul>
                <li>
                  Say: <span className="has-text-primary">Go to home</span> for
                  navigating to the home page.
                </li>
                <li>
                  Say: <span className="has-text-primary">Go to recipes</span>{" "}
                  to navigate to the recipes page.
                </li>
                <li>
                  Say:{" "}
                  <span className="has-text-primary">Go to documentation</span>{" "}
                  to navigate to the documentation page.
                </li>
                <li>
                  Say: <span className="has-text-primary">Go back</span> to
                  navigate to the previous page you have visited.
                </li>
                <li>
                  When the{" "}
                  <Link to="/recipes" target="_blank">
                    Manage Recipes
                  </Link>{" "}
                  page is open, say:{" "}
                  <span className="has-text-primary">
                    Open recipe "YOUR RECIPE TITLE"
                  </span>{" "}
                  to open to a specific recipe details page.
                </li>
              </ul>
            </p>
            <h3 className="title is-size-5">
              How to use voice assistantce for cooking?
            </h3>
            <p>
              To use the voice assistantce for cooking you need to open the{" "}
              <Link to="/recipes" target="_blank">
                Manage Recipes
              </Link>{" "}
              and say:{" "}
              <span className="has-text-primary">
                Read "YOUR RECIPE TITLE" recipe (ingredients or instructions)
              </span>{" "}
              to get the list of (ingredients or instructions) read. 🤓📚
            </p>
            <h3 className="title is-size-5">How to stop voice assistance?</h3>
            <p>
              To stop voice assistance you can say any of the commands below:
            </p>
            <ul>
              <li>Thanks Alan</li>
              <li>Thank you Alan</li>
              <li>Alan thank you</li>
              <li> Alan thanks</li>
              <li> Stop Alan</li>
              <li> Alan stop</li>
            </ul>
            <h3 className="title is-size-5">
              What else can be done with the voice assistance?
            </h3>
            <p>
              You can also have a chit-chat with the voice assistant by asking
              simple questions like:{" "}
              <span className="has-text-primary">How are you?</span>{" "}
              <span className="has-text-primary">When were you born?</span>{" "}
              <span className="has-text-primary">Will you marry me?</span> and
              so on... 😀
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Documentation;
