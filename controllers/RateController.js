class RateController {
  async create(req, res) {
    let { monthly: m, rate: r, count: n, nav } = req.body;

    r = r / 100;
    nav = nav || 0;

    const total = Math.floor(((m * 12)/r)*((1 + r)**n - 1)*(1 + r));
    const totalNav = Math.floor(nav*((1 + r)**n));

    const schema = Array.from({length: n}).map((_, index) => {
        const year = index + 1;
        const totalOfMonth =  Math.floor(((m * 12)/r)*((1 + r)**year - 1)*(1 + r));
        const totalNavOfMonth = Math.floor(nav*((1 + r)**year));

        const amount = m * 12 * year + nav;

        return {
            id: index,
            year: year,
            total: totalNavOfMonth + totalOfMonth,
            amount,
            interest: totalNavOfMonth + totalOfMonth - amount, 
        }
    });

    res.status(200).json({
        total: total + totalNav, 
        schema,
        monthly: m,
        rate: r * 100,
        count: n,
        nav,
    });
  }
}

module.exports = new RateController;