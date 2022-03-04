const yup = require('yup');

const sequelize = require('../database');
const NotFoundException = require('../exceptions/NotFoundException');
const { slugify } = require('../helpers/utils');

const { serial: Model, blog: BlogModel } = sequelize.models;

class SerialController {
  async find(req, res) {
    const data = await Model.findAll();

    return res.status(200).json({
      statusCode: 200,
      success: true,
      data,
    });
  }

  async findBySlug(req, res, next) {
    const { slug } = req.params;

    const data = await Model.findOne({
      where: { slug },
    });

    if (!data) {
      return next(new NotFoundException(`Serial slug {${slug}} not found`));
    }

    return res.status(200).json({
      statusCode: 200,
      success: true,
      data,
    });
  }

  async assignBlogToSerial(req, res, next) {
    const {id} = req.params;
    const {blog_id, index} = req.body;

    const serial = await Model.findByPk(id);

    if (!serial) {
      next(new NotFoundException(`Serial id {${id}} not found`));
    }

    const blog = await BlogModel.findByPk(blog_id);
    if (!blog) {
      next(new NotFoundException(`Blog id {${id}} not found`));
    }

    await serial.setBlogs(blog, {
      through: {index}
    });

    return res.status(200).json({
      success: true,
      statusCode: 200
    })
  }

  async create(req, res) {
    const { title, description, slug, imageUrl } = req.body;

    const serial = await Model.create({
      title,
      description,
      imageUrl,
      slug: slug ? slug : slugify(title),
    })

    return res.status(201).json({
      success: true,
      statusCode: 201,
      data: serial
    })
  }

  async update(req, res) {
    const { title, description, imageUrl } = req.body;
    const { id } = req.params;

    const serial = await Model.findByPk(id);

    await serial.update({ title, description, imageUrl })

    return res.status(200).json({
      success: true,
      statusCode: 200,
    })
  }

  async destroy(req, res, next) {
    return Model
      .destroy({
        where: { id: req.params.id },
      })
      .then((value) => {
        if (typeof value === 'number' && value > 0) {
          return res.status(200).json({ success: true, statusCode: 200 });
        } else {
          next(new NotFoundException(`Serial id {${req.params.id}} not found`));
        }
      });
  }


  get createSchema() {
    return yup.object({
      body: yup.object({
        title: yup.string().required(),
      }),
    });
  }
}

module.exports = new SerialController;