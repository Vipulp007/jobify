import Job from '../models/Jobs.js';
import BadRequest from '../errors/badrequest.js';
import NotFound from '../errors/notfound.js';
import UnAuthenticate from '../errors/unauthenticate.js';
import checkpermission from '../checkpermission.js';
import mongoose from 'mongoose';
import moment from 'moment';
const createJob = async (req, res, next) => {
  const { position, company } = req.body;
  try {
    if (!position || !company)
      throw new BadRequest('please provide all details');
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(200).send({ job });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const updateJob = async (req, res) => {
  const { id: jobid } = req.params;
  const { position, company } = req.body;
  console.log(position, company, jobid);
  if (!position || !company) throw new BadRequest('provide all the details');
  const job = await Job.findOne({ _id: jobid });
  console.log(job);
  if (!job) throw new NotFound('no jobs found');
  checkpermission(req.user, job.createdBy);
  const updateJob = await Job.findOneAndUpdate({ _id: jobid }, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).send(updateJob);
};
const getAllJob = async (req, res, next) => {
  try {
    const { status, jobType, search, sort } = req.query;
    const query = {
      createdBy: mongoose.Types.ObjectId(req.user.userId),
    };
    if (status && status !== 'all') {
      query.status = status;
    }
    if (jobType && jobType !== 'all') {
      query.jobType = jobType;
    }
    if (search) {
      query.position = { $regex: search, $options: 'i' };
    }
    let result = Job.find(query);
    if (sort == 'oldest') result = result.sort('createdAt');
    if (sort == 'latest') result = result.sort('-createdAt');
    if (sort == 'a-z') result = result.sort('position');
    if (sort == 'z-a') result = result.sort('-position');

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    result.skip(skip).limit(limit);

    const jobs = await result;
    const totalJobs = await Job.countDocuments(query);
    const numofPage = Math.ceil(totalJobs / limit);
    res.status(200).send({ jobs, totalJobs, numofPage });
  } catch (error) {
    next(error);
  }
};
const deleteJob = async (req, res) => {
  const { id: jobid } = req.params;
  const job = await Job.findOne({ _id: jobid });
  if (!job) throw new NotFound('no job found');
  checkpermission(req.user, job.createdBy);
  await job.remove();
  res.status(200).send({ msg: 'job removed successfully' });
};
const showStats = async (req, res) => {
  try {
    let stats = await Job.aggregate([
      {
        $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) },
      },
      {
        $group: { _id: '$status', count: { $sum: 1 } },
      },
    ]);
    stats = stats.reduce((total, item) => {
      total[item._id] = item.count;
      return total;
    }, {});
    const defaultstats = {
      pending: stats.pending || 0,
      interview: stats.interview || 0,
      declined: stats.declined || 0,
    };
    let monthlyapplication = await Job.aggregate([
      { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 10 },
    ]);
    monthlyapplication = monthlyapplication.map((item) => {
      const date = moment()
        .month(item._id.month - 1)
        .year(item._id.year)
        .format('MMM y');
      const count = item.count;
      return { date, count };
    });
    res.status(200).send({ defaultstats, monthlyapplication });
  } catch (error) {
    console.log(error);
  }
};

export { createJob, updateJob, getAllJob, showStats, deleteJob };
