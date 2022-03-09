const yup = require('yup');

const NotFoundException = require('../exceptions/NotFoundException');
const { slugify } = require('../helpers/utils');
const JarSheetModel = require('../models/JarSheet');
const JarModel = require('../models/Jar');

class JarController {
  async find(req, res) {
    const data = await JarSheetModel.find({deleted_at: {$eq: null}})
      .populate('jars');

    return res.status(200).json({
      statusCode: 200,
      success: true,
      data,
    });
  }

  async findBySlug(req, res, next) {
    const { slug } = req.params;

    const data = await JarSheetModel.findOne({
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

  async create(req, res) {
    const { 
      name, 
      description,
      income,
      index,
      jars
    } = req.body;
    
    const user = res.locals;

    const jarsheet = await JarSheetModel.create({
      name, 
      description,
      income,
      index,
      slug: slugify(name),
      user: user._id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const newJars = jars.map((jar, index) => {
      return JarModel.create({
        name: jar.name, 
        slug: slugify(jar.name),
        description: jar.description || '',
        color: jar.color,
        bg_color: jar.bg_color || null,
        percent: isNaN(jar.percent) ? 0 : Number(jar.percent),
        amount: jar.amount || Math.round(Number(jar.percent) * Number(income) / 100),
        index: jar.index || index, 
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date(),
        user: user._id,
        jarsheet: jarsheet._id
      })
    });

    await Promise.all(newJars).then(async (result) => {
      const ids = result.map((jar) => jar._id);
      await JarSheetModel.findByIdAndUpdate(jarsheet._id, {
        jars: ids
      })

      return true;
    });

    return res.status(201).json({
      success: true,
      statusCode: 201,
      data: jarsheet
    })
  }

  async update(req, res) {
    const {
      _id,
      name, 
      description,
      income,
      index,
      jars
    } = req.body;
    
    const user = res.locals;

    const jarsheet = await JarSheetModel.findByIdAndUpdate(_id,{
      name, 
      description,
      income,
      index,
      slug: slugify(name),
      updated_at: new Date(),
    });

    const updateJars = jars.map((jar, index) => {
      if (jar._id.indexOf('new') > -1) {
        return JarModel.create({
          name: jar.name, 
          slug: slugify(jar.name),
          description: jar.description || '',
          color: jar.color,
          bg_color: jar.bg_color || null,
          percent: isNaN(jar.percent) ? 0 : Number(jar.percent),
          amount: jar.amount || Math.round(Number(jar.percent) * Number(income) / 100),
          index: jar.index || index, 
          deleted_at: null,
          user: user._id,
          updated_at: new Date(),
          created_at: new Date(),
          jarsheet: jarsheet._id
        })
      } 
      return JarModel.findOneAndUpdate({
        _id: jar._id
      }, {
        name: jar.name, 
        slug: slugify(jar.name),
        description: jar.description || '',
        color: jar.color,
        bg_color: jar.bg_color || null,
        percent: isNaN(jar.percent) ? 0 : Number(jar.percent),
        amount: jar.amount || Math.round(Number(jar.percent) * Number(income) / 100),
        index: jar.index || index, 
        deleted_at: null,
        user: user._id,
        updated_at: new Date(),
        jarsheet: jarsheet._id
      }, {upsert: true})
    });

    await Promise.all(updateJars).then(async (result) => {
      const currentJars = jarsheet.jars;
      const newIds = result.map((jar) => jar._id).filter((jar) => {
        return !currentJars.includes(jar._id);
      });

      await JarSheetModel.findByIdAndUpdate(jarsheet._id, {
        jars: [...currentJars, ...newIds]
      })

      return true;
    });

    return res.status(200).json({
      success: true,
      statusCode: 200,
    })
  }

  async destroy(req, res, next) {
    return JarSheetModel
        .findOneAndUpdate({
          _id: req.params.id,
        }, {
          $set: {
            deleted_at: new Date(),
            deleted_by: res.locals.id,
            updated_at: new Date(),
          },
        }, {
          upsert: true,
          rawResult: true
        })
        .then((value) => {
          return res.status(200).json({ success: true, statusCode: 200, id: req.params.id});
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

module.exports = new JarController;