
import models = require('../models/index')
import { Request, Response, NextFunction } from 'express'

class ErrorWithParent extends Error {
  parent: Error | undefined
}

module.exports = function testSQLInjectionCode () {
  return (req: Request, res: Response, next: NextFunction) => {
    let criteria: any = req.query.q === 'undefined' ? '' : req.query.q ?? ''
    criteria = (criteria.length <= 200) ? criteria : criteria.substring(0, 200)

    const query = `SELECT * FROM Products WHERE ((name LIKE '%${criteria}%' OR description LIKE '%${criteria}%') AND deletedAt IS NULL) ORDER BY name`
    models.sequelize.query(query)
      .then((products: any) => {
        res.json(products)
      })
      .catch((error: ErrorWithParent) => {
        next(error)
      })
  }
}
