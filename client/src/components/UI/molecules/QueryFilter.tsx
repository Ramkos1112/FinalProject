import { useContext, useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import styled from "styled-components";
import QuestionsContext from "../../contexts/QuestionContext.tsx";
import { QuestionsContextType } from "../../../types.ts";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 32px;
  position: relative;

  .dropdown {
    position: relative;
    width: 200px;
    font-family: "Times New Roman", Times, serif;
    font-weight: 600;
    color: var(--color-secondary);
    cursor: pointer;
  }

  .dropdown-header {
    padding: 8px;
    background-color: var(--color-background);
    border: 2px solid var(--color-secondary);
    border-radius: 6px;
    user-select: none;
  }

  .dropdown-menu {
    position: absolute;
    width: 200px;
    background-color: var(--color-background);
    border: 2px solid var(--color-secondary);
    border-radius: 6px;
    z-index: 999;
    margin-top: 2px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-height: 200px;
    overflow-y: auto;
  }

  .filterClear {
    display: flex;
    justify-content: center;
    gap: 10px;
    > button {
      background-color: var(--color-background);
      border: 2px solid var(--color-secondary);
      font-family: "Times New Roman", Times, serif;
      font-weight: 600;
      padding: 5px 10px;
      cursor: pointer;
    }

    > button:hover {
      background-color: #cc7e7e;
      transition: 0.3s;
    }
  }
`;

const QuestionsFilter = () => {
  const { changeFilter } = useContext(QuestionsContext) as QuestionsContextType;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const availableTags = ["Learning", "Advice", "Opinions", "Inspiration", "Comissions", "SFW"];

  const formik = useFormik({
    initialValues: {
      filter_tags: [] as string[],
    },
    onSubmit(values) {
      const params = new URLSearchParams();
      values.filter_tags.forEach(tag => params.append("filter_tags", tag));
      changeFilter(params.toString());
    },
  });

  const handleCheckboxChange = (tag: string) => {
    const current = formik.values.filter_tags;
    if (current.includes(tag)) {
      formik.setFieldValue("filter_tags", current.filter(t => t !== tag));
    } else {
      formik.setFieldValue("filter_tags", [...current, tag]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <StyledForm onSubmit={formik.handleSubmit}>
      <div className="dropdown" ref={dropdownRef}>
        <div className="dropdown-header" onClick={() => setDropdownOpen(!dropdownOpen)}>
          {formik.values.filter_tags.length > 0
            ? formik.values.filter_tags.join(", ")
            : "Select tags"}
        </div>

        {dropdownOpen && (
          <div className="dropdown-menu">
            {availableTags.map(tag => (
              <label key={tag}>
                <input
                  type="checkbox"
                  checked={formik.values.filter_tags.includes(tag)}
                  onChange={() => handleCheckboxChange(tag)}
                />{" "}
                {tag}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="filterClear">
        <button type="submit">Filter</button>
        <button
          type="button"
          onClick={() => {
            formik.resetForm();
            formik.handleSubmit();
          }}
        >
          Clear
        </button>
      </div>
    </StyledForm>
  );
};

export default QuestionsFilter;