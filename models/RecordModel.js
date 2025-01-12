const mongoose = require("mongoose");
const Joi = require("joi");

// ApprovalScehma
const ApprovalSchema = new mongoose.Schema({
  // approved if hod accepts the approval request
  accepted: {
    type: Boolean,
    default: false,
  },
  // tracking who approved the request
  accepted_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
  },
  // flag for approval initiated
  sent_for_approval: {
    type: Boolean,
    default: false,
  },
  // approval requested by
  sent_for_approval_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
  },
  // status for approval
  declined: {
    type: Boolean,
    default: false,
  },
  // tracking who declined the request
  declined_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
  },
  // adding remark if requset gets declined
  remark: {
    type: String,
  },
});

// Record Schema
const RecordSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "students",
      required: true,
    },
    device_id: {
      type: String,
      default: null,
      required: true,
    },
    RID: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 6,
      maxlength: 255,
    },
    destination: {
      type: String,
      trim: true,
      required: true,
    },
    reason: {
      type: String,
      trim: true,
      required: true,
    },
    from: {
      type: String,
      trim: true,
      required: true,
    },
    to: {
      type: String,
      trim: true,
      required: true,
    },
    issuedDate: {
      type: Date,
      default: Date.now(),
    },
    status: {
      type: String,
      enum: ["ACCEPTED", "DECLINED", "PROCESS"],
      default: "PROCESS",
    },
    remark_by_warden: {
      type: {
        msg: String,
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "admin",
        },
      },
    },
    approval: ApprovalSchema,
  },
  { timestamps: true }
);

// VALIDATING STUDENT SCHEMA - ON LOGIN
function VALIDATE_RECORD(record) {
  const schema = Joi.object({
    RID: Joi.string().required(),
    student: Joi.required(),
    from: Joi.date().required(),
    to: Joi.date().required(),
    destination: Joi.string().required(),
    reason: Joi.string().max(200).required(),
    device_id: Joi.string().required(),
  });
  return schema.validate(record);
}

const RecordModel = new mongoose.model("records", RecordSchema);

module.exports = { RecordModel, VALIDATE_RECORD };
