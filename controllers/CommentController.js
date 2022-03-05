const CommentModel = require('../models/Comment');

class CommentController {
  async create(req, res, next) {
    const { content, blog_id, comment_id } = req.body;
    const decoded = res.locals;

    const existedComment = comment_id
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

      if (existedComment) {
        await CommentModel.updateOne({
          id: existedComment._id
        }, {
          children: existedComment.children.concat(comment._id)
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
}

module.exports = new CommentController();
