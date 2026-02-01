import mongoose from "mongoose";

const connectionsRequest = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    connnectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status_accepted: {
        type: Boolean,
        default: null,
    }
})

const ConnectionsRequest = mongoose.model("ConnectionsRequest", connectionsRequest);
export default ConnectionsRequest;