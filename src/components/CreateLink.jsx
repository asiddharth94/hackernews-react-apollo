import { useState } from "react";

import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const CreateLink = () => {
  // For automatic redirect from the CreateLink component to the LinkList component
  // after a mutation is performed.
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    description: "",
    url: "",
  });

  const CREATE_LINK_MUTATION = gql`
    mutation PostMutation($description: String!, $url: String!) {
      post(description: $description, url: $url) {
        id
        createdAt
        url
        description
      }
    }
  `;

  // When we use the useMutation hook, we need to destructure out a function that can be used
  // to call the mutaton. That’s what createLink is in the code block above.
  // We’re now free to call the function whenever we need to when the component renders.

  const [createLink] = useMutation(CREATE_LINK_MUTATION, {
    variables: {
      description: formState.description,
      url: formState.url,
    },
    onCompleted: () => navigate("/"),
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createLink();
        }}
      >
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={formState.description}
            onChange={(e) => {
              setFormState({ ...formState, description: e.target.value });
            }}
            type="text"
            placeholder="A description for the link"
          />
          <input
            className="mb2"
            value={formState.url}
            onChange={(e) => {
              setFormState({ ...formState, url: e.target.value });
            }}
            type="text"
            placeholder="The URL for the link"
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateLink;
