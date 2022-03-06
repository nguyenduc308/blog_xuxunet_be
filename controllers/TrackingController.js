const NotFoundException =  require('../exceptions/NotFoundException');
const TrackingModel = require('../models/Tracking');

class TrackingController {
  async find(req, res) {
    const data = await TrackingModel.find();

    return res.status(200).json({
      statusCode: 200,
      success: true,
      data,
    });
  }
  async create(req, res) {
    let { name, description } = req.body;

    const tracking = await TrackingModel.create({
      name,
      description,
      code: Math.random().toString(16).slice(2),
      user: res.locals.id,
      expired_at: null,
      deleted_at: null,
    });

    return res.status(201).json({
      statusCode: 201,
      success: true,
      data: tracking,
    });
  }

  async tracking(req, res) {


    const tracker = await TrackingModel.findOne({
      code: req.params.code
    }).lean();

    if (!tracker) {
      return res.status(200).json({
        success: false,
      });
    }


    const ref = {
      userAgent: req.headers['user-agent'],
      referrer: '/',
      date: new Date(),
    }

    tracker.ref = tracker.ref ? [ref, ...tracker.ref]: [ref];
    tracker.clicks = tracker.clicks + 1;

    await TrackingModel.findByIdAndUpdate(tracker._id, tracker);

    return res.status(200).json({
      success: true,
    });
  }
}

module.exports = new TrackingController();
