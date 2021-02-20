import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Card, message, Upload } from 'antd';
import React, { useState } from 'react';

function getBase64(
  img: Blob,
  callback: { (imgUrl: any): void; (arg0: string | ArrayBuffer | null): any },
) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

const ETheme = () => {
  const [loading] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  const beforeUpload = (file: File) => {
    // 文件内容校验
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }

    // 转码并预览
    getBase64(file, (imgUrl: any) => {
      setImageUrl(imgUrl);
    });

    // 把文件写入资源路径

    return false;
    // return isJpgOrPng && isLt2M;
  };
  // const handleChange = (info: any) => {
  //   if (info.file.status === 'uploading') {
  //     setLoading(true);
  //     return;
  //   }
  //   if (info.file.status === 'done') {
  //     // Get this url from response in real world.
  //     getBase64(info.file.originFileObj, (imgUrl: any) => {
  //       setLoading(false);
  //       setImageUrl(imgUrl);
  //     });
  //   }
  // };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <div>
      <Card title="登录背景图片替换">
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          beforeUpload={beforeUpload}
          // onChange={handleChange}
        >
          {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
        </Upload>
      </Card>
    </div>
  );
};
export default ETheme;
