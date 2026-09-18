import multer from "multer";
import path from "node:path"

const storage = multer.diskStorage({
  destination: (request, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (request, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
  }
})

const upload = multer({
  storage
})

export default upload