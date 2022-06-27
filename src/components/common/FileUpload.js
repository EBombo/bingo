import React, { useEffect, useRef, useState } from "reactn";
import styled from "styled-components";
import { Image } from "./Image";
import get from "lodash/get";
import { CloudUploadOutlined } from "@ant-design/icons";
import { ButtonAnt } from "../form";
import { useResizeImage, useUploadToStorage } from "../../hooks";
import { Icon } from "./Icons";
import defaultTo from "lodash/defaultTo";
import { config } from "../../firebase";

export const FileUpload = (props) => {
  const { resize } = useResizeImage();
  const { uploadToStorageAndGetURL } = useUploadToStorage();

  const inputRef = useRef(null);

  const [previewFile, setPreviewFile] = useState(get(props, "file", null));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    props.file && setPreviewFile(props.file);
  }, [props.file]);

  const manageFile = async (event) => {
    if (!event.target.files || event.target.files.length === 0 || !event.target.files[0]) return setPreviewFile(null);

    setLoading(true);

    //const sizeFile=event.target.files[0].size;
    //if(sizeFile>=props.limitMb)return notfication;
    console.log("event.target.files", event.target.files);

    const file = event.target.files[0];
    const fileSuffix = file.name.split(".")[1];
    const type = file.type;

    const response = defaultTo(type, "image").includes("image")
      ? await resizeImage(file, fileSuffix, type)
      : await actionFile(file, fileSuffix, type);

    setLoading(false);

    if (props.afterUpload) return props.afterUpload(response);
    if (props.onChange) return props.onChange(response);
  };

  const actionFile = async (file, fileSuffix, type) => {
    setPreviewFile(file.name);

    return props.afterUpload ? await uploadFile(file, fileSuffix, null, type) : file;
  };

  const resizeImage = async (file, fileSuffix, type) => {
    const sizes = get(props, "sizes", "500x500").split(",");

    setPreviewFile(URL.createObjectURL(file));

    const promisesImages = sizes.map(async (size) => {
      const width = parseInt(size.split("x")[0]);
      const height = parseInt(size.split("x")[1]);

      const images64 = await resize(file, width, height);

      return props.afterUpload
        ? {
            url: await uploadFile(images64.split(",")[1], fileSuffix, size, type),
            file,
            size,
            type,
          }
        : {
            image: images64.split(",")[1],
            filePath: props.filePath,
            fileName: `${props.fileName}_${size}`,
            fileSuffix,
            size,
            type,
          };
    });

    return await Promise.all(promisesImages);
  };

  const uploadFile = async (fileBase64, fileSuffix, size, type, fileName = `${props.fileName}_${size}`) =>
    await uploadToStorageAndGetURL(fileBase64, props.filePath, fileName, fileSuffix, props.bucket, null, type);

  return (
    <UploadContainer>
      {previewFile ? (
        <div className="image-container" onClick={() => inputRef.current.click()}>
          {get(props, "accept", "image/*").includes("image") ? (
            <div
              className="w-[135px] h-[110px] flex items-center flex-col justify-center bg-white rounded-[10px]"
              onClick={() => inputRef.current.click()}
            >
              <Image
                src={previewFile}
                height="50px"
                width="50px"
                desktopHeight="100px"
                desktopWidth="100px"
                margin="0 auto"
                borderRadius="5px"
              />
            </div>
          ) : (
            <>
              {previewFile} <Icon type="check-circle" />
            </>
          )}
        </div>
      ) : (
        <div
          className="w-[120px] h-[80px] md:w-[135px] md:h-[110px] flex items-center flex-col justify-center bg-white rounded-[10px]"
          onClick={() => inputRef.current.click()}
        >
          <Image
            src={`${config.storageUrl}/resources/gift.png`}
            width="36px"
            height="36px"
            desktopWidth="66px"
            desktopHeight="66px"
            size="contain"
            margin="0 auto"
          />
          <div className="text-['Lato'] font-[500] text-[13px] leading-[16px] text-primary">Agregar imagen</div>
        </div>
      )}
      <div className="input-container">
        <input
          type="file"
          accept={props.accept || "image/*" || "application/pdf"}
          ref={inputRef}
          onChange={manageFile}
          hidden
        />
      </div>
    </UploadContainer>
  );
};

const UploadContainer = styled.div`
  width: 200px;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  flex-direction: column;

  .image-container {
    color: ${(props) => props.theme.basic.success};
  }

  .dashed {
    cursor: pointer;
    height: 100px;
    width: 100px;
    border: 1px dashed ${(props) => props.theme.basic.grayLighten};
    display: flex;
    justify-content: center;
    align-items: center;

    svg {
      width: 35px;
      height: 35px;
      color: ${(props) => props.theme.basic.grayLighten};
    }
  }

  .input-container {
    margin-top: 0.5rem;
  }
`;
