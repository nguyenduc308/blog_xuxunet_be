const yup =  require('yup');

const sequelize =  require('../database');
const { slugify } =  require('../helpers/utils');
const NotFoundException =  require('../exceptions/NotFoundException');

const {
  category: model,
  block: blockModel,
  user: userModel,
} = sequelize.models;

class BlogController {
  async find(req, res) {
    const data = await model.findAll();

    return res.status(200).json({
      statusCode: 200,
      success: true,
      data,
    });
  }

  async findBySlug(req, res, next) {
    const { slug } = req.params;

    const data = await model.findOne({
      where: { slug },
    });

    if (!data) {
      return next(new NotFoundException(`Category slug {${slug}} not found`));
    }

    return res.status(200).json({
      statusCode: 200,
      success: true,
      data,
    });
  }

  async create(req, res) {
    let { name, slug, description, color, bg_color, status } = req.body;

    const category = await model.create({
      name,
      color,
      status,
      bg_color,
      description,
      slug: slug || slugify(name).toLowerCase(),
    });

    return res.status(201).json({
      statusCode: 201,
      success: true,
      data: category,
    });
  }

  async update(req, res, next) {
    let { name, slug, description, color, bg_color, status } = req.body;
    const { id } = req.params;

    const cat = await model.findByPk(id);

    if (!cat) {
      return next(new NotFoundException(`Blog id {${id}} not found`));
    }

    await cat.update({ name, slug, description, color, bg_color, status });

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

  get createSchema() {
    return yup.object({
      body: yup.object({
        slug: yup.string(),
        color: yup.string(),
        bg_color: yup.string(),
        description: yup.string(),
        name: yup.string().required(),
        status: yup.string().required(),
      }),
    });
  }
}

module.exports = new BlogController();
