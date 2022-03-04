const sequelize = require('../database');

const { comment: CommentModel, user: UserModel } = sequelize.models;

class CommentController {
  async create(req, res, next) {
    const { content, blog_id, comment_id } = req.body;
    const user_id = res.locals;

    const existedComment = comment_id
      ? await CommentModel.findByPk(comment_id)
      : null;

    const t = await sequelize.transaction();

    try {
      const comment = await CommentModel.create({
        user_id,
        content,
        blog_id,
      });

      if (existedComment) {
        existedComment.addChildren(comment);
      }

      t.commit();

      const resp = await CommentModel.findByPk(comment.getDataValue('id'), {
        attributes: {
          exclude: ['user_id'],
        },
        include: [
          {
            model: UserModel,
            attributes: ['last_name', 'first_name', 'id', 'avatar_url'],
          },
        ],
      });

      return res.status(200).json({
        sussess: true,
        statusCode: 200,
        data: resp,
      });
    } catch (err) {
      console.log('Error create comment', err);

      t.rollback();
      next(err);
    }
  }
}

module.exports = new CommentController();
