import React, { useState, useEffect } from "react";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ImgFile } from "../../../shared/types";
import ErrorMessage from "../../UI/ErrorMessage";

interface SelectImgProps {
  selectedImg: ImgFile;
  setSelectedImg: React.Dispatch<React.SetStateAction<ImgFile>>;
  errorMessage: string;
  displayErrors: boolean;
}

export const convertBase64 = (file: File) => {
  return new Promise<string | ArrayBuffer | null | Blob | File>(
    (resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    }
  );
};

const SelectImg = ({
  selectedImg,
  setSelectedImg,
  errorMessage,
  displayErrors,
}: SelectImgProps) => {
  const [hideErrorStyles, setHideErrorStyles] = useState(true);

  useEffect(() => {
    setHideErrorStyles(!displayErrors);
  }, [displayErrors]);

  const handleFileRead = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setHideErrorStyles(true);

    const files = e.target.files;

    if (files) {
      const file = files[0];
      const base64 = await convertBase64(file);
      setSelectedImg({ name: file.name, file: base64 });
    }
  };

  return (
    <div className="field mt-5">
      <div className="control">
        <div className="file">
          <label className="file-label">
            <input
              className="file-input"
              type="file"
              accept="image/png, image/jpeg"
              name="resume"
              onChange={handleFileRead}
            />
            <span className="file-cta">
              <span className="file-icon">
                <FontAwesomeIcon icon={faUpload} />
              </span>
              <span className="file-label">Choose a file…</span>
            </span>
            <span className="file-name">{selectedImg.name}</span>
          </label>
        </div>
      </div>
      <ErrorMessage message={errorMessage} hideErrorMessage={hideErrorStyles} />
    </div>
  );
};

export default SelectImg;
