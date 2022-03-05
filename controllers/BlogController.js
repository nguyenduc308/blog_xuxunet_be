const yup = require('yup');

const { slugify, sliceString } = require('../helpers/utils');
const NotFoundException = require('../exceptions/NotFoundException');

const BlogModel = require('../models/Blog');
const ViewModel = require('../models/View');
const CommentModel = require('../models/Comment');
const LikeModel = require('../models/Like');

class BlogController {
  async find(req, res) {
    const data = await BlogModel
        .find()
        .populate('categories')
        .populate('author', ['first_name', 'last_name', 'email'], 'users')
        .sort([['created_at', -1]])

    return res.status(200).json({
      statusCode: 200,
      success: true,
      data,
    });
  }

  async findBySlug(req, res) {
    const {slug} = req.params;
    const {from} = req.query;
    
    const blog = await BlogModel
        .findOne({slug})
        .populate('categories')
        .populate('author', ['first_name', 'last_name', 'email'], 'users', {
          sort: [['created_at', -1]]
        })
        .select('-comments')
        .populate('view');

    const comments = await CommentModel.find({blog: blog._id, parent: { $eq: null }})
                            .populate('children', null, 'comments')
                            .populate('user', ['first_name', 'last_name'], 'users')
                            .sort([['created_at', -1]]);
                    
    let viewCount = 0;

    if (from == 'client' && blog.view) {
      viewCount = blog.view.count + 1;

      await ViewModel.findByIdAndUpdate(blog.view._id, {
        count: viewCount,
        updated_at: new Date()
      });
    }

    return res.status(200).json({
      statusCode: 200,
      success: true,
      data: {
        blog,
        comments
      },
    });
  }

  async create(req, res, next) {
    let {
      title,
      blocks,
      status,
      excerpt,
      slug,
      image_url,
      show_image,
      categories,
    } = req.body;
    const author_id = res.locals.id;

    const firstParagraph = blocks.find(
      (block) => block.type === 'paragraph',
    );

    if (!excerpt && firstParagraph) {
      excerpt = firstParagraph.data.text;
    }

    try {
      const blog = new BlogModel({
        title,
        status,
        image_url,
        show_image,
        blocks,
        excerpt: sliceString(excerpt, 250, '') || '',
        slug: slug || slugify(title).toLowerCase(),
        author: author_id,
        categories,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const view = await ViewModel.create({
        blog: blog._id,
        count: 0,
        created_at: new Date(),
        updated_at: new Date(),
      });

      blog.view = view._id;
      await blog.save();

      return res.status(201).json({
        statusCode: 201,
        success: true,
        data: blog,
      });
    } catch (error) {
      console.log(error);

      return next(error);
    }
  }

  async update(req, res, next) {
    let {
      title,
      blocks,
      status,
      excerpt,
      slug,
      image_url,
      show_image,
      category_ids,
    } = req.body;
    const { id } = req.params;

    const blog = await model.findByPk(id);
    const block = await blockModel.findByPk(blocks.id);

    if (!blog) {
      return next(new NotFoundException(`Blog id {${id}} not found`));
    }

    if (!block) {
      return next(new NotFoundException(`Block id {${blocks.id}} not found`));
    }

    await blog.update({ title, status, excerpt, slug, show_image, image_url });
    await block.update(blocks);

    if (category_ids && category_ids.length) {
      await blog.setCategories(category_ids);
    }

    return res.status(200).json({
      statusCode: 200,
      success: true,
    });
  }

  async destroy(req, res, next) {
    return model
      .destroy({
        where: { id: req.params.id },
      })
      .then((value) => {
        if (typeof value === 'number' && value > 0) {
          return res.status(200).json({ success: true, statusCode: 200 });
        } else {
          next(new NotFoundException(`Blog id {${req.params.id}} not found`));
        }
      });
  }

  async like(req, res, next) {
    const { id } = req.params;
    const { type } = req.body;
    const user_id = res.locals;

    const blog = await model.findByPk(id);

    if (!blog) {
      return next(new NotFoundException('Blog id' + id + 'not found'));
    }

    const userLiked = await LikeModel.findOne({
      where: { user_id, blog_id: blog.getDataValue('id') },
    });

    if (userLiked) {
      await userLiked.destroy();

      return res.status(200).json({
        statusCode: 200,
        success: true,
        data: 'unliked',
      });
    }

    const like = await LikeModel.create({
      cat: 'post',
      type,
      user_id,
    });

    await blog.setLikes(like);

    return res.status(200).json({
      statusCode: 200,
      success: true,
      data: 'liked',
    });
  }

  get createSchema() {
    return yup.object({
      body: yup.object({
        title: yup.string().required(),
        status: yup.string().required(),
      }),
    });
  }
}

module.exports = new BlogController();
