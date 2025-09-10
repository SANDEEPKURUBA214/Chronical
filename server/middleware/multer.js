import multer from "multer";

const storage = multer.memoryStorage(); // use memoryStorage, not diskStorage
const upload = multer({ storage });

export default upload;



