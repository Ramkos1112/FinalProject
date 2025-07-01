import { useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import styled from "styled-components";

import { AnswersContextType } from "../../../types";
import AnswersContext from "../../contexts/RepliesContext.tsx";

type Props = {
  questionId: string;
};

const StyledDiv = styled.div`
  > form {
    display: flex;
    flex-direction: column;
    > textarea {
      margin-bottom: 10px;
      padding: 10px;
      border-radius: 10px;
      border: none;
      height: 80px;
      font-weight: 600;
      background-color: var(--color-secondary);
      font-family: "Times New Roman", Times, serif;
    }
    > textarea::placeholder {
      color: var(--color-primary);
    }
    .buttons {
      display: flex;
      gap: 10px;
      padding-bottom: 20px;
      justify-content: center;
    }
    .add,
    .cancel {
      margin: 10px 0px;
      background-color: var(--color-background);
      border: none;
      border-radius: 12px;
      padding: 0 10px;
      height: 30px;
      width: 100px;
      font-weight: 600;
      box-shadow: 0 1px 2px var(--color-secondary);
      font-family: "Times New Roman", Times, serif;
      cursor: pointer;
    }
    .add:hover {
      background-color: var(--color-secondary);
      color: var(--color-primary);
    }
    .cancel:hover {
      background-color: crimson;
      color: var(--color-primary);
    }
  }
`;

const ReplyInput = ({ questionId }: Props) => {
  const { addNewAnswer } = useContext(AnswersContext) as AnswersContextType;

  const formik = useFormik({
    initialValues: {
      body: "",
    },
    validationSchema: Yup.object({
      body: Yup.string().required("Reply cannot be empty"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const result = await addNewAnswer({ body: values.body });
      console.log("Reply result:", result);

      if ("success" in result) {
        resetForm();
      } else {
        alert(result.error);
      }
    },
  });

  return (
    <StyledDiv>
      <form onSubmit={formik.handleSubmit}>
        <textarea
          name="body"
          placeholder="Write a reply..."
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.body}
        />
        {formik.touched.body && formik.errors.body && (
          <p style={{ color: "red" }}>{formik.errors.body}</p>
        )}
        <div className="buttons">
          <button className="add" type="submit">Reply</button>
          <button className="cancel" type="reset" onClick={formik.handleReset}>Cancel</button>
        </div>
      </form>
    </StyledDiv>
  );
};

export default ReplyInput;