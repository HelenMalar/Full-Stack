const mongoose = require("mongoose");
const formSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    data: Object
});
module.exports = mongoose.model("FormData", formSchema);