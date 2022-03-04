class RateController {
  async create(req, res) {
    let { monthly: m, rate: r, count: n } = req.body;

    r = r / 100; 

    const total = Math.floor(((m * 12)/r)*((1 + r)**n - 1)*(1 + r));

    const schema = Array.from({length: n}).map((_, index) => {
        const year = index + 1;
        const total =  Math.floor(((m * 12)/r)*((1 + r)**year - 1)*(1 + r));
        const amount = m * 12 * year;

        return {
            id: index,
            year: year,
            total,
            amount,
            interest: total - amount, 
        }
    });

    res.status(200).json({
        total, 
        schema,
        monthly: m,
        rate: r * 100,
        count: n
    });
  }
}

module.exports = new RateController;