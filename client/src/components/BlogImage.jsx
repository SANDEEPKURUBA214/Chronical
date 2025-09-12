import { IKImage, IKContext } from "imagekitio-react";

const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

export default function BlogImage({ path, className = "" }) {
  const isFullUrl = path.startsWith("http");
  if (isFullUrl) {
    return (
      <img
        src={path}
        alt="blog"
        className={`w-full max-w-3xl rounded-lg object-cover ${className}`}
      />
    );
  }
  return (
    <IKContext urlEndpoint={urlEndpoint}>
      <IKImage
        path={path}
        transformation={[{ height: 400, width: 800, crop: "at_max" }]}
        loading="lazy"
        className={`w-full max-w-3xl rounded-lg object-cover ${className}`}
      />
    </IKContext>
  );
}

