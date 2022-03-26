const CommentModel = require('../models/Comment');
const UserModel = require('../models/User');

class CommentController {
  async find(req, res, next) {
    const comments = await CommentModel.find()
      // .populate({
      //   path: 'children',
      //   model: CommentModel,
      //   populate: {
      //     path: 'user',
      //     model: UserModel,
      //     select: ['first_name', 'last_name']
      //   }
      // })
      .populate('blog', ['title', 'slug', '_id'], 'blogs')
      .populate('user', ['first_name', 'last_name'], 'users')
      .select('-children')
      .sort([['created_at', -1]]);
    
    return res.status(200).json({
      statusCode: 200,
      success: true,
      data: comments
    });
  }

  async create(req, res, next) {
    const { content, blog_id, comment_id } = req.body;
    const decoded = res.locals;

    const parrentComment = comment_id
      ? await CommentModel.findById(comment_id).lean()
      : null;


    try {
      const comment = new CommentModel({
        blog: blog_id,
        content,
        user: decoded.id,
        created_at: new Date(),
        updated_at: new Date(),
        parent: comment_id || null
      });

      if (parrentComment) {
        await CommentModel.findByIdAndUpdate(parrentComment._id, {
          children: [...parrentComment.children, comment._id]
        });
      }

      await comment.save();

      const resp = await CommentModel.findById(comment._id).populate('user', ['first_name', 'last_name'], 'users').lean()

      return res.status(200).json({
        sussess: true,
        statusCode: 200,
        data: resp
      });
    } catch (err) {
      next(err);
    }
  }

  async destroy(req, res, next) {
    return CommentModel
      .findOneAndDelete({
        _id: req.params.id,
      })
      .then(async (value) => {
        if (!value) {
          return res.status(200).json({
            success: false,
            statusCode: 404,
          })
        }

        if (value.children.length) {
          await CommentModel.deleteMany({
            _id: {
              $in: value.children
            }
          })
        }

        return res.status(200).json({ success: true, statusCode: 200, id: req.params.id, children: value.children});
      });
  }
}

module.exports = new CommentController();
