const yup = require('yup');

const { slugify, sliceString } = require('../helpers/utils');
const NotFoundException = require('../exceptions/NotFoundException');

const BlogModel = require('../models/Blog');

class BlogController {
  async find(req, res) {
    const data = await BlogModel
        .find()
        .populate('categories')
        .populate('author', ['first_name', 'last_name', 'email'], 'users');

    return res.status(200).json({
      statusCode: 200,
      success: true,
      data,
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
      const blog = await BlogModel.create({
        title,
        status,
        image_url,
        show_image,
        blocks,
        excerpt: sliceString(excerpt, 250, '') || '',
        slug: slug || slugify(title).toLowerCase(),
        author: author_id,
        categories,
      });


      // const id = blog.getDataValue('id');

      // const view = await ViewModel.create({
      //   count: 0,
      // });
      // await blog.setView(view);

      // if (category_ids && category_ids.length) {
      //   await blog.setCategories(category_ids);
      // }

      // await blockModel.create({
      //   data: blocks,
      //   blog_id: id,
      // });


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
