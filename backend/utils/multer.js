const multer = require("multer")

// Create Storage
const storage = multer.memoryStorage()

const upload = multer({
    storage
})

module.exports = upload