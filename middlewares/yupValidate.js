exports.validate = (schema) =>
  async (req, res, next) => {
    if (!schema) {
      return next();
    }

    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
    } catch (err) {
      return res.status(400).json({
        success: false,
        type: err.name,
        field: {
          type: err.type,
          name: err.path,
        },
        error: err.message,
      });
    }
  };
